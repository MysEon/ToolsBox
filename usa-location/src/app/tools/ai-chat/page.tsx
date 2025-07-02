'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import AIChatTool from '@/tools/ai-chat/components/AIChatTool';

export default function AIChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                返回首页
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">🤖 AI问答助手</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  支持双对话框独立运行，兼容OpenAI、DeepSeek、Gemini接口，支持PDF文件上传解析
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AIChatTool />
      </main>
    </div>
  );
}
