'use client';

import React from 'react';
import { ExternalLink, Globe } from 'lucide-react';
import ToolPageHeader from '@/shared/components/ToolPageHeader';
import EmptyState from '@/shared/components/EmptyState';

const regions = [
  {
    name: '北美 (美国/加拿大)',
    flag: '🇺🇸',
    url: 'https://www.nintendo.com/us/',
    description: 'Nintendo of America — 游戏、主机、新闻、eShop',
    store: 'https://www.nintendo.com/us/store/',
    support: 'https://en-americas-support.nintendo.com/',
  },
  {
    name: '日本',
    flag: '🇯🇵',
    url: 'https://www.nintendo.co.jp/',
    description: '任天堂株式会社 — ゲーム、ハードウェア、ニュース',
    store: 'https://store-jp.nintendo.com/',
    support: 'https://support.nintendo.co.jp/',
  },
  {
    name: '欧洲',
    flag: '🇪🇺',
    url: 'https://www.nintendo.eu/',
    description: 'Nintendo of Europe — 多语言支持，覆盖欧盟各国',
    store: 'https://store.nintendo.co.uk/',
    support: 'https://www.nintendo.co.uk/Support/',
  },
  {
    name: '英国',
    flag: '🇬🇧',
    url: 'https://www.nintendo.co.uk/',
    description: 'Nintendo UK — 英国区官方网站',
    store: 'https://store.nintendo.co.uk/',
    support: 'https://www.nintendo.co.uk/Support/',
  },
  {
    name: '澳大利亚/新西兰',
    flag: '🇦🇺',
    url: 'https://www.nintendo.com.au/',
    description: 'Nintendo Australia — 澳洲及新西兰区域',
    store: 'https://store.nintendo.com.au/',
    support: 'https://www.nintendo.com.au/support',
  },
  {
    name: '香港',
    flag: '🇭🇰',
    url: 'https://www.nintendo.com.hk/',
    description: '任天堂香港 — 繁体中文支持',
    store: 'https://store.nintendo.com.hk/',
    support: 'https://www.nintendo.com.hk/support/',
  },
  {
    name: '韩国',
    flag: '🇰🇷',
    url: 'https://www.nintendo.co.kr/',
    description: 'Nintendo Korea — 한국어 지원',
    store: 'https://store.nintendo.co.kr/',
    support: 'https://www.nintendo.co.kr/support/',
  },
  {
    name: '台湾',
    flag: '🇹🇼',
    url: 'https://www.nintendo.tw/',
    description: '任天堂台湾 — 繁体中文支持',
    store: 'https://store.nintendo.tw/',
    support: 'https://www.nintendo.tw/support/',
  },
];

export default function NintendoOfficialPage() {
  return (
    <div className="min-h-screen tb-app-bg">
      <ToolPageHeader
        title="Nintendo 官网导航"
        subtitle="快速访问任天堂全球各区域官方网站"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Note */}
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
          <p className="font-medium mb-1">免责声明</p>
          <p>本页面仅为任天堂官方网站的导航索引，与任天堂公司无任何关联。所有链接均指向任天堂官方域名。</p>
        </div>

        {/* Region cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {regions.map((region) => (
            <div
              key={region.name}
              className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-sm transition-all duration-200 overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{region.flag}</span>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{region.name}</h3>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{region.description}</p>

                <div className="space-y-2">
                  <a
                    href={region.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full px-4 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-sm font-medium"
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      官方网站
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                  </a>
                  <div className="flex gap-2">
                    <a
                      href={region.store}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-xs"
                    >
                      eShop
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                    <a
                      href={region.support}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-xs"
                    >
                      支持
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
