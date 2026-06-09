'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { CompleteProfile } from '../utils/addressGenerator';

// 动态导入地图组件，禁用SSR
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-sm">加载地图中...</p>
      </div>
    </div>
  )
});

interface MapComponentProps {
  profiles: CompleteProfile[];
  className?: string;
}

export default function MapComponent({ profiles, className = '' }: MapComponentProps) {
  const [selectedProfile, setSelectedProfile] = useState<CompleteProfile | null>(null);

  // 处理地图上的profile选择
  const handleProfileSelect = (profile: CompleteProfile | null) => {
    setSelectedProfile(profile);
  };

  // 如果没有数据，显示提示
  if (profiles.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="text-lg font-medium mb-2">暂无地址数据</h3>
          <p className="text-sm">生成身份信息后，地址位置将在此地图上显示</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Leaflet地图 */}
      <div className="w-full">
        <div className="p-4 border-b border-gray-200">
          <div>
            <h3 className="font-semibold text-lg mb-1 flex items-center">
              🗺️ 地址分布地图
            </h3>
            <p className="text-gray-600 text-sm">
              显示 {profiles.length} 个生成的地址位置 • 支持缩放和拖拽 • 点击标记查看详情
            </p>
          </div>
        </div>

        <div className="relative" style={{ height: '500px' }}>
          <LeafletMap profiles={profiles} onProfileSelect={handleProfileSelect} />
        </div>
      </div>

      {/* 选中地址的详细信息 */}
      {selectedProfile && (
        <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-semibold text-gray-900">详细信息</h5>
            <button
              onClick={() => setSelectedProfile(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h6 className="font-medium text-gray-700 mb-2">个人信息</h6>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">姓名:</span> {selectedProfile.personal.fullName}</p>
                <p><span className="font-medium">邮箱:</span> {selectedProfile.personal.email}</p>
                <p><span className="font-medium">电话:</span> {selectedProfile.personal.phone}</p>
              </div>
            </div>

            <div>
              <h6 className="font-medium text-gray-700 mb-2">地址信息</h6>
              <div className="text-sm text-gray-600 space-y-1">
                <p>{selectedProfile.address.street}</p>
                <p>{selectedProfile.address.city}, {selectedProfile.address.stateAbbreviation} {selectedProfile.address.zipCode}</p>
                <p className="text-blue-600">
                  坐标: {selectedProfile.address.coordinates.lat.toFixed(6)}, {selectedProfile.address.coordinates.lng.toFixed(6)}
                </p>
              </div>
            </div>

            <div>
              <h6 className="font-medium text-gray-700 mb-2">职业信息</h6>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">职业:</span> {selectedProfile.personal.occupation}</p>
                <p><span className="font-medium">公司:</span> {selectedProfile.personal.company}</p>
                <p><span className="font-medium">年龄:</span> {selectedProfile.personal.age}岁</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 地图说明 */}
      <div className="mt-4 p-3 bg-green-50 rounded-lg">
        <h6 className="font-medium text-green-900 mb-1">真实地图</h6>
        <p className="text-sm text-green-800">
          使用OpenStreetMap真实地图数据，支持多级缩放和拖拽移动。
        </p>
      </div>
    </div>
  );
}
