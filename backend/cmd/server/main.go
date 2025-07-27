package main

import (
	"log"
	"os"

	"reservation-platform-sample/internal/api/routes"
	"reservation-platform-sample/internal/config"
	"reservation-platform-sample/internal/infrastructure/database"
)

func main() {
	// Load configuration
	cfg := config.LoadConfig()

	// Check demo mode
	demoMode := os.Getenv("DEMO_MODE") == "true"

	if demoMode {
		log.Println("Starting server in DEMO mode (no database required)")
		// Demo route configuration
		r := routes.SetupDemoRoutes()
		log.Printf("Demo server starting on port %s", cfg.Port)
		if err := r.Run(":" + cfg.Port); err != nil {
			log.Fatal("Failed to start server:", err)
		}
		return
	}

	// Normal mode (with database connection)
	log.Println("Starting server in PRODUCTION mode")

	// Database connection
	if err := database.Connect(cfg); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Run migrations
	if err := database.Migrate(); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Route configuration
	r := routes.SetupRoutes()

	// Start server
	log.Printf("Server starting on port %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
