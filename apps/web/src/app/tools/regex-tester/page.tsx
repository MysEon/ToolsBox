'use client';

import ToolPageHeader from '@/shared/components/ToolPageHeader';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import RegexTester from '@/tools/regex-tester/components/RegexTester';

export default function Page() {
  return (
    <div className="min-h-screen tb-app-bg">
      <ToolPageHeader title="正则表达式测试器" subtitle="实时匹配、捕获组分析与常用正则模板" />
      <main className="w-[80%] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary>
          <RegexTester />
        </ErrorBoundary>
      </main>
    </div>
  );
}
