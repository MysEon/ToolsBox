'use client';

import MiniGames from '@/tools/mini-games/components/MiniGames';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import ToolPageHeader from '@/shared/components/ToolPageHeader';

export default function MiniGamesPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <ToolPageHeader
        title="小游戏合集"
        subtitle="休闲娱乐，放松一下"
      />

      <main className="w-[80%] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary><MiniGames /></ErrorBoundary>
      </main>
    </div>
  );
}
