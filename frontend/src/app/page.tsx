export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="block">Find Your Ideal Beauty Salon</span>
            <span className="block text-yellow-300">Easy Booking</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Search for nearby beauty salons and book online 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/salons"
              className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Find Salons
            </a>
            <a
              href="/login"
              className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-primary-600 transition-colors duration-200"
            >
              Login / Register
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Beauty Reserve Features
            </h2>
            <p className="text-lg text-gray-600">
              Simple, Convenient & Secure Beauty Salon Reservation System
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Search</h3>
              <p className="text-gray-600">
                Find your ideal beauty salon by filtering by area, service, and price range
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Booking</h3>
              <p className="text-gray-600">
                Book online anytime. Check real-time availability
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Support</h3>
              <p className="text-gray-600">
                Easy confirmation, changes, and cancellation. Use with peace of mind
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Beauty Salons Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Beauty Salons
            </h2>
            <p className="text-lg text-gray-600">
              Check out our recommended beauty salons
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sample Beauty Salon Cards */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Sample Beauty Salon {i}
                </h3>
                <p className="text-gray-600 mb-2">Shibuya, Tokyo</p>
                <p className="text-gray-500 text-sm mb-4">
                  We offer a wide range of services including cuts, colors, and perms
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-primary-600 font-semibold">¥3,000〜</span>
                  <a href={`/salons/${i}`} className="btn-primary">
                    View Details
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="/salons" className="btn-primary text-lg px-8 py-3">
              View More
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
