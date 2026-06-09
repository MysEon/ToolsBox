'use client';

import { useState } from 'react';
import { Shield, Clock, Info } from 'lucide-react';
import ModernCrypto from './ModernCrypto';
import ClassicalCrypto from './ClassicalCrypto';

export default function CryptoTool() {
  const [activeTab, setActiveTab] = useState<'modern' | 'classical'>('modern');

  return (
    <div className="space-y-8">
      {/* Intro cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setActiveTab('modern')}
          className={`text-left p-5 rounded-xl border transition-colors ${
            activeTab === 'modern'
              ? 'border-blue-500/50 bg-blue-50/50 dark:bg-blue-900/10'
              : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">主流加密算法</h3>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            AES、DES、3DES等现代密码学算法，以及Base64编码和哈希函数
          </p>
        </button>

        <button
          onClick={() => setActiveTab('classical')}
          className={`text-left p-5 rounded-xl border transition-colors ${
            activeTab === 'classical'
              ? 'border-amber-500/50 bg-amber-50/50 dark:bg-amber-900/10'
              : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">古典加密算法</h3>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            凯撒密码、维吉尼亚密码、摩斯密码等传统加密方法
          </p>
        </button>
      </div>

      {/* Active panel */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        <div className="border-b border-zinc-200 dark:border-zinc-700 px-6 py-4">
          <div className="flex items-center gap-2">
            {activeTab === 'modern' ? (
              <Shield className="h-5 w-5 text-blue-500" />
            ) : (
              <Clock className="h-5 w-5 text-amber-500" />
            )}
            <div>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {activeTab === 'modern' ? '主流加密算法' : '古典加密算法'}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {activeTab === 'modern' ? '现代密码学加密算法和编码方式' : '传统密码学和历史加密方法'}
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          {activeTab === 'modern' ? <ModernCrypto /> : <ClassicalCrypto />}
        </div>
      </div>

      {/* Security notice */}
      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div className="text-sm text-amber-700 dark:text-amber-400">
            <p className="font-medium mb-1.5">安全提示</p>
            <ul className="space-y-1 text-amber-600/80 dark:text-amber-400/80">
              <li>本工具仅供学习和测试使用，请勿用于加密敏感信息</li>
              <li>古典加密算法安全性较低，不适用于现代安全需求</li>
              <li>哈希算法（MD5、SHA-256）是单向的，无法解密</li>
              <li>请妥善保管您的密钥，丢失密钥将无法解密数据</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
