import React from 'react';
import { Wrench, Github, Twitter, Mail, Sparkles } from 'lucide-react';

interface FooterProps {
  categories?: string[];
}

export default function Footer({ categories = [] }: FooterProps) {
  return (
    <footer className="bg-zinc-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Product */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Wrench className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-semibold">开发者工具箱</h3>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">
                集成多种实用开发工具的现代化工具集合，为开发者和创作者提供高效便捷的解决方案。
              </p>
              <div className="flex space-x-3">
                <a href="https://github.com/MysEon/ToolsBox" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-blue-400 transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-zinc-500 hover:text-blue-400 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-zinc-500 hover:text-blue-400 transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">工具分类</h3>
                <ul className="space-y-2 text-sm text-zinc-400">
                  {categories.map((category) => (
                    <li key={category} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      <span>{category}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                <span>使用说明</span>
              </h3>
              <div className="text-sm text-zinc-400 space-y-2">
                <p>所有工具完全免费使用，无需注册。</p>
                <p>生成的虚拟数据仅供测试和开发使用。</p>
                <p className="text-yellow-300">请遵守相关法律法规，合理使用工具</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-zinc-500">
              &copy; 2024 开发者工具箱. 保留所有权利.
            </div>
            <div className="flex items-center space-x-6 text-sm text-zinc-500">
              <a href="#" className="hover:text-blue-400 transition-colors">隐私政策</a>
              <a href="#" className="hover:text-blue-400 transition-colors">使用条款</a>
              <a href="#" className="hover:text-blue-400 transition-colors">联系我们</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
