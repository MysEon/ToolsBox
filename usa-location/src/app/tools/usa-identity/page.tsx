'use client';

import React, { useState } from 'react';
import Header from '../../../shared/components/Layout/Header';
import GeneratorSettings from '../../../tools/usa-identity/components/GeneratorSettings';
import GeneratorResults from '../../../tools/usa-identity/components/GeneratorResults';
import MapComponent from '../../../tools/usa-identity/components/MapComponent';
import { CompleteProfile } from '../../../tools/usa-identity/utils/addressGenerator';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

export default function USAIdentityGenerator() {
  const [generatedProfiles, setGeneratedProfiles] = useState<CompleteProfile[]>([]);

  // 处理生成的档案数据
  const handleProfilesGenerated = (profiles: CompleteProfile[]) => {
    setGeneratedProfiles(profiles);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <Header 
        showBackButton={true}
        title="美国虚拟身份生成器"
        subtitle="专业的测试数据生成工具"
      />

      {/* 主要内容 - 左右分栏布局 */}
      <ErrorBoundary>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* 左侧：生成设置 (30%) */}
          <div className="lg:col-span-3">
            <GeneratorSettings onProfilesGenerated={handleProfilesGenerated} />
          </div>

          {/* 右侧：生成结果和地图 (70%) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 生成结果 */}
            <GeneratorResults profiles={generatedProfiles} />

            {/* 地图部分 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <MapComponent profiles={generatedProfiles} />
            </div>
          </div>
        </div>
      </main>
      </ErrorBoundary>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 主要页脚内容 */}
          <div className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* 产品信息 */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 text-blue-400">🇺🇸</div>
                  <h3 className="text-lg font-semibold">美国虚拟身份生成器</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  专业的美国虚拟身份数据生成工具，为开发者和测试人员提供高质量的测试数据。
                </p>
              </div>

              {/* 功能特性 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">功能特性</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span>真实地址生成</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span>个人信息生成</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span>地图可视化</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span>批量导出</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span>免税州筛选</span>
                  </li>
                </ul>
              </div>

              {/* 使用指南 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">使用指南</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>
                    <span className="hover:text-blue-400 transition-colors">
                      选择筛选条件
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-blue-400 transition-colors">
                      设置生成数量
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-blue-400 transition-colors">
                      查看地图定位
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-blue-400 transition-colors">
                      导出数据
                    </span>
                  </li>
                </ul>
              </div>

              {/* 法律声明 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <span className="text-yellow-400">⚠️</span>
                  <span>法律声明</span>
                </h3>
                <div className="text-sm text-gray-300 space-y-2">
                  <p>
                    本工具生成的所有信息均为虚构数据，仅供测试和开发使用。
                  </p>
                  <p className="text-yellow-300">
                    请勿用于任何非法用途或欺诈行为
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 底部版权信息 */}
          <div className="border-t border-gray-800 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-gray-400">
                © 2024 开发者工具箱 - 美国虚拟身份生成器. 保留所有权利.
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <a href="#" className="hover:text-blue-400 transition-colors">
                  隐私政策
                </a>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  使用条款
                </a>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  联系我们
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
