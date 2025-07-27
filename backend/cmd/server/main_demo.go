package main

import (
	"log"
	"net/http"

	"reservation-platform-sample/internal/api/routes"
	"reservation-platform-sample/internal/config"

	"github.com/gin-gonic/gin"
)

func main() {
	log.Println("Starting server without database for demo purposes...")

	// 設定読み込み
	cfg := config.LoadConfig()

	// データベース接続をスキップしてデモ用サーバーとして起動
	// 本来は database.Connect(cfg) と database.Migrate() を実行

	// ルート設定
	r := routes.SetupRoutes()

	// ヘルスチェックエンドポイント
	r.GET("/health", func(c gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"message": "Beauty Reserve API is running (demo mode)",
		})
	})

	// サーバー起動
	log.Printf("Server starting on port %s (demo mode - no database)", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
