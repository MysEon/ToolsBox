'use client';

import ToolPageHeader from '@/shared/components/ToolPageHeader';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import MarkdownEditor from '@/tools/markdown-editor/components/MarkdownEditor';

export default function Page() {
  return (
    <div className="min-h-screen tb-app-bg">
      <ToolPageHeader title="Markdown 编辑器" subtitle="分屏实时预览、代码高亮与 HTML 导出" />
      <main className="w-[90%] max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary>
          <MarkdownEditor />
        </ErrorBoundary>
      </main>
    </div>
  );
}
