# Infinure Monorepo

Plataforma SaaS de análisis conversacional de datos para empresas.

## Estructura del Monorepo

- `backend/` — Microservicios NestJS (auth, chat, integración, analytics)
- `frontend/` — Frontend Next.js 14 (dashboard, chat, integraciones)
- `integration-service/` — Servicio de gestión de Airbyte y conectores
- `k8s/` — Manifiestos de Kubernetes para despliegue
- `scripts/` — Scripts de migración, utilidades y setup

## Objetivo

Permitir a usuarios empresariales conectar sus fuentes de datos, chatear con sus datos y obtener insights personalizados según rol e industria, con seguridad y cumplimiento enterprise.

## 🚀 Quickstart (Phase 1 MVP)

Pre-requisitos: Docker + Docker Compose.

```bash
# Levantar stack completo (Postgres + Backend NestJS + Frontend Next.js)
docker-compose up --build
```

• Backend disponible en http://localhost:3000/api  
• Frontend disponible en http://localhost:3001  

1. Ve a http://localhost:3001/signup para crear tu primera organización y usuario.  
2. Inicia sesión en http://localhost:3001/login y serás redirigido al Dashboard.

La autenticación usa JWT almacenado en `localStorage` y se envía automáticamente en cada petición gracias al helper `lib/api.ts`.

> Esta es una versión mínima funcional que cubre la Fase 1 (infraestructura core). A partir de aquí se pueden añadir MFA, Redis cache, paginación, validaciones avanzadas, etc.

---

Para detalles técnicos completos, ver `infinure_tech_spec.md`. 