'use client';

import { useState } from 'react';
import { Shield, Clock, Info } from 'lucide-react';
import ModernCrypto from './ModernCrypto';
import ClassicalCrypto from './ClassicalCrypto';

export default function CryptoTool() {
  const [activeTab, setActiveTab] = useState<'modern' | 'classical'>('modern');

  return (
    <div className="space-y-6">
      {/* 工具介绍 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">双向文本加密解密工具</h1>
            <p className="text-gray-600">支持主流加密算法和古典密码的专业加密解密工具</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold text-gray-900">主流加密算法</h3>
            </div>
            <p className="text-gray-600 text-sm">
              包含AES、DES、3DES等现代密码学算法，以及Base64编码和哈希函数
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <h3 className="font-semibold text-gray-900">古典加密算法</h3>
            </div>
            <p className="text-gray-600 text-sm">
              包含凯撒密码、维吉尼亚密码、摩斯密码等传统加密方法
            </p>
          </div>
        </div>
      </div>

      {/* 左右布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：主流加密算法 */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-900">主流加密算法</h2>
            </div>
            <p className="text-sm text-gray-600 mt-1">现代密码学加密算法和编码方式</p>
          </div>
          <div className="p-6">
            <ModernCrypto />
          </div>
        </div>

        {/* 右侧：古典加密算法 */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <h2 className="text-lg font-semibold text-gray-900">古典加密算法</h2>
            </div>
            <p className="text-sm text-gray-600 mt-1">传统密码学和历史加密方法</p>
          </div>
          <div className="p-6">
            <ClassicalCrypto />
          </div>
        </div>
      </div>

      {/* 安全提示 */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800 mb-1">安全提示</h3>
            <ul className="text-amber-700 text-sm space-y-1">
              <li>• 本工具仅供学习和测试使用，请勿用于加密敏感信息</li>
              <li>• 古典加密算法安全性较低，不适用于现代安全需求</li>
              <li>• 哈希算法（MD5、SHA-256）是单向的，无法解密</li>
              <li>• 请妥善保管您的密钥，丢失密钥将无法解密数据</li>
              <li>• 建议在生产环境中使用更安全的加密方案</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
