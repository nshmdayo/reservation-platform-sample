# フロントエンド実装指示書

## 技術スタック
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- SWR (データフェッチング)
- React Hook Form (フォーム管理)
- date-fns (日付操作)

## プロジェクト構成
```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # ホームページ
│   │   ├── salons/
│   │   │   ├── page.tsx            # 美容院一覧
│   │   │   └── [id]/
│   │   │       ├── page.tsx        # 美容院詳細
│   │   │       └── booking/
│   │   │           └── page.tsx    # 予約ページ
│   │   ├── reservations/
│   │   │   └── page.tsx            # 予約確認・管理
│   │   └── admin/
│   │       ├── page.tsx            # 管理画面トップ
│   │       ├── salons/
│   │       │   └── page.tsx        # 美容院管理
│   │       ├── staff/
│   │       │   └── page.tsx        # スタッフ管理
│   │       └── reservations/
│   │           └── page.tsx        # 予約管理
│   ├── components/
│   │   ├── ui/                     # 基本UIコンポーネント
│   │   ├── salon/                  # 美容院関連コンポーネント
│   │   ├── booking/                # 予約関連コンポーネント
│   │   └── admin/                  # 管理画面コンポーネント
│   ├── lib/
│   │   ├── api.ts                  # API関数
│   │   ├── types.ts                # 型定義
│   │   └── utils.ts                # ユーティリティ関数
│   └── hooks/                      # カスタムフック
├── public/
├── tailwind.config.js
├── next.config.js
└── package.json
```

## 実装すべき機能

### 1. ユーザー向け機能
- 美容院検索・一覧表示
- 美容院詳細情報表示
- サービス・メニュー表示
- スタッフ紹介
- 予約カレンダー表示
- 空き時間確認
- 予約フォーム
- 予約確認・変更・キャンセル

### 2. 管理者向け機能
- 美容院情報管理
- スタッフ管理
- サービス・メニュー管理
- 営業時間設定
- 予約管理（確認・変更・キャンセル）
- 売上レポート表示

## コンポーネント設計

### UIコンポーネント（components/ui/）
- Button
- Input
- Select
- Modal
- Card
- Badge
- Calendar
- TimePicker

### 美容院コンポーネント（components/salon/）
- SalonCard
- SalonDetail
- ServiceMenu
- StaffList

### 予約コンポーネント（components/booking/）
- BookingCalendar
- TimeSlots
- BookingForm
- ReservationCard

### 管理画面コンポーネント（components/admin/）
- SalonManagement
- StaffManagement
- ReservationManagement

## デザインガイドライン

### カラーパレット
```css
primary: #e91e63     /* ピンク */
secondary: #9c27b0   /* パープル */
accent: #ff5722      /* オレンジ */
neutral: #f5f5f5     /* グレー */
success: #4caf50     /* グリーン */
warning: #ff9800     /* オレンジ */
error: #f44336       /* レッド */
```

### レスポンシブデザイン
- Mobile First
- ブレイクポイント: sm(640px), md(768px), lg(1024px), xl(1280px)

### アクセシビリティ
- セマンティックHTML
- ARIA属性の適切な使用
- キーボードナビゲーション対応
- 適切なコントラスト比

## API連携

### エンドポイント
```
GET /api/salons              # 美容院一覧
GET /api/salons/:id          # 美容院詳細
GET /api/salons/:id/staff    # スタッフ一覧
GET /api/salons/:id/services # サービス一覧
GET /api/salons/:id/slots    # 空き時間
POST /api/reservations       # 予約作成
GET /api/reservations/:id    # 予約詳細
PUT /api/reservations/:id    # 予約更新
DELETE /api/reservations/:id # 予約キャンセル
```

### エラーハンドリング
- 適切なエラーメッセージ表示
- ローディング状態の表示
- オフライン対応

## パフォーマンス
- 画像最適化
- コード分割
- キャッシュ戦略
- SEO対応
