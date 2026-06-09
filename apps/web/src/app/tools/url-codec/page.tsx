'use client';

import ToolPageHeader from '@/shared/components/ToolPageHeader';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import UrlCodec from '@/tools/url-codec/components/UrlCodec';

export default function Page() {
  return (
    <div className="min-h-screen tb-app-bg">
      <ToolPageHeader title="URL 编解码" subtitle="URL 编码解码、查询参数解析与批量处理" />
      <main className="w-[80%] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary>
          <UrlCodec />
        </ErrorBoundary>
      </main>
    </div>
  );
}
