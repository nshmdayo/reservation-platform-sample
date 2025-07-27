'use client'

import { useState, useEffect } from 'react'
import { salonAPI } from '@/lib/api'
import { Salon } from '@/lib/types'

export default function SalonsPage() {
  const [salons, setSalons] = useState<Salon[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchSalons()
  }, [currentPage, search])

  const fetchSalons = async () => {
    try {
      setLoading(true)
      const response = await salonAPI.getSalons({
        page: currentPage,
        limit: 12,
        search: search || undefined,
      })
      setSalons(response.data || [])
    } catch (error) {
      console.error('Failed to fetch salons:', error)
      // Substitute with sample data
      setSalons([
        {
          id: 1,
          name: 'Hair Salon Tokyo',
          description: 'Popular beauty salon in Tokyo',
          address: '1-1-1 Shibuya, Shibuya-ku, Tokyo',
          phone: '03-1234-5678',
          image_url: 'https://via.placeholder.com/300x200',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
        {
          id: 2,
          name: 'Beauty Studio Shibuya',
          description: 'Stylish cuts are our specialty',
          address: '2-2-2 Shibuya, Shibuya-ku, Tokyo',
          phone: '03-2345-6789',
          image_url: 'https://via.placeholder.com/300x200',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
        {
          id: 3,
          name: 'Cut & Color Harajuku',
          description: 'Hair coloring specialty salon',
          address: '1-1-1 Jingumae, Shibuya-ku, Tokyo',
          phone: '03-3456-7890',
          image_url: 'https://via.placeholder.com/300x200',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchSalons()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Beauty Salons</h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by salon name or area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary">
              Search
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {salons.map((salon) => (
              <div key={salon.id} className="card hover:shadow-lg transition-shadow duration-200">
                <div 
                  className="h-48 bg-gray-200 rounded-lg mb-4 bg-cover bg-center"
                  style={{ 
                    backgroundImage: salon.image_url ? `url(${salon.image_url})` : 'none' 
                  }}
                ></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {salon.name}
                </h3>
                <p className="text-gray-600 mb-2">{salon.address}</p>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {salon.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{salon.phone}</span>
                  <a 
                    href={`/salons/${salon.id}`}
                    className="btn-primary"
                  >
                    View Details
                  </a>
                </div>
              </div>
            ))}
          </div>

          {salons.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No beauty salons found matching your search criteria.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
