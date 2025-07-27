package handlers

import (
	"net/http"
	"strconv"

	"reservation-platform-sample/internal/domain/models"

	"github.com/gin-gonic/gin"
)

// GetSalonsDemo デモ用美容院一覧取得
func GetSalonsDemo(c *gin.Context) {
	salons := []models.Salon{
		{
			ID:          1,
			Name:        "Hair Salon Tokyo",
			Description: "東京で人気の美容院です。経験豊富なスタイリストが最新のトレンドを取り入れながら、お客様一人一人に合ったスタイルをご提案いたします。",
			Address:     "東京都渋谷区渋谷1-1-1 サンプルビル3F",
			Phone:       "03-1234-5678",
			Email:       "info@hairsalon-tokyo.com",
			ImageURL:    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
		},
		{
			ID:          2,
			Name:        "Beauty Studio Shibuya",
			Description: "スタイリッシュなカットとカラーが自慢の美容院です。モダンな空間でリラックスしながら、理想のヘアスタイルを実現します。",
			Address:     "東京都渋谷区渋谷2-2-2 ビューティービル2F",
			Phone:       "03-2345-6789",
			Email:       "contact@beauty-shibuya.com",
			ImageURL:    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800",
		},
		{
			ID:          3,
			Name:        "Cut & Color Harajuku",
			Description: "カラーリングの専門店です。個性的なスタイルから上品なカラーまで、幅広いニーズにお応えします。",
			Address:     "東京都渋谷区神宮前1-1-1 ファッションビル4F",
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

// GetSalonDemo デモ用美容院詳細取得
func GetSalonDemo(c *gin.Context) {
	id := c.Param("id")
	salonID, _ := strconv.Atoi(id)

	salon := models.Salon{
		ID:          uint(salonID),
		Name:        "Hair Salon Tokyo",
		Description: "東京で人気の美容院です。経験豊富なスタイリストが、お客様一人一人に合ったスタイルをご提案いたします。リラックスできる空間で、上質なサービスをお楽しみください。",
		Address:     "東京都渋谷区渋谷1-1-1 サンプルビル3F",
		Phone:       "03-1234-5678",
		Email:       "info@hairsalon-tokyo.com",
		Website:     "https://hairsalon-tokyo.com",
		ImageURL:    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
		Staff: []models.Staff{
			{
				ID:              1,
				SalonID:         uint(salonID),
				Name:            "田中 美咲",
				Description:     "10年の経験を持つスタイリスト。カットとカラーが得意です。お客様のライフスタイルに合わせたスタイルをご提案します。",
				ImageURL:        "https://images.unsplash.com/photo-1494790108755-2616c9f9e6f5?w=400",
				Specialties:     []string{"カット", "カラー"},
				ExperienceYears: 10,
				IsActive:        true,
			},
			{
				ID:              2,
				SalonID:         uint(salonID),
				Name:            "佐藤 健太",
				Description:     "パーマとセットが得意なスタイリストです。トレンドを取り入れた最新のスタイルをお楽しみください。",
				ImageURL:        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
				Specialties:     []string{"パーマ", "セット"},
				ExperienceYears: 8,
				IsActive:        true,
			},
		},
		Services: []models.Service{
			{
				ID:              1,
				SalonID:         uint(salonID),
				Name:            "カット",
				Description:     "シャンプー・ブロー込み",
				Price:           4000,
				DurationMinutes: 60,
				Category:        "カット",
				IsActive:        true,
			},
			{
				ID:              2,
				SalonID:         uint(salonID),
				Name:            "カット + カラー",
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
