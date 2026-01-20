# Quick Start Guide

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Copy environment file**:
   ```bash
   cp .env.example .env
   ```

3. **Run tests**:
   ```bash
   npm test
   ```

4. **Start server**:
   ```bash
   npm run dev
   ```

## Docker

```bash
# Build
docker build -t task-api .

# Run
docker run -p 3000:3000 -e JWT_SECRET=secret task-api
```

## API Testing

### Register User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Create Task (requires token from login)
```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Complete DevOps Project",
    "description": "Implement CI/CD pipeline",
    "priority": "high",
    "dueDate": "2026-01-20"
  }'
```

### Get All Tasks
```bash
curl http://localhost:3000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Analytics
```bash
curl http://localhost:3000/api/v1/analytics/statistics \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Kubernetes Deployment

```bash
# Create namespace and secrets
kubectl apply -f k8s/namespace.yaml
kubectl create secret generic app-secrets \
  --from-literal=jwt-secret=your-secret \
  -n task-management

# Deploy application
kubectl apply -f k8s/

# Check status
kubectl get all -n task-management

# View logs
kubectl logs -f deployment/task-management-api -n task-management
```

## CI/CD Setup

### GitHub Secrets
Add these secrets in GitHub repository settings:
- `DOCKERHUB_USERNAME`: Your DockerHub username
- `DOCKERHUB_TOKEN`: Your DockerHub access token

### Trigger CI Pipeline
```bash
git add .
git commit -m "feat: implement feature"
git push origin main
```

## Troubleshooting

### Port Already in Use
```bash
# Find process
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)
```

### Docker Issues
```bash
# Clean up
docker system prune -a

# View logs
docker logs <container-id>
```

### Test Failures
```bash
# Clear cache
npm test -- --clearCache

# Run specific test
npm test -- auth.test.js
```
