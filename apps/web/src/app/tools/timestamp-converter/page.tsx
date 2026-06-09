'use client';

import ToolPageHeader from '@/shared/components/ToolPageHeader';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import TimestampConverter from '@/tools/timestamp-converter/components/TimestampConverter';

export default function Page() {
  return (
    <div className="min-h-screen tb-app-bg">
      <ToolPageHeader title="时间戳转换器" subtitle="Unix 时间戳、可读时间与多时区快速互转" />
      <main className="w-[80%] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary>
          <TimestampConverter />
        </ErrorBoundary>
      </main>
    </div>
  );
}
