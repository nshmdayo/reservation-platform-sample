package main

import (
	"log"

	"reservation-platform-sample/internal/api/routes"
	"reservation-platform-sample/internal/config"
	"reservation-platform-sample/internal/infrastructure/database"
)

func main() {
	// 設定読み込み
	cfg := config.LoadConfig()

	// データベース接続
	if err := database.Connect(cfg); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// マイグレーション実行
	if err := database.Migrate(); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// ルート設定
	r := routes.SetupRoutes()

	// サーバー起動
	log.Printf("Server starting on port %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
