package handlers

import (
	"net/http"
	"strconv"

	"reservation-platform-sample/internal/domain/models"
	"reservation-platform-sample/internal/infrastructure/database"

	"github.com/gin-gonic/gin"
)

// GetSalons 美容院一覧取得
func GetSalons(c *gin.Context) {
	var salons []models.Salon

	// クエリパラメータの取得
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := c.Query("search")

	offset := (page - 1) * limit

	query := database.DB.Preload("Staff").Preload("Services")

	// 検索条件
	if search != "" {
		query = query.Where("name ILIKE ? OR address ILIKE ?", "%"+search+"%", "%"+search+"%")
	}

	if err := query.Offset(offset).Limit(limit).Find(&salons).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch salons"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  salons,
		"page":  page,
		"limit": limit,
	})
}

// GetSalon 美容院詳細取得
func GetSalon(c *gin.Context) {
	id := c.Param("id")
	var salon models.Salon

	if err := database.DB.Preload("Staff").Preload("Services").First(&salon, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Salon not found"})
		return
	}

	c.JSON(http.StatusOK, salon)
}

// CreateSalon 美容院作成
func CreateSalon(c *gin.Context) {
	var salon models.Salon

	if err := c.ShouldBindJSON(&salon); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Create(&salon).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create salon"})
		return
	}

	c.JSON(http.StatusCreated, salon)
}

// UpdateSalon 美容院更新
func UpdateSalon(c *gin.Context) {
	id := c.Param("id")
	var salon models.Salon

	if err := database.DB.First(&salon, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Salon not found"})
		return
	}

	if err := c.ShouldBindJSON(&salon); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Save(&salon).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update salon"})
		return
	}

	c.JSON(http.StatusOK, salon)
}

// DeleteSalon 美容院削除
func DeleteSalon(c *gin.Context) {
	id := c.Param("id")
	var salon models.Salon

	if err := database.DB.First(&salon, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Salon not found"})
		return
	}

	if err := database.DB.Delete(&salon).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete salon"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Salon deleted successfully"})
}
