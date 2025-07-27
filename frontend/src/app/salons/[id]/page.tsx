'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { salonAPI } from '@/lib/api'
import { Salon, Staff, Service } from '@/lib/types'

export default function SalonDetailPage() {
  const params = useParams()
  const salonId = parseInt(params.id as string)
  
  const [salon, setSalon] = useState<Salon | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'staff' | 'services' | 'booking'>('overview')

  useEffect(() => {
    if (salonId) {
      fetchSalon()
    }
  }, [salonId])

  const fetchSalon = async () => {
    try {
      setLoading(true)
      const data = await salonAPI.getSalon(salonId)
      setSalon(data)
    } catch (error) {
      console.error('Failed to fetch salon:', error)
      // サンプルデータで代替
      setSalon({
        id: salonId,
        name: 'Hair Salon Tokyo',
        description: '東京で人気の美容院です。経験豊富なスタイリストが、お客様一人一人に合ったスタイルをご提案いたします。',
        address: '東京都渋谷区渋谷1-1-1 サンプルビル3F',
        phone: '03-1234-5678',
        email: 'info@hairsalon-tokyo.com',
        website: 'https://hairsalon-tokyo.com',
        image_url: 'https://via.placeholder.com/800x400',
        opening_hours: {
          monday: { open: '10:00', close: '20:00' },
          tuesday: { open: '10:00', close: '20:00' },
          wednesday: { open: '10:00', close: '20:00' },
          thursday: { open: '10:00', close: '20:00' },
          friday: { open: '10:00', close: '20:00' },
          saturday: { open: '09:00', close: '19:00' },
          sunday: { open: '09:00', close: '19:00' },
        },
        staff: [
          {
            id: 1,
            salon_id: salonId,
            name: '田中 美咲',
            description: '10年の経験を持つスタイリスト。カットとカラーが得意です。',
            image_url: 'https://via.placeholder.com/200x200',
            specialties: ['カット', 'カラー'],
            experience_years: 10,
            is_active: true,
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
          },
          {
            id: 2,
            salon_id: salonId,
            name: '佐藤 健太',
            description: 'パーマとセットが得意なスタイリストです。',
            image_url: 'https://via.placeholder.com/200x200',
            specialties: ['パーマ', 'セット'],
            experience_years: 8,
            is_active: true,
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
          },
        ],
        services: [
          {
            id: 1,
            salon_id: salonId,
            name: 'カット',
            description: 'シャンプー・ブロー込み',
            price: 4000,
            duration_minutes: 60,
            category: 'カット',
            is_active: true,
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
          },
          {
            id: 2,
            salon_id: salonId,
            name: 'カット + カラー',
            description: 'カット＋カラーリング＋シャンプー・ブロー',
            price: 8000,
            duration_minutes: 120,
            category: 'カラー',
            is_active: true,
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
          },
          {
            id: 3,
            salon_id: salonId,
            name: 'パーマ',
            description: 'パーマ＋カット＋シャンプー・ブロー',
            price: 10000,
            duration_minutes: 150,
            category: 'パーマ',
            is_active: true,
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
          },
        ],
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
          <div className="h-8 bg-gray-200 rounded mb-4 w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
        </div>
      </div>
    )
  }

  if (!salon) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">美容院が見つかりません</h1>
          <a href="/salons" className="btn-primary">
            美容院一覧に戻る
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ヘッダー画像 */}
      <div 
        className="h-64 bg-gray-200 rounded-lg mb-8 bg-cover bg-center"
        style={{ 
          backgroundImage: salon.image_url ? `url(${salon.image_url})` : 'none' 
        }}
      ></div>

      {/* 美容院情報 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{salon.name}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <p className="text-gray-600 mb-6">{salon.description}</p>
            
            {/* 基本情報 */}
            <div className="card mb-6">
              <h3 className="text-xl font-semibold mb-4">基本情報</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">住所:</span> {salon.address}
                </div>
                <div>
                  <span className="font-medium">電話:</span> {salon.phone}
                </div>
                {salon.email && (
                  <div>
                    <span className="font-medium">メール:</span> {salon.email}
                  </div>
                )}
                {salon.website && (
                  <div>
                    <span className="font-medium">ウェブサイト:</span>{' '}
                    <a href={salon.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                      {salon.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* 営業時間 */}
            {salon.opening_hours && (
              <div className="card">
                <h3 className="text-xl font-semibold mb-4">営業時間</h3>
                <div className="space-y-2">
                  {Object.entries(salon.opening_hours).map(([day, hours]: [string, any]) => (
                    <div key={day} className="flex justify-between">
                      <span className="font-medium capitalize">{day}:</span>
                      <span>{hours.open} - {hours.close}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">ご予約</h3>
              <p className="text-gray-600 mb-4">
                お気軽にご予約ください。オンラインで24時間受付中です。
              </p>
              <a
                href={`/salons/${salon.id}/booking`}
                className="btn-primary w-full text-center block"
              >
                予約する
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: '概要' },
            { id: 'staff', name: 'スタッフ' },
            { id: 'services', name: 'メニュー' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* タブコンテンツ */}
      {activeTab === 'staff' && salon.staff && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {salon.staff.map((staff) => (
            <div key={staff.id} className="card text-center">
              <div 
                className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 bg-cover bg-center"
                style={{ 
                  backgroundImage: staff.image_url ? `url(${staff.image_url})` : 'none' 
                }}
              ></div>
              <h4 className="text-lg font-semibold mb-2">{staff.name}</h4>
              <p className="text-gray-600 text-sm mb-3">{staff.description}</p>
              {staff.specialties && staff.specialties.length > 0 && (
                <div className="mb-3">
                  {staff.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full mr-1 mb-1"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-500">経験年数: {staff.experience_years}年</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'services' && salon.services && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {salon.services.map((service) => (
            <div key={service.id} className="card">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-semibold">{service.name}</h4>
                <span className="text-primary-600 font-bold text-lg">¥{service.price.toLocaleString()}</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{service.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>所要時間: {service.duration_minutes}分</span>
                <span className="bg-gray-100 px-2 py-1 rounded">{service.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="prose max-w-none">
          <p className="text-gray-600 leading-relaxed">
            {salon.description}
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            当店では、お客様一人一人のライフスタイルに合わせたヘアスタイルをご提案しています。
            経験豊富なスタイリストが、最新のトレンドを取り入れながら、お客様の魅力を最大限に引き出します。
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            リラックスできる空間で、上質なサービスをお楽しみください。
            ご予約はオンラインで24時間受け付けております。
          </p>
        </div>
      )}
    </div>
  )
}
