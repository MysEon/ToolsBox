import { Tool } from '../data/tools';

/**
 * 搜索工具函数
 * @param tools 工具列表
 * @param searchTerm 搜索关键词
 * @returns 过滤后的工具列表
 */
export function searchTools(tools: Tool[], searchTerm: string): Tool[] {
  if (!searchTerm.trim()) {
    return tools;
  }

  const term = searchTerm.toLowerCase().trim();

  return tools.filter(tool => {
    // 搜索工具名称
    if (tool.name.toLowerCase().includes(term)) {
      return true;
    }

    // 搜索工具描述
    if (tool.description.toLowerCase().includes(term)) {
      return true;
    }

    // 搜索工具分类
    if (tool.category.toLowerCase().includes(term)) {
      return true;
    }

    // 搜索功能特点
    if (tool.features.some(feature => feature.toLowerCase().includes(term))) {
      return true;
    }

    // 搜索工具ID
    if (tool.id.toLowerCase().includes(term)) {
      return true;
    }

    return false;
  });
}

/**
 * 高亮搜索关键词
 * @param text 原始文本
 * @param searchTerm 搜索关键词
 * @returns 高亮后的文本（HTML字符串）
 */
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm.trim()) {
    return text;
  }

  const term = searchTerm.trim();
  const regex = new RegExp(`(${term})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
}

/**
 * 获取搜索建议
 * @param tools 工具列表
 * @param searchTerm 搜索关键词
 * @returns 搜索建议列表
 */
export function getSearchSuggestions(tools: Tool[], searchTerm: string): string[] {
  if (!searchTerm.trim()) {
    return [];
  }

  const term = searchTerm.toLowerCase().trim();
  const suggestions = new Set<string>();

  tools.forEach(tool => {
    // 添加匹配的分类
    if (tool.category.toLowerCase().includes(term)) {
      suggestions.add(tool.category);
    }

    // 添加匹配的功能特点
    tool.features.forEach(feature => {
      if (feature.toLowerCase().includes(term)) {
        suggestions.add(feature);
      }
    });

    // 添加匹配的工具名称（去掉emoji）
    const cleanName = tool.name.replace(/[^\w\s\u4e00-\u9fff]/g, '').trim();
    if (cleanName.toLowerCase().includes(term)) {
      suggestions.add(cleanName);
    }
  });

  return Array.from(suggestions).slice(0, 5); // 最多返回5个建议
}
