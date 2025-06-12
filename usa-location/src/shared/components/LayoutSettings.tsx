'use client';

import React, { useState } from 'react';
import { Settings, Grid, Maximize2, Minimize2, X } from 'lucide-react';

export type LayoutDensity = 'compact' | 'standard' | 'spacious';
export type GridColumns = 'auto' | '3' | '4' | '5' | '6';

interface LayoutSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  layoutDensity: LayoutDensity;
  gridColumns: GridColumns;
  onLayoutDensityChange: (density: LayoutDensity) => void;
  onGridColumnsChange: (columns: GridColumns) => void;
}

export function LayoutSettings({
  isOpen,
  onClose,
  layoutDensity,
  gridColumns,
  onLayoutDensityChange,
  onGridColumnsChange
}: LayoutSettingsProps) {
  if (!isOpen) return null;

  const densityOptions = [
    { value: 'compact' as LayoutDensity, label: '紧凑', description: '最大化空间利用' },
    { value: 'standard' as LayoutDensity, label: '标准', description: '平衡的布局' },
    { value: 'spacious' as LayoutDensity, label: '宽松', description: '更多留白空间' }
  ];

  const columnOptions = [
    { value: 'auto' as GridColumns, label: '自动', description: '根据屏幕自适应' },
    { value: '3' as GridColumns, label: '3列', description: '固定3列显示' },
    { value: '4' as GridColumns, label: '4列', description: '固定4列显示' },
    { value: '5' as GridColumns, label: '5列', description: '固定5列显示' },
    { value: '6' as GridColumns, label: '6列', description: '固定6列显示' }
  ];

  return (
    <>
      {/* 遮罩层 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* 设置面板 */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-50 w-full max-w-md mx-4">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              布局设置
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 space-y-6">
          {/* 布局密度设置 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <Maximize2 className="h-4 w-4 mr-2" />
              布局密度
            </h3>
            <div className="space-y-2">
              {densityOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {option.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 网格列数设置 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <Grid className="h-4 w-4 mr-2" />
              网格列数
            </h3>
            <div className="space-y-2">
              {columnOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {option.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 底部 */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-b-xl">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              完成
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// 布局设置按钮组件
export function LayoutSettingsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      title="布局设置"
    >
      <Settings className="h-5 w-5" />
    </button>
  );
}
