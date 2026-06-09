'use client';

import React, { useState } from 'react';
import { CompleteProfile } from '../utils/addressGenerator';
import { US_STATES } from '../data/states';
import { User, Home, CreditCard, MapPin, DollarSign, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import EmptyState from '@/shared/components/EmptyState';

interface GeneratorResultsProps {
  profiles: CompleteProfile[];
}

export default function GeneratorResults({ profiles }: GeneratorResultsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(profiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProfiles = profiles.slice(startIndex, startIndex + itemsPerPage);

  const goTo = (p: number) => { setCurrentPage(p); setExpandedCard(null); };

  if (profiles.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-8">
        <EmptyState icon={User} title="暂无生成结果" description="请在左侧设置参数并点击生成按钮" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          生成结果 ({profiles.length})
        </h2>
        {totalPages > 1 && (
          <span className="text-xs text-zinc-500">第 {currentPage}/{totalPages} 页</span>
        )}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {currentProfiles.map((profile, i) => {
          const gi = startIndex + i;
          const isExpanded = expandedCard === gi;
          const stateInfo = US_STATES.find(s => s.abbreviation === profile.address.stateAbbreviation);

          return (
            <div key={gi}
              onClick={() => setExpandedCard(isExpanded ? null : gi)}
              className={`bg-white dark:bg-zinc-800 rounded-xl border transition-all duration-200 cursor-pointer ${
                isExpanded ? 'border-blue-500/50 shadow-sm' : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
              }`}>
              {/* Summary */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex-1 min-w-0 grid grid-cols-3 gap-4 text-sm">
                  <div className="truncate">
                    <span className="text-zinc-400 text-xs">姓名</span>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate">{profile.personal.fullName}</p>
                  </div>
                  <div className="truncate">
                    <span className="text-zinc-400 text-xs">地址</span>
                    <p className="text-zinc-700 dark:text-zinc-300 truncate">{profile.address.city}, {profile.address.stateAbbreviation}</p>
                  </div>
                  <div className="truncate">
                    <span className="text-zinc-400 text-xs">邮箱</span>
                    <p className="text-zinc-700 dark:text-zinc-300 truncate">{profile.personal.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400">
                    {profile.address.stateAbbreviation}
                  </span>
                  {stateInfo?.taxFree ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">免税</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">{stateInfo?.salesTaxRate}%</span>
                  )}
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-zinc-100 dark:border-zinc-700 animate-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5"><User className="h-3.5 w-3.5" />个人信息</h4>
                      <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                        {[
                          ['姓名', profile.personal.fullName], ['邮箱', profile.personal.email], ['电话', profile.personal.phone],
                          ['SSN', profile.personal.ssn], ['生日', profile.personal.dateOfBirth], ['年龄', `${profile.personal.age}岁`],
                          ['性别', profile.personal.gender], ['职业', profile.personal.occupation], ['公司', profile.personal.company],
                        ].map(([k, v]) => (
                          <p key={k}><span className="font-medium text-zinc-500">{k}:</span> {v}</p>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5"><Home className="h-3.5 w-3.5" />地址信息</h4>
                      <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                        <p><span className="font-medium text-zinc-500">街道:</span> {profile.address.street}</p>
                        <p><span className="font-medium text-zinc-500">城市:</span> {profile.address.city}</p>
                        <p><span className="font-medium text-zinc-500">州:</span> {profile.address.state}</p>
                        <p><span className="font-medium text-zinc-500">邮编:</span> {profile.address.zipCode}</p>
                        <p className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /><span className="font-medium text-zinc-500">坐标:</span>
                          {profile.address.coordinates.lat.toFixed(4)}, {profile.address.coordinates.lng.toFixed(4)}
                        </p>
                        <p className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" /><span className="font-medium text-zinc-500">税收:</span>
                          {stateInfo?.taxFree ? '免税州' : `销售税 ${stateInfo?.salesTaxRate}%`}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5" />信用卡</h4>
                      <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                        <p><span className="font-medium text-zinc-500">卡号:</span> {profile.personal.creditCard.number}</p>
                        <p><span className="font-medium text-zinc-500">类型:</span> {profile.personal.creditCard.type}</p>
                        <p><span className="font-medium text-zinc-500">到期:</span> {profile.personal.creditCard.expirationDate}</p>
                        <p><span className="font-medium text-zinc-500">CVV:</span> {profile.personal.creditCard.cvv}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-zinc-600 dark:text-zinc-400">
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let n: number;
            if (totalPages <= 7) n = i + 1;
            else if (currentPage <= 4) n = i + 1;
            else if (currentPage >= totalPages - 3) n = totalPages - 6 + i;
            else n = currentPage - 3 + i;
            return (
              <button key={n} onClick={() => goTo(n)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === n ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                }`}>{n}</button>
            );
          })}
          <button onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-zinc-600 dark:text-zinc-400">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
