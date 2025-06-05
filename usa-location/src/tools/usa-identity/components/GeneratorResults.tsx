'use client';

import React, { useState } from 'react';
import { CompleteProfile } from '../utils/addressGenerator';
import { US_STATES } from '../data/states';
import { User, Home, CreditCard, MapPin, DollarSign, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';

interface GeneratorResultsProps {
  profiles: CompleteProfile[];
}

export default function GeneratorResults({ profiles }: GeneratorResultsProps) {
  // 分页状态
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10); // 每页显示10个档案

  // 卡片展开状态
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  // 分页逻辑
  const totalPages = Math.ceil(profiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProfiles = profiles.slice(startIndex, endIndex);

  // 分页处理函数
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setExpandedCard(null); // 重置展开状态
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // 如果没有数据，显示提示
  if (profiles.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <h3 className="text-lg font-medium mb-2">暂无生成结果</h3>
          <p className="text-sm">请在左侧设置面板中配置参数并点击"生成身份"按钮</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 结果标题 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            生成结果 ({profiles.length} 个档案)
          </h2>
          {totalPages > 1 && (
            <div className="text-sm text-gray-600">
              第 {currentPage} 页，共 {totalPages} 页
            </div>
          )}
        </div>
      </div>

      {/* 结果列表 */}
      <div className="space-y-4">
        {currentProfiles.map((profile, index) => {
          const globalIndex = startIndex + index;
          const isExpanded = expandedCard === globalIndex;

          return (
            <div
              key={globalIndex}
              className={`bg-white rounded-lg shadow-lg transition-all duration-200 cursor-pointer ${
                isExpanded ? 'ring-2 ring-blue-500 shadow-xl' : 'hover:shadow-xl'
              }`}
              onMouseEnter={() => setExpandedCard(globalIndex)}
              onMouseLeave={() => setExpandedCard(null)}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    档案 #{globalIndex + 1}
                  </h3>
                  <div className="flex gap-2 items-center">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {profile.address.stateAbbreviation}
                    </span>
                    {(() => {
                      const stateInfo = US_STATES.find(s => s.abbreviation === profile.address.stateAbbreviation);
                      return stateInfo?.taxFree ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          🚫 免税州
                        </span>
                      ) : (
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                          💰 {stateInfo?.salesTaxRate}%
                        </span>
                      );
                    })()}
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* 基础信息 - 始终显示 */}
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">姓名:</span>
                    <span className="ml-2 text-gray-900">{profile.personal.fullName}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">邮箱:</span>
                    <span className="ml-2 text-gray-900">{profile.personal.email}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">地址:</span>
                    <span className="ml-2 text-gray-900">{profile.address.city}, {profile.address.stateAbbreviation}</span>
                  </div>
                </div>
              </div>

              {/* 详细信息 - 仅在展开时显示 */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 animate-in slide-in-from-top duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    {/* 个人信息 */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        个人信息
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">姓名:</span> {profile.personal.fullName}</p>
                        <p><span className="font-medium">邮箱:</span> {profile.personal.email}</p>
                        <p><span className="font-medium">电话:</span> {profile.personal.phone}</p>
                        <p><span className="font-medium">SSN:</span> {profile.personal.ssn}</p>
                        <p><span className="font-medium">生日:</span> {profile.personal.dateOfBirth}</p>
                        <p><span className="font-medium">年龄:</span> {profile.personal.age}岁</p>
                        <p><span className="font-medium">性别:</span> {profile.personal.gender}</p>
                        <p><span className="font-medium">职业:</span> {profile.personal.occupation}</p>
                        <p><span className="font-medium">公司:</span> {profile.personal.company}</p>
                      </div>
                    </div>

                    {/* 地址信息 */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 flex items-center">
                        <Home className="mr-2 h-4 w-4" />
                        地址信息
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">街道:</span> {profile.address.street}</p>
                        <p><span className="font-medium">城市:</span> {profile.address.city}</p>
                        <p><span className="font-medium">州:</span> {profile.address.state}</p>
                        <p><span className="font-medium">邮编:</span> {profile.address.zipCode}</p>
                        <p className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          <span className="font-medium">坐标:</span>
                          <span className="ml-1">
                            {profile.address.coordinates.lat.toFixed(6)}, {profile.address.coordinates.lng.toFixed(6)}
                          </span>
                        </p>
                        {(() => {
                          const stateInfo = US_STATES.find(s => s.abbreviation === profile.address.stateAbbreviation);
                          return (
                            <p className="flex items-center">
                              <DollarSign className="mr-1 h-3 w-3" />
                              <span className="font-medium">税收:</span>
                              <span className="ml-1">
                                {stateInfo?.taxFree ? '免税州' : `销售税 ${stateInfo?.salesTaxRate}%`}
                              </span>
                            </p>
                          );
                        })()}
                      </div>
                    </div>

                    {/* 信用卡信息 */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        信用卡信息
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">卡号:</span> {profile.personal.creditCard.number}</p>
                        <p><span className="font-medium">类型:</span> {profile.personal.creditCard.type}</p>
                        <p><span className="font-medium">到期:</span> {profile.personal.creditCard.expirationDate}</p>
                        <p><span className="font-medium">CVV:</span> {profile.personal.creditCard.cvv}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 分页控件 */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              上一页
            </button>

            <div className="flex items-center space-x-2">
              {/* 页码显示 */}
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-md transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              下一页
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          {/* 分页信息 */}
          <div className="text-center text-sm text-gray-600 mt-4">
            显示第 {startIndex + 1}-{Math.min(endIndex, profiles.length)} 项，
            共 {profiles.length} 项 | 第 {currentPage} 页，共 {totalPages} 页
          </div>
        </div>
      )}
    </div>
  );
}
