package main

import (
	"log"

	"reservation-platform-sample/internal/api/routes"
	"reservation-platform-sample/internal/config"
)

func main() {
	log.Println("Starting Beauty Reserve API server in demo mode...")

	// 設定読み込み
	cfg := config.LoadConfig()

	// デモ用ルート設定（データベース不要）
	r := routes.SetupDemoRoutes()

	// サーバー起動
	log.Printf("Demo server starting on port %s", cfg.Port)
	log.Println("Available endpoints:")
	log.Println("  GET  /health")
	log.Println("  GET  /api/salons")
	log.Println("  GET  /api/salons/:id")
	log.Println("  GET  /api/salons/:id/slots")
	log.Println("  POST /api/reservations")
	log.Println("  POST /api/auth/login")
	log.Println("  POST /api/auth/register")

	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
