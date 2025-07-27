import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Beauty Salon Reservation System',
  description: 'A beauty salon reservation system like HotPepper',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-primary-600">Beauty Reserve</h1>
              </div>
              <nav className="flex space-x-4">
                <Link href="/" className="text-gray-700 hover:text-gray-900">
                  Home
                </Link>
                <Link href="/salons" className="text-gray-700 hover:text-gray-900">
                  Salon Search
                </Link>
                <Link href="/reservations" className="text-gray-700 hover:text-gray-900">
                  Reservation Management
                </Link>
                <Link href="/auth/login" className="text-gray-700 hover:text-gray-900">
                  Login
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <footer className="bg-gray-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p>&copy; 2024 Beauty Reserve. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
