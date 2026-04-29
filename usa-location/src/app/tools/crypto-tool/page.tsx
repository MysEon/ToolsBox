'use client';

import CryptoTool from '@/tools/crypto-tool/components/CryptoTool';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import ToolPageHeader from '@/shared/components/ToolPageHeader';

export default function CryptoToolPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <ToolPageHeader
        title="双向文本加密解密"
        subtitle="支持主流加密算法和古典密码的专业加密解密工具"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary><CryptoTool /></ErrorBoundary>
      </main>
    </div>
  );
}
