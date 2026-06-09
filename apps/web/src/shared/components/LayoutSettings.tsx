'use client';

import React from 'react';
import { Settings, Grid, Maximize2 } from 'lucide-react';
import { LayoutDensity, GridColumns } from '../types/layout';
export type { LayoutDensity, GridColumns };
import Modal from './Modal';

interface LayoutSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  layoutDensity: LayoutDensity;
  gridColumns: GridColumns;
  onLayoutDensityChange: (density: LayoutDensity) => void;
  onGridColumnsChange: (columns: GridColumns) => void;
}

const densityOptions = [
  { value: 'compact' as LayoutDensity, label: '紧凑', description: '最大化空间利用' },
  { value: 'standard' as LayoutDensity, label: '标准', description: '平衡的布局' },
  { value: 'spacious' as LayoutDensity, label: '宽松', description: '更多留白空间' },
];

const columnOptions = [
  { value: 'auto' as GridColumns, label: '自动', description: '根据屏幕自适应' },
  { value: '3' as GridColumns, label: '3列', description: '固定3列显示' },
  { value: '4' as GridColumns, label: '4列', description: '固定4列显示' },
  { value: '5' as GridColumns, label: '5列', description: '固定5列显示' },
  { value: '6' as GridColumns, label: '6列', description: '固定6列显示' },
];

export function LayoutSettings({
  isOpen,
  onClose,
  layoutDensity,
  gridColumns,
  onLayoutDensityChange,
  onGridColumnsChange,
}: LayoutSettingsProps) {
  return (
    <Modal open={isOpen} onClose={onClose} title="布局设置" size="sm">
      <div className="space-y-6">
        {/* Layout density */}
        <div>
          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3 flex items-center">
            <Maximize2 className="h-4 w-4 mr-2" />
            布局密度
          </h3>
          <div className="space-y-2">
            {densityOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
              >
                <input
                  type="radio"
                  name="density"
                  value={option.value}
                  checked={layoutDensity === option.value}
                  onChange={(e) => onLayoutDensityChange(e.target.value as LayoutDensity)}
                  className="mr-3 text-blue-600"
                />
                <div>
                  <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{option.label}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Grid columns */}
        <div>
          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3 flex items-center">
            <Grid className="h-4 w-4 mr-2" />
            网格列数
          </h3>
          <div className="space-y-2">
            {columnOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
              >
                <input
                  type="radio"
                  name="columns"
                  value={option.value}
                  checked={gridColumns === option.value}
                  onChange={(e) => onGridColumnsChange(e.target.value as GridColumns)}
                  className="mr-3 text-blue-600"
                />
                <div>
                  <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{option.label}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function LayoutSettingsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
      title="布局设置"
    >
      <Settings className="h-5 w-5" />
    </button>
  );
}
