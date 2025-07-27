package models

import (
	"time"

	"gorm.io/gorm"
)

type Salon struct {
	ID           uint                   `json:"id" gorm:"primaryKey"`
	Name         string                 `json:"name" gorm:"not null"`
	Description  string                 `json:"description"`
	Address      string                 `json:"address" gorm:"not null"`
	Phone        string                 `json:"phone"`
	Email        string                 `json:"email"`
	Website      string                 `json:"website"`
	ImageURL     string                 `json:"image_url"`
	OpeningHours map[string]interface{} `json:"opening_hours" gorm:"type:jsonb"`
	Latitude     float64                `json:"latitude"`
	Longitude    float64                `json:"longitude"`
	Staff        []Staff                `json:"staff,omitempty" gorm:"foreignKey:SalonID"`
	Services     []Service              `json:"services,omitempty" gorm:"foreignKey:SalonID"`
	CreatedAt    time.Time              `json:"created_at"`
	UpdatedAt    time.Time              `json:"updated_at"`
	DeletedAt    gorm.DeletedAt         `json:"-" gorm:"index"`
}

type Staff struct {
	ID              uint                   `json:"id" gorm:"primaryKey"`
	SalonID         uint                   `json:"salon_id" gorm:"not null"`
	Name            string                 `json:"name" gorm:"not null"`
	Description     string                 `json:"description"`
	ImageURL        string                 `json:"image_url"`
	Specialties     []string               `json:"specialties" gorm:"type:text[]"`
	ExperienceYears int                    `json:"experience_years"`
	WorkingHours    map[string]interface{} `json:"working_hours" gorm:"type:jsonb"`
	IsActive        bool                   `json:"is_active" gorm:"default:true"`
	Salon           *Salon                 `json:"salon,omitempty"`
	Reservations    []Reservation          `json:"reservations,omitempty" gorm:"foreignKey:StaffID"`
	CreatedAt       time.Time              `json:"created_at"`
	UpdatedAt       time.Time              `json:"updated_at"`
	DeletedAt       gorm.DeletedAt         `json:"-" gorm:"index"`
}

type Service struct {
	ID              uint           `json:"id" gorm:"primaryKey"`
	SalonID         uint           `json:"salon_id" gorm:"not null"`
	Name            string         `json:"name" gorm:"not null"`
	Description     string         `json:"description"`
	Price           int            `json:"price" gorm:"not null"`            // 価格（円）
	DurationMinutes int            `json:"duration_minutes" gorm:"not null"` // 所要時間（分）
	Category        string         `json:"category"`
	IsActive        bool           `json:"is_active" gorm:"default:true"`
	Salon           *Salon         `json:"salon,omitempty"`
	Reservations    []Reservation  `json:"reservations,omitempty" gorm:"foreignKey:ServiceID"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `json:"-" gorm:"index"`
}

type User struct {
	ID           uint           `json:"id" gorm:"primaryKey"`
	Email        string         `json:"email" gorm:"uniqueIndex;not null"`
	PasswordHash string         `json:"-" gorm:"not null"`
	Name         string         `json:"name" gorm:"not null"`
	Phone        string         `json:"phone"`
	DateOfBirth  *time.Time     `json:"date_of_birth"`
	Gender       string         `json:"gender"`
	Role         string         `json:"role" gorm:"default:'customer'"` // customer, admin, staff
	Reservations []Reservation  `json:"reservations,omitempty" gorm:"foreignKey:UserID"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `json:"-" gorm:"index"`
}

type Reservation struct {
	ID              uint           `json:"id" gorm:"primaryKey"`
	SalonID         uint           `json:"salon_id" gorm:"not null"`
	StaffID         uint           `json:"staff_id" gorm:"not null"`
	UserID          uint           `json:"user_id" gorm:"not null"`
	ServiceID       uint           `json:"service_id" gorm:"not null"`
	ReservationDate time.Time      `json:"reservation_date" gorm:"not null"`
	StartTime       time.Time      `json:"start_time" gorm:"not null"`
	EndTime         time.Time      `json:"end_time" gorm:"not null"`
	Status          string         `json:"status" gorm:"default:'confirmed'"` // confirmed, cancelled, completed
	Notes           string         `json:"notes"`
	TotalPrice      int            `json:"total_price" gorm:"not null"`
	Salon           *Salon         `json:"salon,omitempty"`
	Staff           *Staff         `json:"staff,omitempty"`
	User            *User          `json:"user,omitempty"`
	Service         *Service       `json:"service,omitempty"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `json:"-" gorm:"index"`
}
