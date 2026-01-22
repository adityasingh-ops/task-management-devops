# 📄 ONE-PAGE VIVA CHEAT SHEET (Print This!)

## 🔢 KEY NUMBERS
- **12** APIs | **9** CI stages | **7** CD stages | **91%** coverage
- **3** pods (default) → **3-10** with HPA | **70%** CPU trigger
- **5** security tools | **7** K8s resources

## 🎯 PROJECT IN 30 SECONDS
"Task Management API with automated DevOps CI/CD. 12 REST endpoints for auth & task management. CI has 9 stages (lint→SAST→tests→docker→scan). CD deploys to K8s with 3 replicas, auto-scaling, & rollback. 91% test coverage. 5 security layers."

## 💬 TOP 10 Q&A

**1. What is CI/CD?**
CI = Auto build+test on code push | CD = Auto deploy to production

**2. What's in CI pipeline?**
Lint → CodeQL (SAST) → npm audit (SCA) → Jest tests → Docker → Trivy → Push (9 stages)

**3. What security tools?**
CodeQL, npm audit, Trivy, OWASP ZAP, Helmet + JWT + bcrypt + validation

**4. What is Docker?**
Containerization = App + dependencies in one package. Multi-stage build, non-root user.

**5. What is Kubernetes?**
Container orchestration = Auto-scaling, self-healing, load balancing, rolling updates.

**6. Test coverage?**
91%+ with Jest & Supertest. Tests auth, CRUD, middleware, analytics.

**7. How many pods?**
3 default, HPA scales 3-10 based on 70% CPU threshold.

**8. What is HPA?**
Horizontal Pod Autoscaler = Automatically adds/removes pods based on CPU/memory.

**9. What is Rolling Update?**
Zero-downtime deployment = Gradually replace old pods with new ones.

**10. What if deployment fails?**
Automatic rollback triggered by health checks, reverts to previous version.

## 🏗️ ARCHITECTURE
```
Code Push → GitHub
    ↓
CI (9 stages): Quality → Security → Tests → Build → Deploy
    ↓
DockerHub Registry
    ↓
CD (7 stages): Deploy → Health → DAST → Notify → Rollback
    ↓
Kubernetes (3 Pods + HPA + Service + Ingress)
```

## 🛡️ 5 SECURITY LAYERS
1. **SAST** - CodeQL scans code
2. **SCA** - npm audit checks dependencies
3. **Image** - Trivy scans containers
4. **DAST** - OWASP ZAP tests live app
5. **Runtime** - JWT, bcrypt, Helmet, rate limit

## 🎬 DEMO SEQUENCE (5 min)
1. GitHub → Show badges (green = passing)
2. Actions → Show CI/CD workflows
3. Coverage report → Show 91%
4. Code → Show src/ and k8s/
5. Deployment.yaml → 3 replicas, rolling update
6. HPA.yaml → Auto-scaling 3-10 pods

## 📦 TECH STACK
**App**: Node.js 18, Express | **Test**: Jest, Supertest
**CI/CD**: GitHub Actions | **Container**: Docker | **Orchestration**: K8s
**Security**: CodeQL, Trivy, ZAP, JWT

## 🔧 K8S RESOURCES (7)
Namespace → ConfigMap → Secrets → Deployment → Service → Ingress → HPA

## 💡 QUICK ANSWERS

**"Why CI/CD?"** Speed + Quality + Security + Consistency + Confidence

**"SAST vs DAST?"** SAST = code scan (before run) | DAST = app scan (while running)

**"Docker vs VM?"** Docker = lightweight, shared OS | VM = heavy, full OS

**"ConfigMap vs Secrets?"** ConfigMap = plain text config | Secrets = base64 sensitive data

**"Liveness vs Readiness?"** Liveness = restart if fail | Readiness = stop traffic if fail

**"Why 3 replicas?"** High availability, load balancing, zero downtime during updates

**"Multi-stage build?"** Builder (all deps) → Production (only needed) = smaller, secure image

## 🚨 IF STUCK
1. Relate to what you know
2. Show enthusiasm to learn
3. Offer to demonstrate related feature

## ✅ CONFIDENCE CHECKLIST
✅ Working code | ✅ Passing pipelines | ✅ 91% coverage
✅ Real security | ✅ Production-ready | ✅ Can demo live

## 🎤 OPENING LINE
"I built a Task Management API with enterprise-level CI/CD. 9 automated CI stages including security scanning and testing with 91% coverage. 7 CD stages deploying to Kubernetes with auto-scaling and zero-downtime updates. Using GitHub Actions, Docker, and K8s with comprehensive security."

## 📱 BEFORE ENTERING
✅ Deep breath × 3
✅ Remember key numbers
✅ Smile & be confident
✅ YOU KNOW THIS!

---

**IMPORTANT**: Be honest, be confident, be enthusiastic!

**YOU'VE GOT THIS! 💪**
