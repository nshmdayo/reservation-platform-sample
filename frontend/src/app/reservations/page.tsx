'use client'

import { useState, useEffect } from 'react'
import { reservationAPI } from '@/lib/api'
import { Reservation } from '@/lib/types'

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      setLoading(true)
      const data = await reservationAPI.getReservations()
      setReservations(data)
    } catch (error) {
      console.error('Failed to fetch reservations:', error)
      // サンプルデータで代替
      setReservations([
        {
          id: 1,
          salon_id: 1,
          staff_id: 1,
          user_id: 1,
          service_id: 1,
          reservation_date: '2024-02-15',
          start_time: '2024-02-15T10:00:00Z',
          end_time: '2024-02-15T11:00:00Z',
          status: 'confirmed',
          total_price: 4000,
          salon: {
            id: 1,
            name: 'Hair Salon Tokyo',
            description: '東京で人気の美容院です',
            address: '東京都渋谷区渋谷1-1-1',
            phone: '03-1234-5678',
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
          },
          staff: {
            id: 1,
            salon_id: 1,
            name: '田中 美咲',
            specialties: ['カット', 'カラー'],
            experience_years: 10,
            is_active: true,
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
          },
          service: {
            id: 1,
            salon_id: 1,
            name: 'カット',
            description: 'シャンプー・ブロー込み',
            price: 4000,
            duration_minutes: 60,
            category: 'カット',
            is_active: true,
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
          },
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
        {
          id: 2,
          salon_id: 1,
          staff_id: 2,
          user_id: 1,
          service_id: 2,
          reservation_date: '2024-02-20',
          start_time: '2024-02-20T14:00:00Z',
          end_time: '2024-02-20T16:00:00Z',
          status: 'confirmed',
          total_price: 8000,
          salon: {
            id: 1,
            name: 'Hair Salon Tokyo',
            description: '東京で人気の美容院です',
            address: '東京都渋谷区渋谷1-1-1',
            phone: '03-1234-5678',
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
          },
          staff: {
            id: 2,
            salon_id: 1,
            name: '佐藤 健太',
            specialties: ['パーマ', 'セット'],
            experience_years: 8,
            is_active: true,
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
          },
          service: {
            id: 2,
            salon_id: 1,
            name: 'カット + カラー',
            description: 'カット＋カラーリング',
            price: 8000,
            duration_minutes: 120,
            category: 'カラー',
            is_active: true,
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
          },
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleCancelReservation = async (reservationId: number) => {
    if (!confirm('予約をキャンセルしますか？')) {
      return
    }

    try {
      await reservationAPI.cancelReservation(reservationId)
      alert('予約をキャンセルしました')
      fetchReservations() // リストを更新
    } catch (error) {
      console.error('Failed to cancel reservation:', error)
      alert('キャンセルに失敗しました')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    })
  }

  const formatTime = (timeString: string) => {
    const time = new Date(timeString)
    return time.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { text: '確定', className: 'bg-green-100 text-green-800' },
      cancelled: { text: 'キャンセル', className: 'bg-red-100 text-red-800' },
      completed: { text: '完了', className: 'bg-gray-100 text-gray-800' },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.confirmed

    return (
      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
        {config.text}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6 w-1/3"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">予約管理</h1>
        <p className="text-gray-600">ご予約の確認・変更・キャンセルができます</p>
      </div>

      {reservations.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">予約がありません</h3>
          <p className="text-gray-500 mb-6">美容院を探して予約してみましょう</p>
          <a href="/salons" className="btn-primary">
            美容院を探す
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {reservation.salon?.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{reservation.salon?.address}</p>
                </div>
                <div className="text-right">
                  {getStatusBadge(reservation.status)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">予約詳細</h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="text-gray-500">日時:</span>{' '}
                      {formatDate(reservation.reservation_date)} {formatTime(reservation.start_time)}
                    </div>
                    <div>
                      <span className="text-gray-500">メニュー:</span>{' '}
                      {reservation.service?.name}
                    </div>
                    <div>
                      <span className="text-gray-500">担当:</span>{' '}
                      {reservation.staff?.name}
                    </div>
                    <div>
                      <span className="text-gray-500">料金:</span>{' '}
                      ¥{reservation.total_price.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">美容院情報</h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="text-gray-500">電話:</span>{' '}
                      <a href={`tel:${reservation.salon?.phone}`} className="text-primary-600 hover:underline">
                        {reservation.salon?.phone}
                      </a>
                    </div>
                    <div>
                      <span className="text-gray-500">予約ID:</span> #{reservation.id}
                    </div>
                  </div>
                </div>
              </div>

              {reservation.status === 'confirmed' && (
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => handleCancelReservation(reservation.id)}
                    className="bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    キャンセル
                  </button>
                  <a
                    href={`/salons/${reservation.salon_id}`}
                    className="btn-secondary"
                  >
                    美容院の詳細
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
