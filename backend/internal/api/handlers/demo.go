package handlers

import (
	"net/http"
	"strconv"

	"reservation-platform-sample/internal/domain/models"

	"github.com/gin-gonic/gin"
)

// GetSalonsDemo Demo salon list retrieval
func GetSalonsDemo(c *gin.Context) {
	salons := []models.Salon{
		{
			ID:          1,
			Name:        "Hair Salon Tokyo",
			Description: "A popular beauty salon in Tokyo. Experienced stylists incorporate the latest trends while proposing styles that suit each customer individually.",
			Address:     "Sample Building 3F, 1-1-1 Shibuya, Shibuya-ku, Tokyo",
			Phone:       "03-1234-5678",
			Email:       "info@hairsalon-tokyo.com",
			ImageURL:    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
		},
		{
			ID:          2,
			Name:        "Beauty Studio Shibuya",
			Description: "A beauty salon known for stylish cuts and colors. Realize your ideal hairstyle while relaxing in a modern space.",
			Address:     "Beauty Building 2F, 2-2-2 Shibuya, Shibuya-ku, Tokyo",
			Phone:       "03-2345-6789",
			Email:       "contact@beauty-shibuya.com",
			ImageURL:    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800",
		},
		{
			ID:          3,
			Name:        "Cut & Color Harajuku",
			Description: "Hair coloring specialty salon. We cater to a wide range of needs from unique styles to elegant colors.",
			Address:     "1-1-1 Jingumae, Shibuya-ku, Tokyo Fashion Building 4F",
			Phone:       "03-3456-7890",
			Email:       "info@cutcolor-harajuku.com",
			ImageURL:    "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800",
		},
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  salons,
		"page":  1,
		"limit": 10,
	})
}

// GetSalonDemo Demo beauty salon details
func GetSalonDemo(c *gin.Context) {
	id := c.Param("id")
	salonID, _ := strconv.Atoi(id)

	salon := models.Salon{
		ID:          uint(salonID),
		Name:        "Hair Salon Tokyo",
		Description: "Popular beauty salon in Tokyo. Our experienced stylists will propose styles that suit each customer individually. Enjoy high-quality service in a relaxing space.",
		Address:     "1-1-1 Shibuya, Shibuya-ku, Tokyo Sample Building 3F",
		Phone:       "03-1234-5678",
		Email:       "info@hairsalon-tokyo.com",
		Website:     "https://hairsalon-tokyo.com",
		ImageURL:    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
		Staff: []models.Staff{
			{
				ID:              1,
				SalonID:         uint(salonID),
				Name:            "Misaki Tanaka",
				Description:     "Stylist with 10 years of experience. Specializes in cuts and coloring. I propose styles that match customers' lifestyles.",
				ImageURL:        "https://images.unsplash.com/photo-1494790108755-2616c9f9e6f5?w=400",
				Specialties:     []string{"Cut", "Color"},
				ExperienceYears: 10,
				IsActive:        true,
			},
			{
				ID:              2,
				SalonID:         uint(salonID),
				Name:            "Kenta Sato",
				Description:     "Stylist specializing in perms and styling. Enjoy the latest styles incorporating trends.",
				ImageURL:        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
				Specialties:     []string{"Perm", "Styling"},
				ExperienceYears: 8,
				IsActive:        true,
			},
		},
		Services: []models.Service{
			{
				ID:              1,
				SalonID:         uint(salonID),
				Name:            "Cut",
				Description:     "Includes shampoo and blow dry",
				Price:           4000,
				DurationMinutes: 60,
				Category:        "Cut",
				IsActive:        true,
			},
			{
				ID:              2,
				SalonID:         uint(salonID),
				Name:            "Cut + Color",
				Description:     "カット＋カラーリング＋シャンプー・ブロー",
				Price:           8000,
				DurationMinutes: 120,
				Category:        "カラー",
				IsActive:        true,
			},
			{
				ID:              3,
				SalonID:         uint(salonID),
				Name:            "パーマ",
				Description:     "パーマ＋カット＋シャンプー・ブロー",
				Price:           10000,
				DurationMinutes: 150,
				Category:        "パーマ",
				IsActive:        true,
			},
		},
	}

	c.JSON(http.StatusOK, salon)
}

// GetAvailableSlotsDemo デモ用空き時間取得
func GetAvailableSlotsDemo(c *gin.Context) {
	slots := []string{
		"09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
		"14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
	}

	c.JSON(http.StatusOK, gin.H{"slots": slots})
}
