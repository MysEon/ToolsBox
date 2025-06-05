'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CompleteProfile } from '../utils/addressGenerator';

interface LeafletMapProps {
  profiles: CompleteProfile[];
  onProfileSelect?: (profile: CompleteProfile | null) => void;
}

export default function LeafletMap({ profiles, onProfileSelect }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<CompleteProfile | null>(null);

  // 美国中心坐标
  const USA_CENTER: [number, number] = [39.8283, -98.5795];
  const DEFAULT_ZOOM = 4;

  // 创建自定义标记图标
  const createCustomIcon = (L: any, index: number, isSelected: boolean = false) => {
    return L.divIcon({
      html: `
        <div style="
          background: ${isSelected ? '#dc2626' : '#3b82f6'};
          color: white;
          border: 2px solid white;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          ${isSelected ? 'transform: scale(1.2);' : ''}
        ">
          ${index + 1}
        </div>
      `,
      className: 'custom-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  // 更新地图标记的函数
  const updateMarkersForMap = async (L: any, map: any) => {
    try {
      // 清除现有标记
      markersRef.current.forEach(marker => {
        try {
          map.removeLayer(marker);
        } catch (e) {
          // 忽略移除失败的错误
        }
      });
      markersRef.current = [];

      // 添加新标记
      const newMarkers: any[] = [];

      profiles.forEach((profile, index) => {
        try {
          const marker = L.marker(
            [profile.address.coordinates.lat, profile.address.coordinates.lng],
            { icon: createCustomIcon(L, index, selectedProfile === profile) }
          );

          const popupContent = `
            <div style="padding: 8px; min-width: 200px;">
              <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <div style="background: #2563eb; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 8px;">
                  ${index + 1}
                </div>
                <h5 style="font-weight: 600; color: #111827; font-size: 14px; margin: 0;">${profile.personal.fullName}</h5>
              </div>
              <div style="font-size: 12px; color: #4b5563; line-height: 1.4;">
                <p style="margin: 4px 0;"><strong>地址:</strong> ${profile.address.street}</p>
                <p style="margin: 4px 0;"><strong>城市:</strong> ${profile.address.city}, ${profile.address.stateAbbreviation} ${profile.address.zipCode}</p>
                <p style="margin: 4px 0;"><strong>坐标:</strong> ${profile.address.coordinates.lat.toFixed(4)}, ${profile.address.coordinates.lng.toFixed(4)}</p>
                <p style="margin: 4px 0;"><strong>电话:</strong> ${profile.personal.phone}</p>
                <p style="margin: 4px 0;"><strong>邮箱:</strong> ${profile.personal.email}</p>
              </div>
            </div>
          `;

          marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'custom-popup'
          });

          marker.on('click', () => {
            const newSelected = selectedProfile === profile ? null : profile;
            setSelectedProfile(newSelected);
            if (onProfileSelect) {
              onProfileSelect(newSelected);
            }
          });

          marker.addTo(map);
          newMarkers.push(marker);
        } catch (error) {
          console.error('添加标记失败:', error);
        }
      });

      markersRef.current = newMarkers;

      // 如果有标记，调整地图视图以包含所有标记
      if (newMarkers.length > 0) {
        try {
          const group = new L.featureGroup(newMarkers);
          map.fitBounds(group.getBounds().pad(0.1));
        } catch (error) {
          console.error('调整地图视图失败:', error);
        }
      }
    } catch (error) {
      console.error('更新标记失败:', error);
    }
  };

  // 初始化地图
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      try {
        // 动态导入Leaflet
        const L = await import('leaflet');

        // 修复默认图标问题
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        // 创建地图实例
        const map = L.map(mapRef.current!, {
          center: USA_CENTER,
          zoom: DEFAULT_ZOOM,
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          dragging: true
        });

        // 添加瓦片图层
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          minZoom: 3
        }).addTo(map);

        mapInstanceRef.current = map;

        // 确保地图尺寸正确
        setTimeout(() => {
          map.invalidateSize();
          // 地图初始化完成后，如果有profiles数据，立即添加标记
          if (profiles.length > 0) {
            updateMarkersForMap(L, map);
          }
        }, 100);

      } catch (error) {
        console.error('地图初始化失败:', error);
      }
    };

    initMap();

    // 清理函数
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [profiles]); // 添加profiles作为依赖项

  // 更新标记
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const updateMarkers = async () => {
      try {
        const L = await import('leaflet');
        const map = mapInstanceRef.current;
        await updateMarkersForMap(L, map);
      } catch (error) {
        console.error('更新标记失败:', error);
      }
    };

    updateMarkers();
  }, [profiles, selectedProfile, onProfileSelect]);

  return (
    <div
      ref={mapRef}
      style={{ height: '100%', width: '100%' }}
      className="leaflet-container"
    />
  );
}
