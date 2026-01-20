/**
 * Room Detail Page - Example với VR360 Integration
 * 
 * Demo cách tích hợp VR360 vào trang chi tiết phòng
 */

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useVR360ByRoom } from '../hooks/useVR360';
import { VR360Modal } from '../components/common';
import { useLanguage } from '../context/LanguageContext';
import { getMenuTranslations } from '../constants/translations';
import type { VR360Link } from '../types/api';

// Mock room data (trong thực tế sẽ fetch từ API)
const mockRoomData = {
  id: 'room-deluxe-001',
  name: 'Deluxe Ocean View Room',
  description: 'Phòng Deluxe với view hướng biển tuyệt đẹp, diện tích 45m²',
  price: 2500000,
  capacity: 2,
  size: 45,
  bedType: 'King bed',
  amenities: ['WiFi', 'TV', 'Minibar', 'Safe', 'Balcony'],
  images: [
    '/images/room1.jpg',
    '/images/room2.jpg',
    '/images/room3.jpg',
  ],
};

export const RoomDetailPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { locale } = useLanguage();
  const t = getMenuTranslations(locale);
  const [selectedVRLink, setSelectedVRLink] = useState<VR360Link | null>(null);
  const [activeTab, setActiveTab] = useState<'photos' | 'vr360'>('photos');

  // Fetch VR360 links cho room này
  const { links: vr360Links, loading: vr360Loading } = useVR360ByRoom(roomId || '');

  const room = mockRoomData; // Replace với real API call

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <a href="/" className="hover:text-blue-600">Trang chủ</a>
            <span>/</span>
            <a href="/rooms" className="hover:text-blue-600">Phòng</a>
            <span>/</span>
            <span className="text-gray-900">{room.name}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{room.name}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Media */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab('photos')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'photos'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                📷 Ảnh ({room.images.length})
              </button>
              
              <button
                onClick={() => setActiveTab('vr360')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors relative ${
                  activeTab === 'vr360'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                🎥 VR360 Tour
                {vr360Links.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {vr360Links.length}
                  </span>
                )}
              </button>
            </div>

            {/* Photos Tab */}
            {activeTab === 'photos' && (
              <div className="bg-white rounded-lg overflow-hidden shadow">
                <div className="grid grid-cols-2 gap-2 p-2">
                  {room.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${room.name} - ${index + 1}`}
                      className="w-full h-64 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* VR360 Tab */}
            {activeTab === 'vr360' && (
              <div className="space-y-4">
                {vr360Loading ? (
                  <div className="bg-white rounded-lg p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
                    <p className="text-gray-600">Đang tải VR360 tours...</p>
                  </div>
                ) : vr360Links.length === 0 ? (
                  <div className="bg-white rounded-lg p-12 text-center">
                    <svg
                      className="w-16 h-16 text-gray-300 mx-auto mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Chưa có VR360 tour
                    </h3>
                    <p className="text-gray-500">
                      VR tour cho phòng này đang được cập nhật
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {vr360Links.map((link) => (
                      <div
                        key={link.id}
                        className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow cursor-pointer group"
                        onClick={() => setSelectedVRLink(link)}
                      >
                        {/* Thumbnail */}
                        <div className="relative h-48 bg-gray-100">
                          {link.thumbnailUrl ? (
                            <img
                              src={link.thumbnailUrl}
                              alt={link.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg
                                className="w-16 h-16 text-gray-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                          
                          {/* Play Overlay */}
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-40 transition-all">
                            <div className="w-16 h-16 rounded-full bg-white bg-opacity-90 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <svg
                                className="w-8 h-8 text-blue-600 ml-1"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {link.title}
                          </h3>
                          {link.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {link.description}
                            </p>
                          )}
                          <div className="mt-3 flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                            <span>Xem VR360</span>
                            <svg
                              className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA Banner */}
                {vr360Links.length > 0 && (
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white text-center">
                    <h3 className="text-xl font-bold mb-2">
                      💡 Trải nghiệm VR tốt nhất
                    </h3>
                    <p className="text-blue-100 mb-4">
                      Sử dụng kính VR hoặc xem toàn màn hình để có trải nghiệm tuyệt vời nhất
                    </p>
                    <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                      Tìm hiểu thêm
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Room Description */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Mô tả phòng
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {room.description}
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Thông tin phòng
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <span>📏 Diện tích:</span>
                      <span className="font-medium">{room.size}m²</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span>👥 Sức chứa:</span>
                      <span className="font-medium">{room.capacity} {t.people}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span>🛏️ Loại giường:</span>
                      <span className="font-medium">{room.bedType}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Tiện nghi
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900">
                  {room.price.toLocaleString('vi-VN')}đ
                </div>
                <div className="text-gray-500 text-sm">/ đêm</div>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-3">
                Đặt phòng ngay
              </button>

              <button className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Liên hệ tư vấn
              </button>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Thông tin thêm
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Miễn phí hủy trong 24h</li>
                  <li>✓ Bao gồm bữa sáng</li>
                  <li>✓ WiFi tốc độ cao</li>
                  <li>✓ Check-in: 14:00</li>
                  <li>✓ Check-out: 12:00</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VR360 Modal */}
      <VR360Modal
        link={selectedVRLink}
        isOpen={selectedVRLink !== null}
        onClose={() => setSelectedVRLink(null)}
      />
    </div>
  );
};

export default RoomDetailPage;
