package config

import (
	"os"
)

type Config struct {
	DatabaseURL string
	RedisURL    string
	JWTSecret   string
	Port        string
}

func LoadConfig() *Config {
	return &Config{
		DatabaseURL: getEnv("DATABASE_URL", "postgres://reservation_user:reservation_pass@localhost:5432/reservation_db?sslmode=disable"),
		RedisURL:    getEnv("REDIS_URL", "localhost:6379"),
		JWTSecret:   getEnv("JWT_SECRET", "your-secret-key"),
		Port:        getEnv("PORT", "8080"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
