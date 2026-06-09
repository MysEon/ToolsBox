'use client';

import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
  preventDefault?: boolean;
}

interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

export const useKeyboardShortcuts = ({ shortcuts, enabled = true }: UseKeyboardShortcutsOptions) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // 忽略在输入框中的按键
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.contentEditable === 'true'
    ) {
      // 只允许特定的快捷键在输入框中工作
      const allowedInInputs = ['Escape'];
      if (!allowedInInputs.includes(event.key)) {
        return;
      }
    }

    for (const shortcut of shortcuts) {
      const keyMatch = shortcut.key.toLowerCase() === event.key.toLowerCase();
      const ctrlMatch = !!shortcut.ctrlKey === event.ctrlKey;
      const altMatch = !!shortcut.altKey === event.altKey;
      const shiftMatch = !!shortcut.shiftKey === event.shiftKey;
      const metaMatch = !!shortcut.metaKey === event.metaKey;

      if (keyMatch && ctrlMatch && altMatch && shiftMatch && metaMatch) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }
        shortcut.action();
        break;
      }
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
};

// 预定义的快捷键
export const createDefaultShortcuts = (actions: {
  openSearch?: () => void;
  closeModal?: () => void;
  toggleTheme?: () => void;
  goHome?: () => void;
}): KeyboardShortcut[] => {
  const shortcuts: KeyboardShortcut[] = [];

  if (actions.openSearch) {
    shortcuts.push({
      key: 'k',
      ctrlKey: true,
      action: actions.openSearch,
      description: '打开搜索',
    });
  }

  if (actions.closeModal) {
    shortcuts.push({
      key: 'Escape',
      action: actions.closeModal,
      description: '关闭弹窗',
    });
  }

  if (actions.toggleTheme) {
    shortcuts.push({
      key: 't',
      ctrlKey: true,
      shiftKey: true,
      action: actions.toggleTheme,
      description: '切换主题',
    });
  }

  if (actions.goHome) {
    shortcuts.push({
      key: 'h',
      ctrlKey: true,
      action: actions.goHome,
      description: '返回首页',
    });
  }

  return shortcuts;
};

// 快捷键帮助组件的数据
export const getShortcutHelp = (shortcuts: KeyboardShortcut[]) => {
  return shortcuts.map(shortcut => {
    const keys = [];
    if (shortcut.ctrlKey) keys.push('Ctrl');
    if (shortcut.altKey) keys.push('Alt');
    if (shortcut.shiftKey) keys.push('Shift');
    if (shortcut.metaKey) keys.push('Cmd');
    keys.push(shortcut.key.toUpperCase());

    return {
      keys: keys.join(' + '),
      description: shortcut.description,
    };
  });
};
