# 🚀 Task Management API - Advanced DevOps CI/CD Project

[![CI Pipeline](https://github.com/yourusername/DevOpsTerm9/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/DevOpsTerm9/actions/workflows/ci.yml)
[![CD Pipeline](https://github.com/yourusername/DevOpsTerm9/actions/workflows/cd.yml/badge.svg)](https://github.com/yourusername/DevOpsTerm9/actions/workflows/cd.yml)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A production-grade **Task Management API** built with Node.js/Express, demonstrating enterprise-level DevOps practices including comprehensive CI/CD pipelines, security scanning, containerization, and Kubernetes deployment.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [API Endpoints](#api-endpoints)
- [Architecture](#architecture)
- [CI/CD Pipeline](#cicd-pipeline)
- [Getting Started](#getting-started)
- [Local Development](#local-development)
- [Docker](#docker)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Security](#security)
- [Testing](#testing)
- [Project Structure](#project-structure)

---

## 🎯 Project Overview

This project implements a **Task Management API** with user authentication, task CRUD operations, task assignment, and analytics features. The primary focus is on demonstrating professional DevOps practices rather than just building an application.

### Key Features

✅ **RESTful API** - Clean, well-documented REST endpoints  
✅ **JWT Authentication** - Secure token-based authentication  
✅ **Task Management** - Full CRUD operations with status tracking  
✅ **Task Assignment** - Assign tasks to team members  
✅ **Analytics Dashboard** - Task statistics and trends  
✅ **Production-Ready** - Proper error handling, validation, and logging

### Why This Project?

This project demonstrates:
- **Real-world application** (not a trivial "Hello World")
- **Easy to explain** in interviews/demos
- **Comprehensive DevOps** coverage
- **Security-first** approach
- **Scalable architecture**

---

## 🔌 API Endpoints

### Authentication APIs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register new user | ❌ |
| POST | `/api/v1/auth/login` | Login user | ❌ |
| GET | `/api/v1/auth/profile` | Get user profile | ✅ |

### Task Management APIs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/tasks` | Create new task | ✅ |
| GET | `/api/v1/tasks` | Get all tasks | ✅ |
| GET | `/api/v1/tasks/:id` | Get task by ID | ✅ |
| PUT | `/api/v1/tasks/:id` | Update task | ✅ |
| DELETE | `/api/v1/tasks/:id` | Delete task | ✅ |
| POST | `/api/v1/tasks/:id/assign` | Assign task to user | ✅ |

### Analytics APIs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/analytics/statistics` | Get task statistics | ✅ |
| GET | `/api/v1/analytics/trends` | Get task trends | ✅ |

### System APIs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Health check | ❌ |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub Actions CI/CD                     │
├─────────────────────────────────────────────────────────────┤
│  Linting → SAST → SCA → Tests → Build → Scan → Deploy      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Docker Registry                         │
│                     (DockerHub)                              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Kubernetes Cluster                         │
├─────────────────────────────────────────────────────────────┤
│  Ingress → Service → Deployment (3 replicas)                │
│  ConfigMap | Secrets | HPA | Health Checks                  │
└─────────────────────────────────────────────────────────────┘
```

### Application Architecture

```
src/
├── server.js              # Express server setup
├── middleware/
│   ├── auth.middleware.js       # JWT authentication
│   ├── error.middleware.js      # Error handling
│   └── validation.middleware.js # Request validation
├── controllers/
│   ├── auth.controller.js       # Auth logic
│   ├── task.controller.js       # Task management
│   └── analytics.controller.js  # Analytics logic
└── routes/
    ├── auth.routes.js           # Auth endpoints
    ├── task.routes.js           # Task endpoints
    └── analytics.routes.js      # Analytics endpoints
```

---

## 🔄 CI/CD Pipeline

### Continuous Integration (CI)

Our CI pipeline ensures code quality, security, and reliability through 9 comprehensive stages:

#### Stage 1️⃣: Code Quality & Linting
**Purpose**: Enforce coding standards and prevent technical debt  
**Tools**: ESLint with Airbnb style guide, security plugin  
**Why**: Catches syntax errors, bad patterns, and security issues early

#### Stage 2️⃣: SAST - CodeQL Analysis
**Purpose**: Detect code-level vulnerabilities (OWASP Top 10)  
**Tools**: GitHub CodeQL  
**Why**: Identifies SQL injection, XSS, authentication issues before deployment

#### Stage 3️⃣: SCA - Dependency Scanning
**Purpose**: Identify vulnerable dependencies  
**Tools**: npm audit, Dependency Review  
**Why**: Prevents supply-chain attacks from compromised packages

#### Stage 4️⃣: Unit Tests & Coverage
**Purpose**: Validate business logic and code coverage  
**Tools**: Jest with 70% coverage threshold  
**Why**: Ensures code correctness and prevents regressions

#### Stage 5️⃣: Application Build
**Purpose**: Verify application compiles successfully  
**Why**: Catches build-time errors before containerization

#### Stage 6️⃣: Docker Build & Vulnerability Scan
**Purpose**: Create container image and scan for OS/library vulnerabilities  
**Tools**: Docker Buildx, Trivy  
**Why**: Prevents shipping vulnerable container images

#### Stage 7️⃣: Container Runtime Testing
**Purpose**: Validate container behavior in runtime  
**Why**: Ensures container starts correctly and endpoints respond

#### Stage 8️⃣: DockerHub Push
**Purpose**: Publish trusted image to registry  
**Condition**: Only on master/main branch  
**Why**: Makes image available for deployment

#### Stage 9️⃣: CI Summary
**Purpose**: Provide comprehensive pipeline status  
**Why**: Quick visibility into pipeline execution results

### Continuous Deployment (CD)

Our CD pipeline automates deployment to Kubernetes with security validation:

#### Stage 1️⃣: Pre-Deployment Validation
- Validate Kubernetes manifests (YAML syntax)
- Verify Docker image availability
- Check deployment prerequisites

#### Stage 2️⃣: Kubernetes Deployment
- Configure kubectl context
- Apply deployment manifests
- Wait for rollout completion
- Verify pod status

#### Stage 3️⃣: Post-Deployment Health Check
- Get service endpoint
- Run health checks
- Execute smoke tests

#### Stage 4️⃣: DAST - Dynamic Security Testing
**Purpose**: Runtime security analysis  
**Tools**: OWASP ZAP  
**Why**: Detects runtime vulnerabilities like CSRF, session management issues

#### Stage 5️⃣: Performance Testing
- Load testing with Artillery
- Response time validation
- Throughput analysis

#### Stage 6️⃣: Deployment Notification
- Send status to team
- Log deployment metadata

#### Stage 7️⃣: Automatic Rollback
- Triggers on deployment failure
- Reverts to previous stable version
- Ensures zero downtime

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Docker** (for containerization)
- **kubectl** (for Kubernetes deployment)
- **Git**

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRY=24h
API_VERSION=v1
API_RATE_LIMIT=100
```

---

## 💻 Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/DevOpsTerm9.git
cd DevOpsTerm9
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Tests

```bash
npm test
```

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### 5. Test the API

```bash
# Health check
curl http://localhost:3000/health

# Register a user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

---

## 🐳 Docker

### Build Docker Image

```bash
docker build -t task-management-api:latest .
```

### Run Container

```bash
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=your-secret-key \
  --name task-api \
  task-management-api:latest
```

### View Logs

```bash
docker logs task-api
```

### Stop Container

```bash
docker stop task-api && docker rm task-api
```

---

## ☸️ Kubernetes Deployment

### 1. Create Namespace

```bash
kubectl apply -f k8s/namespace.yaml
```

### 2. Create Secrets

```bash
kubectl create secret generic app-secrets \
  --from-literal=jwt-secret=your-production-secret \
  -n task-management
```

### 3. Apply ConfigMap

```bash
kubectl apply -f k8s/configmap.yaml
```

### 4. Deploy Application

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/hpa.yaml
kubectl apply -f k8s/ingress.yaml
```

### 5. Verify Deployment

```bash
# Check pods
kubectl get pods -n task-management

# Check service
kubectl get svc -n task-management

# Check deployment
kubectl get deployment -n task-management

# View logs
kubectl logs -f deployment/task-management-api -n task-management
```

### 6. Access the API

```bash
# Get service endpoint
kubectl get svc task-management-api -n task-management

# Port forward for local access
kubectl port-forward svc/task-management-api 3000:80 -n task-management
```

---

## 🔒 Security

### Security Features Implemented

✅ **Helmet.js** - HTTP header security  
✅ **Rate Limiting** - Prevent DDoS attacks  
✅ **JWT Authentication** - Secure token-based auth  
✅ **Password Hashing** - bcrypt with salt rounds  
✅ **Input Validation** - express-validator  
✅ **CORS** - Cross-Origin Resource Sharing  
✅ **Non-root User** - Docker runs as nodejs:1001  
✅ **Read-only Filesystem** - Kubernetes security context

### Security Scanning

- **SAST**: CodeQL for code vulnerabilities
- **SCA**: npm audit for dependency vulnerabilities
- **Container Scan**: Trivy for image vulnerabilities
- **DAST**: OWASP ZAP for runtime vulnerabilities

### GitHub Secrets Configuration

Configure these secrets in GitHub repository settings:

```
DOCKERHUB_USERNAME  → Your DockerHub username
DOCKERHUB_TOKEN     → Your DockerHub access token
KUBE_CONFIG         → Base64 encoded kubeconfig (for CD)
```

---

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### View Coverage Report

```bash
npm test
open coverage/lcov-report/index.html
```

### Test Coverage Requirements

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Test Structure

```
tests/
├── server.test.js       # Health check & 404 tests
├── auth.test.js         # Authentication tests
├── task.test.js         # Task management tests
└── analytics.test.js    # Analytics tests
```

---

## 📁 Project Structure

```
DevOpsTerm9/
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI pipeline
│       └── cd.yml              # CD pipeline
├── k8s/
│   ├── namespace.yaml          # Kubernetes namespace
│   ├── deployment.yaml         # Deployment configuration
│   ├── service.yaml            # Service configuration
│   ├── configmap.yaml          # ConfigMap
│   ├── secrets.yaml            # Secrets (template)
│   ├── ingress.yaml            # Ingress configuration
│   └── hpa.yaml                # Horizontal Pod Autoscaler
├── src/
│   ├── server.js               # Express server
│   ├── middleware/             # Middleware functions
│   ├── controllers/            # Business logic
│   └── routes/                 # API routes
├── tests/
│   ├── server.test.js          # Server tests
│   ├── auth.test.js            # Auth tests
│   ├── task.test.js            # Task tests
│   └── analytics.test.js       # Analytics tests
├── .dockerignore               # Docker ignore file
├── .env.example                # Environment variables template
├── .eslintrc.json              # ESLint configuration
├── .gitignore                  # Git ignore file
├── Dockerfile                  # Multi-stage Dockerfile
├── jest.config.js              # Jest configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

---

## 📊 CI/CD Pipeline Stages Summary

| Stage | Purpose | Tools | Why It Matters |
|-------|---------|-------|----------------|
| Linting | Code quality | ESLint | Prevents technical debt |
| SAST | Code security | CodeQL | Detects OWASP Top 10 |
| SCA | Dependency security | npm audit | Supply-chain protection |
| Tests | Logic validation | Jest | Prevents regressions |
| Build | Compilation | npm | Catches build errors |
| Docker Build | Containerization | Docker | Creates deployable artifact |
| Image Scan | Container security | Trivy | Prevents vulnerable images |
| Runtime Test | Container validation | curl | Ensures runnable container |
| Push | Registry upload | DockerHub | Enables deployment |
| DAST | Runtime security | OWASP ZAP | Detects runtime vulnerabilities |

---

## 🎓 Learning Outcomes

By completing this project, you demonstrate:

1. **CI/CD Pipeline Design** - Multi-stage, secure, automated
2. **DevSecOps** - Security integrated throughout SDLC
3. **Containerization** - Docker best practices
4. **Kubernetes** - Production deployment strategies
5. **Testing** - Comprehensive test coverage
6. **Security** - Multiple layers of security controls
7. **Documentation** - Clear, comprehensive docs

---

## 📝 Submission Checklist

- [x] GitHub Repository with all code
- [x] CI/CD pipelines (ci.yml, cd.yml)
- [x] Comprehensive README
- [x] Test coverage >= 70%
- [x] Docker image on DockerHub
- [x] Kubernetes manifests
- [x] GitHub Secrets configured
- [x] Working demo deployment
- [x] Security scans passing
- [x] Project report (Max 10 pages)

---

## 🤝 Contributing

This is an educational project. Feel free to fork and extend!

---

## 📄 License

MIT License - see LICENSE file for details

---

## 👨‍💻 Author

**DevOps Team**  
Scaler Academy - Advanced DevOps CI/CD Project  
Term 9, 2026

---

## 🙏 Acknowledgments

- GitHub Actions for CI/CD platform
- Node.js & Express community
- Docker & Kubernetes projects
- Security tools: CodeQL, Trivy, OWASP ZAP
- Scaler Academy DevOps Program

---

## 📞 Support

For questions or issues:
- Create an issue in this repository
- Contact via email: devops@example.com
- Scaler Academy support channels

---

**⭐ If you found this project helpful, please give it a star!**
