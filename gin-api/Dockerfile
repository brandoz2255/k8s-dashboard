# Stage 1: Build the Go application
FROM golang:1.20-alpine AS builder

# Set environment variables
ENV CGO_ENABLED=0 \
  GOOS=linux \
  GOARCH=amd64

# Set the working directory inside the container
WORKDIR /app

# Install git (required for fetching dependencies)
RUN apk add --no-cache git

# Copy go.mod and go.sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the rest of the application code
COPY . .

# Build the Go application
RUN go build -o cyber-command

# Stage 2: Create a minimal runtime image
FROM alpine:latest

# Set environment variables
ENV PORT=8080

# Set the working directory inside the container
WORKDIR /root/

# Copy the binary from the builder stage
COPY --from=builder /app/cyber-command .

# Expose the application's port
EXPOSE 8080

# Command to run the executable
CMD ["./cyber-command"]

