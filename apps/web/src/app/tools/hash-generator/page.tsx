'use client';

import ToolPageHeader from '@/shared/components/ToolPageHeader';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import HashGenerator from '@/tools/hash-generator/components/HashGenerator';

export default function Page() {
  return (
    <div className="min-h-screen tb-app-bg">
      <ToolPageHeader title="Hash 生成器" subtitle="为文本和文件生成 MD5、SHA1、SHA256、SHA512 摘要" />
      <main className="w-[80%] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary>
          <HashGenerator />
        </ErrorBoundary>
      </main>
    </div>
  );
}
