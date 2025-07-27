package handlers

import (
	"errors"
	"net/http"
	"strconv"
	"time"

	"reservation-platform-sample/internal/domain/models"
	"reservation-platform-sample/internal/infrastructure/database"

	"github.com/gin-gonic/gin"
)

// GetReservations 予約一覧取得
func GetReservations(c *gin.Context) {
	var reservations []models.Reservation

	// ユーザーIDをコンテキストから取得（認証ミドルウェアで設定）
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	if err := database.DB.Where("user_id = ?", userID).
		Preload("Salon").
		Preload("Staff").
		Preload("Service").
		Find(&reservations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch reservations"})
		return
	}

	c.JSON(http.StatusOK, reservations)
}

// GetReservation 予約詳細取得
func GetReservation(c *gin.Context) {
	id := c.Param("id")
	var reservation models.Reservation

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	if err := database.DB.Where("id = ? AND user_id = ?", id, userID).
		Preload("Salon").
		Preload("Staff").
		Preload("Service").
		First(&reservation).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Reservation not found"})
		return
	}

	c.JSON(http.StatusOK, reservation)
}

// CreateReservation 予約作成
func CreateReservation(c *gin.Context) {
	var reservation models.Reservation

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	if err := c.ShouldBindJSON(&reservation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	reservation.UserID = userID.(uint)

	// 予約のバリデーション
	if err := validateReservation(&reservation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Create(&reservation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create reservation"})
		return
	}

	// 作成した予約を関連データと一緒に返す
	database.DB.Preload("Salon").Preload("Staff").Preload("Service").First(&reservation, reservation.ID)

	c.JSON(http.StatusCreated, reservation)
}

// UpdateReservation 予約更新
func UpdateReservation(c *gin.Context) {
	id := c.Param("id")
	var reservation models.Reservation

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	if err := database.DB.Where("id = ? AND user_id = ?", id, userID).First(&reservation).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Reservation not found"})
		return
	}

	if err := c.ShouldBindJSON(&reservation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 予約のバリデーション
	if err := validateReservation(&reservation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Save(&reservation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update reservation"})
		return
	}

	c.JSON(http.StatusOK, reservation)
}

// DeleteReservation 予約キャンセル
func DeleteReservation(c *gin.Context) {
	id := c.Param("id")
	var reservation models.Reservation

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	if err := database.DB.Where("id = ? AND user_id = ?", id, userID).First(&reservation).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Reservation not found"})
		return
	}

	// 予約ステータスをキャンセルに変更
	reservation.Status = "cancelled"
	if err := database.DB.Save(&reservation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to cancel reservation"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Reservation cancelled successfully"})
}

// GetAvailableSlots 空き時間取得
func GetAvailableSlots(c *gin.Context) {
	salonID := c.Param("salon_id")
	staffID := c.Query("staff_id")
	date := c.Query("date")

	if date == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Date is required"})
		return
	}

	parsedDate, err := time.Parse("2006-01-02", date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format"})
		return
	}

	slots, err := getAvailableSlots(salonID, staffID, parsedDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"slots": slots})
}

// validateReservation 予約のバリデーション
func validateReservation(reservation *models.Reservation) error {
	// 過去の日時チェック
	if reservation.StartTime.Before(time.Now()) {
		return errors.New("cannot book past dates")
	}

	// ダブルブッキングチェック
	var existingReservation models.Reservation
	err := database.DB.Where(
		"staff_id = ? AND reservation_date = ? AND status != 'cancelled' AND ((start_time <= ? AND end_time > ?) OR (start_time < ? AND end_time >= ?))",
		reservation.StaffID,
		reservation.ReservationDate,
		reservation.StartTime,
		reservation.StartTime,
		reservation.EndTime,
		reservation.EndTime,
	).First(&existingReservation).Error

	if err == nil {
		return errors.New("time slot is already booked")
	}

	return nil
}

// getAvailableSlots 空き時間計算
func getAvailableSlots(salonID, staffID string, date time.Time) ([]string, error) {
	// スタッフの勤務時間を取得
	var staff models.Staff
	query := database.DB.Where("salon_id = ?", salonID)
	if staffID != "" {
		query = query.Where("id = ?", staffID)
	}

	if err := query.First(&staff).Error; err != nil {
		return nil, err
	}

	// その日の既存予約を取得
	var reservations []models.Reservation
	err := database.DB.Where(
		"staff_id = ? AND reservation_date = ? AND status != 'cancelled'",
		staff.ID,
		date,
	).Find(&reservations).Error

	if err != nil {
		return nil, err
	}

	// 空き時間を計算（簡易版）
	// 実際の実装では、営業時間、スタッフの勤務時間、既存予約を考慮して計算
	var slots []string
	for hour := 9; hour <= 17; hour++ {
		timeSlot := strconv.Itoa(hour) + ":00"
		// TODO: 既存予約との重複チェック
		slots = append(slots, timeSlot)
	}

	return slots, nil
}
