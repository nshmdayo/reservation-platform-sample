'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { salonAPI, reservationAPI } from '@/lib/api'
import { Salon, Staff, Service } from '@/lib/types'

type BookingFormData = {
  staff_id: number
  service_id: number
  reservation_date: string
  start_time: string
  notes?: string
}

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const salonId = parseInt(params.id as string)
  
  const [salon, setSalon] = useState<Salon | null>(null)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<BookingFormData>()

  const selectedStaffId = watch('staff_id')
  const selectedDate = watch('reservation_date')

  useEffect(() => {
    fetchSalon()
  }, [salonId])

  useEffect(() => {
    if (selectedStaffId && selectedDate) {
      fetchAvailableSlots()
    }
  }, [selectedStaffId, selectedDate])

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
        description: '東京で人気の美容院です',
        address: '東京都渋谷区渋谷1-1-1',
        phone: '03-1234-5678',
        staff: [
          {
            id: 1,
            salon_id: salonId,
            name: '田中 美咲',
            description: 'カットとカラーが得意です',
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
            description: 'パーマとセットが得意です',
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
            description: 'カット＋カラーリング',
            price: 8000,
            duration_minutes: 120,
            category: 'カラー',
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

  const fetchAvailableSlots = async () => {
    try {
      const response = await salonAPI.getAvailableSlots(salonId, {
        staff_id: selectedStaffId,
        date: selectedDate,
      })
      setAvailableSlots(response.slots || [])
    } catch (error) {
      console.error('Failed to fetch available slots:', error)
      // サンプルの空き時間
      setAvailableSlots(['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'])
    }
  }

  const onSubmit = async (data: BookingFormData) => {
    try {
      setSubmitting(true)
      
      // 選択されたサービスの情報を取得
      const selectedService = salon?.services?.find(s => s.id === parseInt(data.service_id.toString()))
      if (!selectedService) {
        alert('サービスが選択されていません')
        return
      }

      // 終了時間を計算
      const startTime = new Date(`${data.reservation_date}T${data.start_time}`)
      const endTime = new Date(startTime.getTime() + selectedService.duration_minutes * 60000)

      const reservationData = {
        salon_id: salonId,
        staff_id: data.staff_id,
        service_id: data.service_id,
        reservation_date: data.reservation_date,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        total_price: selectedService.price,
        notes: data.notes,
      }

      await reservationAPI.createReservation(reservationData)
      
      alert('予約が完了しました！')
      router.push('/reservations')
    } catch (error) {
      console.error('Failed to create reservation:', error)
      alert('予約に失敗しました。再度お試しください。')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded mb-8 w-3/4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!salon) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">美容院が見つかりません</h1>
          <a href="/salons" className="btn-primary">
            美容院一覧に戻る
          </a>
        </div>
      </div>
    )
  }

  // 今日以降の日付のみ選択可能
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">予約フォーム</h1>
        <p className="text-gray-600">{salon.name}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* スタッフ選択 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            スタッフを選択 *
          </label>
          <select
            {...register('staff_id', { required: 'スタッフを選択してください' })}
            className="input-field"
          >
            <option value="">スタッフを選択してください</option>
            {salon.staff?.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.name} - {staff.specialties?.join(', ')}
              </option>
            ))}
          </select>
          {errors.staff_id && (
            <p className="text-red-500 text-sm mt-1">{errors.staff_id.message}</p>
          )}
        </div>

        {/* サービス選択 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            メニューを選択 *
          </label>
          <select
            {...register('service_id', { required: 'メニューを選択してください' })}
            className="input-field"
          >
            <option value="">メニューを選択してください</option>
            {salon.services?.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - ¥{service.price.toLocaleString()} ({service.duration_minutes}分)
              </option>
            ))}
          </select>
          {errors.service_id && (
            <p className="text-red-500 text-sm mt-1">{errors.service_id.message}</p>
          )}
        </div>

        {/* 日付選択 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            希望日 *
          </label>
          <input
            type="date"
            min={today}
            {...register('reservation_date', { required: '日付を選択してください' })}
            className="input-field"
          />
          {errors.reservation_date && (
            <p className="text-red-500 text-sm mt-1">{errors.reservation_date.message}</p>
          )}
        </div>

        {/* 時間選択 */}
        {selectedStaffId && selectedDate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              希望時間 *
            </label>
            <select
              {...register('start_time', { required: '時間を選択してください' })}
              className="input-field"
            >
              <option value="">時間を選択してください</option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {errors.start_time && (
              <p className="text-red-500 text-sm mt-1">{errors.start_time.message}</p>
            )}
          </div>
        )}

        {/* 備考 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ご要望・備考
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="input-field"
            placeholder="ご要望やご質問があればお聞かせください"
          />
        </div>

        {/* 提出ボタン */}
        <div className="flex justify-between items-center">
          <a
            href={`/salons/${salon.id}`}
            className="btn-secondary"
          >
            戻る
          </a>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? '予約中...' : '予約する'}
          </button>
        </div>
      </form>

      {/* 注意事項 */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">ご予約にあたって</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 予約確定後、確認メールをお送りします</li>
          <li>• キャンセルは前日までにお願いします</li>
          <li>• 時間に遅れる場合は必ずご連絡ください</li>
          <li>• ご不明な点がございましたらお気軽にお問い合わせください</li>
        </ul>
      </div>
    </div>
  )
}
