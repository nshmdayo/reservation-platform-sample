# バックエンド実装指示書

## 技術スタック
- Go 1.21+
- Gin (Webフレームワーク)
- GORM (ORM)
- PostgreSQL (データベース)
- Redis (キャッシュ・セッション)
- JWT (認証)
- Docker & Docker Compose

## プロジェクト構成
```
backend/
├── cmd/
│   └── server/
│       └── main.go                 # エントリーポイント
├── internal/
│   ├── api/
│   │   ├── handlers/               # HTTPハンドラー
│   │   │   ├── salon.go
│   │   │   ├── staff.go
│   │   │   ├── service.go
│   │   │   ├── reservation.go
│   │   │   └── auth.go
│   │   ├── middleware/             # ミドルウェア
│   │   │   ├── auth.go
│   │   │   ├── cors.go
│   │   │   └── logging.go
│   │   └── routes/
│   │       └── routes.go           # ルート定義
│   ├── domain/
│   │   ├── models/                 # ドメインモデル
│   │   │   ├── salon.go
│   │   │   ├── staff.go
│   │   │   ├── service.go
│   │   │   ├── reservation.go
│   │   │   └── user.go
│   │   └── repositories/           # リポジトリインターフェース
│   │       ├── salon.go
│   │       ├── staff.go
│   │       ├── service.go
│   │       ├── reservation.go
│   │       └── user.go
│   ├── infrastructure/
│   │   ├── database/
│   │   │   ├── connection.go       # DB接続
│   │   │   └── migrations/         # マイグレーション
│   │   ├── repositories/           # リポジトリ実装
│   │   │   ├── salon.go
│   │   │   ├── staff.go
│   │   │   ├── service.go
│   │   │   ├── reservation.go
│   │   │   └── user.go
│   │   └── cache/
│   │       └── redis.go            # Redis操作
│   ├── services/                   # ビジネスロジック
│   │   ├── salon.go
│   │   ├── staff.go
│   │   ├── service.go
│   │   ├── reservation.go
│   │   └── auth.go
│   └── config/
│       └── config.go               # 設定管理
├── pkg/
│   ├── logger/                     # ログ機能
│   ├── validator/                  # バリデーション
│   └── utils/                      # ユーティリティ
├── docker-compose.yml
├── Dockerfile
├── go.mod
└── go.sum
```

## データベース設計

### テーブル定義

#### salons（美容院）
```sql
CREATE TABLE salons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address VARCHAR(500) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    image_url VARCHAR(500),
    opening_hours JSONB,          -- 営業時間（曜日別）
    latitude DECIMAL(10, 8),      -- 緯度
    longitude DECIMAL(11, 8),     -- 経度
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### staff（スタッフ）
```sql
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    salon_id INTEGER NOT NULL REFERENCES salons(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    specialties TEXT[],           -- 専門分野
    experience_years INTEGER,
    working_hours JSONB,          -- 勤務時間（曜日別）
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### services（サービス・メニュー）
```sql
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    salon_id INTEGER NOT NULL REFERENCES salons(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,       -- 価格（円）
    duration_minutes INTEGER NOT NULL, -- 所要時間（分）
    category VARCHAR(100),        -- カテゴリ（カット、カラー、パーマなど）
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### users（ユーザー）
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10),
    role VARCHAR(20) DEFAULT 'customer', -- customer, admin, staff
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### reservations（予約）
```sql
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    salon_id INTEGER NOT NULL REFERENCES salons(id),
    staff_id INTEGER NOT NULL REFERENCES staff(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    service_id INTEGER NOT NULL REFERENCES services(id),
    reservation_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'confirmed', -- confirmed, cancelled, completed
    notes TEXT,
    total_price INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API設計

### 認証
```
POST /api/auth/register         # ユーザー登録
POST /api/auth/login           # ログイン
POST /api/auth/logout          # ログアウト
GET  /api/auth/me              # ユーザー情報取得
```

### 美容院
```
GET    /api/salons             # 美容院一覧（検索・フィルタ対応）
GET    /api/salons/:id         # 美容院詳細
POST   /api/salons             # 美容院作成（管理者のみ）
PUT    /api/salons/:id         # 美容院更新（管理者のみ）
DELETE /api/salons/:id         # 美容院削除（管理者のみ）
```

### スタッフ
```
GET    /api/salons/:salon_id/staff        # スタッフ一覧
GET    /api/staff/:id                     # スタッフ詳細
POST   /api/salons/:salon_id/staff        # スタッフ作成
PUT    /api/staff/:id                     # スタッフ更新
DELETE /api/staff/:id                     # スタッフ削除
```

### サービス
```
GET    /api/salons/:salon_id/services     # サービス一覧
GET    /api/services/:id                  # サービス詳細
POST   /api/salons/:salon_id/services     # サービス作成
PUT    /api/services/:id                  # サービス更新
DELETE /api/services/:id                  # サービス削除
```

### 予約
```
GET    /api/reservations                  # 予約一覧（ユーザー別）
GET    /api/reservations/:id              # 予約詳細
POST   /api/reservations                  # 予約作成
PUT    /api/reservations/:id              # 予約更新
DELETE /api/reservations/:id              # 予約キャンセル
GET    /api/salons/:salon_id/slots        # 空き時間取得
```

## ビジネスロジック

### 予約システム
1. **空き時間計算**
   - スタッフの勤務時間
   - 既存の予約
   - サービスの所要時間を考慮

2. **予約バリデーション**
   - 営業時間内の確認
   - スタッフの勤務時間確認
   - ダブルブッキング防止
   - 過去日時の予約不可

3. **予約確定処理**
   - 在庫確認
   - 料金計算
   - 通知送信

### セキュリティ
- JWT認証
- パスワードハッシュ化（bcrypt）
- CORS設定
- レート制限
- 入力値検証

### パフォーマンス
- データベースインデックス
- Redisキャッシュ
- ページネーション
- 非同期処理

## エラーハンドリング

### エラーレスポンス形式
```json
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "入力値に問題があります",
        "details": [
            {
                "field": "email",
                "message": "有効なメールアドレスを入力してください"
            }
        ]
    }
}
```

## ログ・監視
- 構造化ログ（JSON形式）
- アクセスログ
- エラーログ
- パフォーマンス監視

## デプロイ・運用
- Docker化
- 環境変数による設定
- ヘルスチェックエンドポイント
- Graceful shutdown
