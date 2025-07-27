# 美容院予約システム

ホットペッパーのような美容院の予約システムです。フロントエンドはNext.js + TypeScript + Tailwind CSS、バックエンドはGo + Gin + PostgreSQLで構築されています。

## 技術スタック

### フロントエンド
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- SWR (データフェッチング)
- React Hook Form (フォーム管理)
- Axios (HTTP クライアント)

### バックエンド
- Go 1.21+
- Gin (Webフレームワーク)
- GORM (ORM)
- PostgreSQL (データベース)
- Redis (キャッシュ・セッション)
- JWT (認証)

## プロジェクト構成

```
├── frontend/          # Next.jsフロントエンド
│   ├── src/
│   │   ├── app/      # App Routerページ
│   │   ├── components/ # UIコンポーネント
│   │   └── lib/      # API、型定義、ユーティリティ
│   ├── package.json
│   └── tailwind.config.js
├── backend/           # Go バックエンド
│   ├── cmd/
│   │   ├── server/   # 本番用サーバー
│   │   └── demo/     # デモ用サーバー
│   ├── internal/
│   │   ├── api/      # HTTPハンドラー・ルート
│   │   ├── domain/   # ドメインモデル
│   │   ├── infrastructure/ # DB・外部サービス
│   │   └── services/ # ビジネスロジック
│   ├── go.mod
│   └── Dockerfile
├── docker-compose.yml # 開発環境用Docker設定
└── .github/
    └── instructions/  # 実装指示書
```

## クイックスタート

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd reservation-platform-sample
```

### 2. フロントエンドのセットアップ
```bash
cd frontend
npm install
npm run dev
```
フロントエンドは http://localhost:3000 で起動します。

### 3. バックエンドのセットアップ

#### 本格的な開発環境（PostgreSQL + Redis）
```bash
# Docker環境の起動
docker-compose up -d

# バックエンドの起動
cd backend
go mod download
go run cmd/server/main.go
```

#### デモ環境（データベース不要）
```bash
cd backend
go mod download
go run cmd/demo/main.go
```
バックエンドAPIは http://localhost:8081 で起動します。

### 4. アクセス先
- **フロントエンド**: http://localhost:3000
- **バックエンド API**: http://localhost:8081
- **API健康状態**: http://localhost:8081/health
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **Adminer (DB管理)**: http://localhost:8081

## 主な機能

### ✅ 実装済み機能

#### ユーザー向け
- 🏠 **ホームページ** - サービス紹介とナビゲーション
- 🔍 **美容院検索・一覧表示** - 名前や地域での検索
- 🏪 **美容院詳細情報** - 店舗情報、スタッフ、メニュー表示
- 📅 **予約カレンダー・空き時間確認** - リアルタイム空き状況
- ✏️ **予約フォーム** - スタッフ・メニュー・日時選択
- 📋 **予約確認・管理** - 予約一覧・詳細・キャンセル

#### システム機能
- 🎨 **レスポンシブデザイン** - モバイルファースト
- 🔒 **認証システム** - JWT認証（デモ実装）
- 🌐 **REST API** - CORS対応、適切なHTTPステータス
- 📊 **エラーハンドリング** - ユーザーフレンドリーなエラー表示

### 🚧 今後の実装予定

#### ユーザー機能
- ユーザー登録・ログイン機能
- プロフィール管理
- お気に入り美容院機能
- 予約履歴・レビュー機能

#### 管理者機能
- 美容院情報管理画面
- スタッフ管理
- サービス・メニュー管理
- 予約管理ダッシュボード
- 売上レポート

#### 高度な機能
- 位置情報ベース検索
- プッシュ通知
- 決済機能
- レビュー・評価システム

## 開発ガイド

### API エンドポイント

#### 美容院関連
```
GET  /api/salons           # 美容院一覧
GET  /api/salons/:id       # 美容院詳細
GET  /api/salons/:id/slots # 空き時間取得
```

#### 予約関連
```
POST /api/reservations     # 予約作成
GET  /api/reservations     # 予約一覧
GET  /api/reservations/:id # 予約詳細
PUT  /api/reservations/:id # 予約更新
DELETE /api/reservations/:id # 予約キャンセル
```

#### 認証関連
```
POST /api/auth/register    # ユーザー登録
POST /api/auth/login       # ログイン
GET  /api/auth/me          # ユーザー情報取得
```

### コードスタイル

- **フロントエンド**: TypeScript + ESLint + Prettier
- **バックエンド**: Go fmt + golint

### テスト
```bash
# フロントエンドテスト
cd frontend
npm test

# バックエンドテスト
cd backend
go test ./...
```

## デプロイ

### Docker
```bash
# 全体のビルド
docker-compose -f docker-compose.prod.yml up --build

# 個別のビルド
docker build -t reservation-frontend ./frontend
docker build -t reservation-backend ./backend
```

## コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 開発参考資料

- [フロントエンド実装指示書](./.github/instructions/frontend.md)
- [バックエンド実装指示書](./.github/instructions/backend.md)