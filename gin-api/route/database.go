// Directory: route/database.go
package route

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/jackc/pgx/v4"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/sirupsen/logrus"
	"golang.org/x/crypto/bcrypt"
)

// Credentials for login payload
type Credentials struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

var DB *pgxpool.Pool

// InitDB sets up the connection pool
func InitDB() error {
	dsn := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=%s",
		os.Getenv("POSTGRES_USER"),
		os.Getenv("POSTGRES_PASSWORD"),
		os.Getenv("POSTGRES_HOST"),
		os.Getenv("POSTGRES_PORT"),
		os.Getenv("POSTGRES_DB"),
		os.Getenv("POSTGRES_SSLMODE"),
	)
	config, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		return fmt.Errorf("unable to parse DB config: %w", err)
	}
	config.MaxConns = 10
	config.MinConns = 2
	config.MaxConnIdleTime = 5 * time.Minute

	pool, err := pgxpool.ConnectConfig(context.Background(), config)
	if err != nil {
		return fmt.Errorf("unable to connect to DB: %w", err)
	}
	DB = pool
	logrus.Info("Database connection pool established")
	return nil
}

func SaveData(key, value string) error {
	_, err := DB.Exec(context.Background(),
		`INSERT INTO data (key, value) VALUES ($1, $2)`, key, value)
	return err
}

// HandleLogin processes /db_route login requests
func HandleLogin(c *gin.Context) {
	var creds Credentials
	if err := c.ShouldBindJSON(&creds); err != nil {
		logrus.WithError(err).Warn("Invalid login payload")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	ok, err := AuthenticateUser(creds.Username, creds.Password)
	if err != nil {
		logrus.WithError(err).Error("Error during authentication")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"authenticated": false})
		return
	}

	token, err := GenerateJWT(creds.Username)
	if err != nil {
		logrus.WithError(err).Error("JWT generation failed")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"authenticated": true, "token": token})
}

// HandleHealth responds to health checks
func HandleHealth(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

// AuthenticateUser checks credentials against the DB
func AuthenticateUser(username, password string) (bool, error) {
	var storedHash string
	row := DB.QueryRow(context.Background(),
		`SELECT password FROM users WHERE username=$1`, username)
	// proper implementation so that it doesnt  leak whether a user exists or
	if err := row.Scan(&storedHash); err != nil {
		if err == pgx.ErrNoRows {
			return false, nil
		}
		return false, fmt.Errorf("DB query error: %w", err)
	}
	if bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(password)) != nil {
		return false, nil
	}
	return true, nil
}

// GenerateJWT issues a signed JWT
func GenerateJWT(username string) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return "", fmt.Errorf("JWT_SECRET not set")
	}
	claims := jwt.MapClaims{"sub": username, "exp": time.Now().Add(24 * time.Hour).Unix()}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	token.Header["kid"] = "v1" // JWT allows header to alloow multiple pub keys during transitions
	return token.SignedString([]byte(secret))
}
