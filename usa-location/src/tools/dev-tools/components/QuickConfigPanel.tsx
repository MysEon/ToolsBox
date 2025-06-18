'use client';

import { useState } from 'react';
import { Settings, Copy, Download, CheckCircle, Monitor, Smartphone, Laptop } from 'lucide-react';
import { dockerMirrors, quickConfigTemplates } from '../data/dockerCenter';
import { DockerMirror, QuickConfigTemplate } from '../types/dockerCenter';

interface QuickConfigPanelProps {
  className?: string;
}

export function QuickConfigPanel({ className = '' }: QuickConfigPanelProps) {
  const [selectedMirror, setSelectedMirror] = useState<DockerMirror>(dockerMirrors[1]); // 默认选择阿里云
  const [selectedPlatform, setSelectedPlatform] = useState<'windows' | 'macos' | 'linux'>('linux');
  const [copiedConfig, setCopiedConfig] = useState<string | null>(null);

  // 生成配置内容
  const generateConfig = (template: QuickConfigTemplate): string => {
    let config = template.template;
    
    // 替换变量
    template.variables.forEach(variable => {
      switch (variable) {
        case 'MIRROR_URL':
          config = config.replace(`{{${variable}}}`, selectedMirror.url);
          break;
        default:
          config = config.replace(`{{${variable}}}`, '');
      }
    });
    
    return config;
  };

  // 复制配置到剪贴板
  const copyToClipboard = async (content: string, configId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedConfig(configId);
      setTimeout(() => setCopiedConfig(null), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  // 下载配置文件
  const downloadConfig = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 获取平台图标
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'windows':
        return <Monitor className="h-4 w-4" />;
      case 'macos':
        return <Laptop className="h-4 w-4" />;
      case 'linux':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  // 获取当前平台的配置模板
  const currentTemplate = quickConfigTemplates.find(t => t.platform === selectedPlatform);

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${className}`}>
      {/* 头部 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Settings className="h-6 w-6 text-green-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">快速配置助手</h3>
            <p className="text-sm text-gray-600 mt-1">
              一键生成Docker镜像源配置，加速镜像下载
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 镜像源选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            选择镜像源
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {dockerMirrors.map((mirror) => (
              <button
                key={mirror.id}
                onClick={() => setSelectedMirror(mirror)}
                className={`p-3 border-2 rounded-lg text-left transition-all duration-200 ${
                  selectedMirror.id === mirror.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{mirror.name}</h4>
                  {selectedMirror.id === mirror.id && (
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600">{mirror.description}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-xs text-gray-500">{mirror.location}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{mirror.provider}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 平台选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            选择操作系统
          </label>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {(['windows', 'macos', 'linux'] as const).map((platform) => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`flex items-center space-x-2 px-4 py-2 border-2 rounded-lg transition-all duration-200 ${
                  selectedPlatform === platform
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {getPlatformIcon(platform)}
                <span className="capitalize">{platform}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 配置生成 */}
        {currentTemplate && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                生成的配置文件
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => copyToClipboard(generateConfig(currentTemplate), currentTemplate.id)}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                >
                  {copiedConfig === currentTemplate.id ? (
                    <>
                      <CheckCircle className="h-3 w-3" />
                      <span>已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>复制</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => downloadConfig(generateConfig(currentTemplate), 'daemon.json')}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                >
                  <Download className="h-3 w-3" />
                  <span>下载</span>
                </button>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                {generateConfig(currentTemplate)}
              </pre>
            </div>
            
            <div className="mt-3 text-sm text-gray-600">
              <p className="font-medium mb-2">{currentTemplate.description}</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <h5 className="font-medium text-yellow-800 mb-2">配置说明:</h5>
                <ul className="space-y-1 text-yellow-700">
                  {selectedPlatform === 'linux' && (
                    <>
                      <li>• 将配置保存为 <code className="bg-yellow-100 px-1 rounded">/etc/docker/daemon.json</code></li>
                      <li>• 重启Docker服务: <code className="bg-yellow-100 px-1 rounded">sudo systemctl restart docker</code></li>
                    </>
                  )}
                  {selectedPlatform === 'windows' && (
                    <>
                      <li>• 打开Docker Desktop设置</li>
                      <li>• 在Docker Engine页面粘贴配置</li>
                      <li>• 点击"Apply & Restart"</li>
                    </>
                  )}
                  {selectedPlatform === 'macos' && (
                    <>
                      <li>• 打开Docker Desktop设置</li>
                      <li>• 在Docker Engine页面粘贴配置</li>
                      <li>• 点击"Apply & Restart"</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 验证配置 */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-3">验证配置是否生效</h4>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="bg-blue-900 text-blue-100 p-3 rounded font-mono">
              docker info
            </div>
            <p>查看输出中的 "Registry Mirrors" 部分，确认镜像源已配置成功。</p>
            
            <div className="bg-blue-900 text-blue-100 p-3 rounded font-mono mt-3">
              docker pull hello-world
            </div>
            <p>测试拉取镜像，验证加速效果。</p>
          </div>
        </div>

        {/* 常见问题 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">常见问题</h4>
          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <h5 className="font-medium text-gray-900">Q: 配置后仍然很慢怎么办？</h5>
              <p>A: 可以尝试更换其他镜像源，或者配置多个镜像源作为备选。</p>
            </div>
            <div>
              <h5 className="font-medium text-gray-900">Q: 如何恢复默认配置？</h5>
              <p>A: 删除daemon.json文件中的registry-mirrors配置项，然后重启Docker。</p>
            </div>
            <div>
              <h5 className="font-medium text-gray-900">Q: 企业环境如何配置？</h5>
              <p>A: 企业环境建议搭建私有镜像仓库，如Harbor，并配置相应的认证信息。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
