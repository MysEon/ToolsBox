import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-4">
        <Icon className="h-10 w-10 text-zinc-400 dark:text-zinc-500" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">{title}</h3>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-6">{description}</p>
      {action}
    </div>
  );
}
