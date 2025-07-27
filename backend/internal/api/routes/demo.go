package routes

import (
	"net/http"

	"reservation-platform-sample/internal/api/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupDemoRoutes() *gin.Engine {
	r := gin.Default()

	// CORS設定
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	r.Use(cors.New(config))

	// ヘルスチェック
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"message": "Beauty Reserve API is running (demo mode)",
		})
	})

	// API v1 ルートグループ
	api := r.Group("/api")
	{
		// 美容院関連（デモ用）
		api.GET("/salons", handlers.GetSalonsDemo)
		api.GET("/salons/:id", handlers.GetSalonDemo)
		api.GET("/salons/:id/slots", handlers.GetAvailableSlotsDemo)

		// 予約関連（デモ用 - 成功レスポンスを返すだけ）
		api.POST("/reservations", func(c *gin.Context) {
			c.JSON(http.StatusCreated, gin.H{
				"message": "予約が作成されました（デモ）",
				"id":      1,
			})
		})

		// 認証関連（デモ用）
		auth := api.Group("/auth")
		{
			auth.POST("/login", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{
					"token": "demo-token",
					"user": gin.H{
						"id":    1,
						"name":  "デモ ユーザー",
						"email": "demo@example.com",
						"role":  "customer",
					},
				})
			})
			auth.POST("/register", func(c *gin.Context) {
				c.JSON(http.StatusCreated, gin.H{
					"token": "demo-token",
					"user": gin.H{
						"id":    1,
						"name":  "デモ ユーザー",
						"email": "demo@example.com",
						"role":  "customer",
					},
				})
			})
		}
	}

	return r
}
