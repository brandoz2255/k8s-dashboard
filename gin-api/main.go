package main

import (
	"github.com/dulc3/k8s-dashboard/gin-api/route"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/sirupsen/logrus"
)

func main() {
	logrus.SetFormatter(&logrus.JSONFormatter{})
	logrus.SetLevel(logrus.InfoLevel)

	if err := route.InitDB(); err != nil {
		logrus.WithError(err).Fatal("Failed to initialize database")
	}
	defer route.DB.Close()

	router := gin.New()
	router.Use(gin.Logger(), gin.Recovery())

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"https://command.dulc3.tech"},
		AllowMethods:     []string{"POST", "GET", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.POST("/db_route", route.HandleLogin)
	router.GET("/healthz", route.HandleHealth)

	// ✅ ADDING: Protected routes under /api
	authGroup := router.Group("/api", AuthMiddleware())
	authGroup.GET("/secure-data", secureHandler) // Example secured endpoint

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	logrus.Infof("Starting server on port %s", port)
	if err := router.Run(":" + port); err != nil {
		logrus.Fatal("Server failed to start:", err)
	}
}

// Authentication middleware for JWT iis iimportant
// why since it protects the API from unauthorized access by verifying the JWT token
// we can store user identity in context for underlying handlers
// blocks access to protected apis iif the token is missing or invalid
// keeps my code modular and clean with seprating concerns
// ✅ NEW: AuthMiddleware for verifying JWT tokens
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing or malformed"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		secret := os.Getenv("JWT_SECRET")
		if secret == "" {
			logrus.Fatal("JWT_SECRET not set")
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return []byte(secret), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Store user info in context (e.g., sub = username)
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			c.Set("username", claims["sub"])
		}
		c.Next()
	}
}

// ✅ NEW: Example secured endpoint handler
func secureHandler(c *gin.Context) {
	user, _ := c.Get("username")
	c.JSON(http.StatusOK, gin.H{
		"message":  "You are authorized 🎉",
		"username": user,
	})
}
