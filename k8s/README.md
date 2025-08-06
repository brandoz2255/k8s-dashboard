# Kubernetes Deployment Guide

This directory contains Kubernetes manifests for the cyber-dashboard backend services.

## Architecture

The backend stack consists of:
- **Go Backend**: Gin API server (dulc3/command-be-gin) 
- **Python Backend**: FastAPI server (dulc3/command-be-py)
- **Database**: PostgreSQL 15

## Directory Structure

```
k8s/
├── shared/           # Shared resources
│   ├── namespace.yaml    # cyber-dashboard namespace
│   └── postgres.yaml     # PostgreSQL database
├── gin-api/          # Go backend manifests
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── configmap.yaml
│   └── secret.yaml
├── fastapi/          # Python backend manifests
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── configmap.yaml
│   └── secret.yaml
└── README.md
```

## Deployment Order

1. **Create namespace and shared resources:**
   ```bash
   kubectl apply -f shared/namespace.yaml
   kubectl apply -f shared/postgres.yaml
   ```

2. **Create secrets from templates:**
   ```bash
   # Copy template files and update with your actual values
   cp gin-api/secret.template.yaml gin-api/secret.yaml
   cp fastapi/secret.template.yaml fastapi/secret.yaml
   cp shared/postgres-secrets.template.yaml shared/postgres-secrets.yaml
   
   # Edit the secret files with your actual values, then apply
   kubectl apply -f shared/postgres-secrets.yaml
   kubectl apply -f gin-api/secret.yaml
   kubectl apply -f fastapi/secret.yaml
   ```

3. **Deploy backend services:**
   ```bash
   # ConfigMaps and Services
   kubectl apply -f gin-api/configmap.yaml
   kubectl apply -f fastapi/configmap.yaml
   kubectl apply -f gin-api/service.yaml
   kubectl apply -f fastapi/service.yaml
   
   # Deployments
   kubectl apply -f gin-api/deployment.yaml
   kubectl apply -f fastapi/deployment.yaml
   ```

## Secret Management

Secrets are managed using template files to avoid committing sensitive data:

- `gin-api/secret.template.yaml` → Copy to `gin-api/secret.yaml`
- `fastapi/secret.template.yaml` → Copy to `fastapi/secret.yaml`  
- `shared/postgres-secrets.template.yaml` → Copy to `shared/postgres-secrets.yaml`

Update the copied files with your actual secret values:

### Go Backend (gin-api/secret.yaml)
- `jwt-secret`: Strong JWT signing key

### Python Backend (fastapi/secret.yaml)  
- `openweather-api-key`: OpenWeatherMap API key (optional)

### PostgreSQL (shared/postgres-secrets.yaml)
- `username`: Database username
- `password`: Secure database password
- `database`: Database name (cyber_dashboard)

## Service Endpoints

Once deployed, backend services will be available at:
- **Go API**: http://gin-api-service:8080  
- **Python API**: http://fastapi-service:8000
- **PostgreSQL**: postgres-service:5432

## nginx Integration

Your existing nginx pod can proxy to these services using the service names above.

## Scaling

Scale deployments as needed:
```bash
kubectl scale deployment gin-api --replicas=3 -n cyber-dashboard  
kubectl scale deployment fastapi --replicas=3 -n cyber-dashboard
```