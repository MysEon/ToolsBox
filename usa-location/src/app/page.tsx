'use client';

import React, { useState } from 'react';
import GeneratorSettings from '../components/GeneratorSettings';
import GeneratorResults from '../components/GeneratorResults';
import MapComponent from '../components/MapComponent';
import { CompleteProfile } from '../utils/addressGenerator';
import {
  MapPin,
  Settings,
  Info,
  Github,
  Twitter,
  Mail,
  Shield,
  Globe,
  Menu,
  X
} from 'lucide-react';

export default function Home() {
  const [generatedProfiles, setGeneratedProfiles] = useState<CompleteProfile[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 处理生成的档案数据
  const handleProfilesGenerated = (profiles: CompleteProfile[]) => {
    setGeneratedProfiles(profiles);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <header className="gradient-animated shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo和标题 */}
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  美国虚拟身份生成器
                </h1>
                <p className="text-blue-100 text-sm">
                  专业的测试数据生成工具
                </p>
              </div>
            </div>

            {/* 桌面端导航 */}
            <nav className="hidden md:flex items-center space-x-1">
              <a
                href="#generator"
                className="nav-link flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-white/20 transition-all duration-200 font-medium"
              >
                <Settings className="h-4 w-4" />
                <span>身份生成器</span>
              </a>
              <a
                href="#map"
                className="nav-link flex items-center space-x-2 px-4 py-2 rounded-lg text-blue-100 hover:text-white hover:bg-white/20 transition-all duration-200"
              >
                <MapPin className="h-4 w-4" />
                <span>地图定位</span>
              </a>
              <a
                href="#about"
                className="nav-link flex items-center space-x-2 px-4 py-2 rounded-lg text-blue-100 hover:text-white hover:bg-white/20 transition-all duration-200"
              >
                <Info className="h-4 w-4" />
                <span>关于</span>
              </a>
            </nav>

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* 移动端导航菜单 */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-white/20 py-4">
              <nav className="flex flex-col space-y-2">
                <a
                  href="#generator"
                  className="flex items-center space-x-2 px-4 py-3 rounded-lg text-white hover:bg-white/20 transition-all duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  <span>身份生成器</span>
                </a>
                <a
                  href="#map"
                  className="flex items-center space-x-2 px-4 py-3 rounded-lg text-blue-100 hover:text-white hover:bg-white/20 transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <MapPin className="h-4 w-4" />
                  <span>地图定位</span>
                </a>
                <a
                  href="#about"
                  className="flex items-center space-x-2 px-4 py-3 rounded-lg text-blue-100 hover:text-white hover:bg-white/20 transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Info className="h-4 w-4" />
                  <span>关于</span>
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* 主要内容 - 左右分栏布局 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* 左侧：生成设置 (30%) */}
          <div className="lg:col-span-3">
            <GeneratorSettings onProfilesGenerated={handleProfilesGenerated} />
          </div>

          {/* 右侧：生成结果和地图 (70%) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 生成结果 */}
            <GeneratorResults profiles={generatedProfiles} />

            {/* 地图部分 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <MapComponent profiles={generatedProfiles} />
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 主要页脚内容 */}
          <div className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* 产品信息 */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Globe className="h-6 w-6 text-blue-400" />
                  <h3 className="text-lg font-semibold">虚拟身份生成器</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  专业的美国虚拟身份数据生成工具，为开发者和测试人员提供高质量的测试数据。
                </p>
                <div className="flex space-x-3">
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <Github className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {/* 功能特性 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">功能特性</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span>真实地址生成</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span>个人信息生成</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span>地图可视化</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span>批量导出</span>
                  </li>
                </ul>
              </div>

              {/* 使用指南 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">使用指南</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>
                    <a href="#generator" className="hover:text-blue-400 transition-colors">
                      如何生成身份
                    </a>
                  </li>
                  <li>
                    <a href="#map" className="hover:text-blue-400 transition-colors">
                      地图使用说明
                    </a>
                  </li>
                  <li>
                    <a href="#about" className="hover:text-blue-400 transition-colors">
                      常见问题
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-400 transition-colors">
                      API 文档
                    </a>
                  </li>
                </ul>
              </div>

              {/* 法律声明 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-yellow-400" />
                  <span>法律声明</span>
                </h3>
                <div className="text-sm text-gray-300 space-y-2">
                  <p>
                    本工具生成的所有信息均为虚构数据，仅供测试和开发使用。
                  </p>
                  <p className="text-yellow-300">
                    ⚠️ 请勿用于任何非法用途或欺诈行为
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 底部版权信息 */}
          <div className="border-t border-gray-800 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-gray-400">
                © 2024 美国虚拟身份生成器. 保留所有权利.
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <a href="#" className="hover:text-blue-400 transition-colors">
                  隐私政策
                </a>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  使用条款
                </a>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  联系我们
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
