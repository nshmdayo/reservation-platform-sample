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

// GetReservations Get reservation list
func GetReservations(c *gin.Context) {
	var reservations []models.Reservation

	// Get user ID from context (set by authentication middleware)
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

// GetReservation Get reservation details
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

// CreateReservation Create reservation
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

	// Validate reservation
	if err := validateReservation(&reservation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Create(&reservation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create reservation"})
		return
	}

	// Return the created reservation with related data
	database.DB.Preload("Salon").Preload("Staff").Preload("Service").First(&reservation, reservation.ID)

	c.JSON(http.StatusCreated, reservation)
}

// UpdateReservation Update reservation
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

	// Validate reservation
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

// DeleteReservation Cancel reservation
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

	// Change reservation status to cancelled
	reservation.Status = "cancelled"
	if err := database.DB.Save(&reservation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to cancel reservation"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Reservation cancelled successfully"})
}

// GetAvailableSlots Get available time slots
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

// validateReservation Validate reservation
func validateReservation(reservation *models.Reservation) error {
	// Check for past date/time
	if reservation.StartTime.Before(time.Now()) {
		return errors.New("cannot book past dates")
	}

	// Check for double booking
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

// getAvailableSlots Calculate available time slots
func getAvailableSlots(salonID, staffID string, date time.Time) ([]string, error) {
	// Get staff working hours
	var staff models.Staff
	query := database.DB.Where("salon_id = ?", salonID)
	if staffID != "" {
		query = query.Where("id = ?", staffID)
	}

	if err := query.First(&staff).Error; err != nil {
		return nil, err
	}

	// Get existing reservations for that day
	var reservations []models.Reservation
	err := database.DB.Where(
		"staff_id = ? AND reservation_date = ? AND status != 'cancelled'",
		staff.ID,
		date,
	).Find(&reservations).Error

	if err != nil {
		return nil, err
	}

	// Calculate available time slots (simplified version)
	// In actual implementation, consider business hours, staff working hours, and existing reservations
	var slots []string
	for hour := 9; hour <= 17; hour++ {
		timeSlot := strconv.Itoa(hour) + ":00"
		// TODO: Check for overlap with existing reservations
		slots = append(slots, timeSlot)
	}

	return slots, nil
}
