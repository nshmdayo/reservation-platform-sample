package routes

import (
	"reservation-platform-sample/internal/api/handlers"
	"reservation-platform-sample/internal/api/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRoutes() *gin.Engine {
	r := gin.Default()

	// CORS configuration
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	r.Use(cors.New(config))

	// API v1 route group
	api := r.Group("/api")
	{
		// Routes that don't require authentication
		auth := api.Group("/auth")
		{
			auth.POST("/register", handlers.Register)
			auth.POST("/login", handlers.Login)
		}

		// Salon related (no authentication required)
		api.GET("/salons", handlers.GetSalons)
		api.GET("/salons/:id", handlers.GetSalon)
		api.GET("/salons/:salon_id/slots", handlers.GetAvailableSlots)

		// Routes that require authentication
		protected := api.Group("")
		protected.Use(middleware.AuthMiddleware())
		{
			// User related
			protected.GET("/auth/me", handlers.GetProfile)

			// Reservation related
			protected.GET("/reservations", handlers.GetReservations)
			protected.GET("/reservations/:id", handlers.GetReservation)
			protected.POST("/reservations", handlers.CreateReservation)
			protected.PUT("/reservations/:id", handlers.UpdateReservation)
			protected.DELETE("/reservations/:id", handlers.DeleteReservation)

			// Admin only routes (TODO: Add admin authentication middleware)
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
