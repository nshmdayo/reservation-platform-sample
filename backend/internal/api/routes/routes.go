package routes

import (
	"reservation-platform-sample/internal/api/handlers"
	"reservation-platform-sample/internal/api/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRoutes() *gin.Engine {
	r := gin.Default()

	// CORS設定
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	r.Use(cors.New(config))

	// API v1 ルートグループ
	api := r.Group("/api")
	{
		// 認証不要のルート
		auth := api.Group("/auth")
		{
			auth.POST("/register", handlers.Register)
			auth.POST("/login", handlers.Login)
		}

		// 美容院関連（認証不要）
		api.GET("/salons", handlers.GetSalons)
		api.GET("/salons/:id", handlers.GetSalon)
		api.GET("/salons/:salon_id/slots", handlers.GetAvailableSlots)

		// 認証が必要なルート
		protected := api.Group("")
		protected.Use(middleware.AuthMiddleware())
		{
			// ユーザー関連
			protected.GET("/auth/me", handlers.GetProfile)

			// 予約関連
			protected.GET("/reservations", handlers.GetReservations)
			protected.GET("/reservations/:id", handlers.GetReservation)
			protected.POST("/reservations", handlers.CreateReservation)
			protected.PUT("/reservations/:id", handlers.UpdateReservation)
			protected.DELETE("/reservations/:id", handlers.DeleteReservation)

			// 管理者のみのルート（TODO: 管理者認証ミドルウェア追加）
			admin := protected.Group("/admin")
			{
				admin.POST("/salons", handlers.CreateSalon)
				admin.PUT("/salons/:id", handlers.UpdateSalon)
				admin.DELETE("/salons/:id", handlers.DeleteSalon)
			}
		}
	}

	return r
}
