export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              理想の美容院を見つけて
              <br />
              簡単予約
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              お近くの美容院を検索して、24時間いつでもオンライン予約
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/salons"
                className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                美容院を探す
              </a>
              <a
                href="/login"
                className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-primary-600 transition-colors duration-200"
              >
                ログイン・新規登録
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Beauty Reserveの特徴
            </h2>
            <p className="text-lg text-gray-600">
              簡単・便利・安心の美容院予約システム
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">簡単検索</h3>
              <p className="text-gray-600">
                エリア、メニュー、価格帯で絞り込んで理想の美容院を見つけられます
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24時間予約</h3>
              <p className="text-gray-600">
                いつでもオンラインで予約可能。リアルタイムで空き状況を確認できます
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">安心サポート</h3>
              <p className="text-gray-600">
                予約確認、変更、キャンセルも簡単。安心してご利用いただけます
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 人気美容院セクション */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              人気の美容院
            </h2>
            <p className="text-lg text-gray-600">
              おすすめの美容院をチェックしてみてください
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* サンプル美容院カード */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  サンプル美容院 {i}
                </h3>
                <p className="text-gray-600 mb-2">東京都渋谷区</p>
                <p className="text-gray-500 text-sm mb-4">
                  カット、カラー、パーマなど幅広いメニューをご用意しています
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-primary-600 font-semibold">￥3,000〜</span>
                  <a href={`/salons/${i}`} className="btn-primary">
                    詳細を見る
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="/salons" className="btn-primary text-lg px-8 py-3">
              もっと見る
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
