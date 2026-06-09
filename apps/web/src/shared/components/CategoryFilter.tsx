'use client';

import { Filter } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2 text-[var(--tb-text-muted)] shrink-0">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">分类筛选:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-[var(--tb-accent)] text-white shadow-[0_0_12px_var(--tb-glow)]'
                : 'bg-[var(--tb-surface)] text-[var(--tb-text-muted)] border border-[var(--tb-border)] hover:border-[var(--tb-accent)] hover:text-[var(--tb-accent)]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
