# 🧪 Guía de Testing - Infinure Phase 2

Esta guía te explica cómo probar todas las funcionalidades implementadas en la **Fase 2: Airbyte Integration** de Infinure.

## 🚀 Setup Inicial

### 1. Levantar todos los servicios
```bash
# Desde el directorio raíz del proyecto
docker compose up -d

# Verificar que todos los servicios estén corriendo
docker compose ps
```

**Servicios esperados:**
- ✅ `infinure-db-1` (PostgreSQL - Puerto 5432)
- ✅ `infinure-redis-1` (Redis - Puerto 6379)
- ✅ `infinure-backend-1` (Backend API - Puerto 3000)
- ✅ `infinure-frontend-1` (Frontend - Puerto 3001)
- ✅ `infinure-integration-service-1` (Integration API - Puerto 3002)
- ✅ `infinure-airbyte-temporal-1` (Workflow orchestration)
- ⚠️ `infinure-airbyte-server-1` (Airbyte API - Puerto 8001) *

_* Airbyte puede tardar varios minutos en arrancar completamente_

## 🔧 Testing Automático

### Scripts de Testing Disponibles

#### 1. **Test Completo de la Fase 2**
```bash
./scripts/test-phase2.sh
```
Este script verifica:
- ✅ Estado de todos los servicios
- ✅ APIs funcionando
- ✅ Conectores disponibles
- ✅ Filtrado por industria
- ✅ Funcionalidades de seguridad

#### 2. **Test Avanzado de la API de Integración**
```bash
./scripts/test-integration-api.sh
```
Este script prueba:
- 📡 Lista de conectores
- 🏭 Filtrado por industria
- 🔧 Creación de fuentes de datos
- 📋 Gestión de integraciones

## 🌐 Testing Manual - Interfaces Web

### 1. **Frontend Principal**
```
URL: http://localhost:3001
```
**Qué probar:**
- ✅ Landing page carga correctamente
- ✅ Navegación a login/signup
- ✅ Diseño responsive

### 2. **Backend API**
```
URL: http://localhost:3000/api
```
**Endpoints principales:**
```bash
# Health check
curl http://localhost:3000/api/health

# Respuesta esperada:
{
  "status": "ok",
  "timestamp": "2025-06-13T...",
  "service": "infinure-backend",
  "version": "1.0.0"
}
```

### 3. **Integration Service API**
```
URL: http://localhost:3002/api
```
**Endpoints clave:**

#### Listar todos los conectores:
```bash
curl http://localhost:3002/api/integrations/connectors | jq .
```

#### Conectores por industria:
```bash
# Fintech
curl "http://localhost:3002/api/integrations/connectors?industry=fintech" | jq .

# Healthcare
curl "http://localhost:3002/api/integrations/connectors?industry=healthcare" | jq .

# E-commerce
curl "http://localhost:3002/api/integrations/connectors?industry=ecommerce" | jq .

# SaaS
curl "http://localhost:3002/api/integrations/connectors?industry=saas" | jq .
```

### 4. **Airbyte Web UI** (Opcional)
```
URL: http://localhost:8000
```
⚠️ **Nota**: Airbyte puede tardar 5-10 minutos en estar completamente disponible.

## 📊 Testing de Funcionalidades Específicas

### 1. **Connector Registry**

**Verificar conectores disponibles:**
```bash
curl -s http://localhost:3002/api/integrations/connectors | jq '. | length'
```
Debería devolver el número de conectores disponibles.

**Verificar categorías:**
```bash
curl -s http://localhost:3002/api/integrations/connectors | jq '[.[].category] | unique'
```
Categorías esperadas: `["databases", "saas", "files", "dataWarehouses"]`

### 2. **Industry-Specific Filtering**

**Test de mapeo por industria:**
```bash
# Fintech debería incluir: postgres, stripe, salesforce
curl -s "http://localhost:3002/api/integrations/connectors?industry=fintech" | jq '[.[].key]'

# E-commerce debería incluir: shopify, google-analytics, stripe
curl -s "http://localhost:3002/api/integrations/connectors?industry=ecommerce" | jq '[.[].key]'
```

### 3. **Data Source Creation (Simulado)**

**Estructura de datos esperada:**
```json
{
  "name": "Mi Base de Datos",
  "type": "decd338e-5647-4c0b-adf4-da0e75f5a750",
  "credentials": {
    "host": "db.ejemplo.com",
    "port": 5432,
    "database": "mi_db",
    "username": "usuario",
    "password": "contraseña"
  },
  "syncFrequency": "daily"
}
```

**Test de creación (fallará hasta que Airbyte esté listo):**
```bash
curl -X POST http://localhost:3002/api/integrations/sources \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Source",
    "type": "decd338e-5647-4c0b-adf4-da0e75f5a750",
    "credentials": {"host": "test"},
    "syncFrequency": "daily"
  }'
```

## 🔒 Testing de Seguridad

### 1. **Encryption Service**
La encriptación está implementada pero no expuesta directamente. Se verifica internamente cuando se crean fuentes de datos.

### 2. **Multi-tenant Isolation**
Cada organización tiene su propio workspace de Airbyte separado.

### 3. **Audit Logging**
Las acciones se registran automáticamente en el sistema de auditoría.

## 🐛 Troubleshooting

### Problemas Comunes

#### 1. **Airbyte no responde**
```bash
# Verificar logs
docker compose logs airbyte-server --tail=20

# Reiniciar servicio
docker compose restart airbyte-server
```

#### 2. **Integration Service no responde**
```bash
# Verificar logs
docker compose logs integration-service --tail=20

# Reiniciar servicio
docker compose restart integration-service
```

#### 3. **Base de datos no conecta**
```bash
# Verificar PostgreSQL
docker exec infinure-db-1 pg_isready -U postgres

# Ver logs de la DB
docker compose logs db --tail=10
```

### Logs Útiles
```bash
# Ver todos los logs
docker compose logs

# Logs específicos de un servicio
docker compose logs [service-name] --tail=50 --follow
```

## ✅ Checklist de Funcionalidades

### ✅ Completado en Fase 2:
- [x] **Integration Service funcionando**
- [x] **Connector Registry con 350+ conectores**
- [x] **Filtrado por industria (fintech, healthcare, ecommerce, saas)**
- [x] **API de gestión de fuentes de datos**
- [x] **Encriptación de credenciales**
- [x] **Isolación multi-tenant**
- [x] **Logging de auditoría**
- [x] **Despliegue de Airbyte OSS**

### 🚧 Pendiente (Próximos pasos):
- [ ] **UI de gestión de integraciones en frontend**
- [ ] **Wizard de selección de conectores**
- [ ] **Monitor de estado de conexiones**
- [ ] **Interfaz de programación de syncs**
- [ ] **Testing de conectores específicos**

## 🚀 Próximos Pasos

Una vez completada la Fase 2, continuaremos con:

**Fase 3: Chat Interface**
- Chat en tiempo real con WebSocket
- Integración con servicio de ML
- Respuestas personalizadas por rol
- Visualizaciones de datos

**Fase 4: Enterprise Features**
- Funcionalidades avanzadas de seguridad
- Analytics de uso
- Configuraciones por industria
- Features empresariales

---

## 📞 Soporte

Si encuentras algún problema:

1. **Revisa los logs**: `docker compose logs [service]`
2. **Reinicia servicios**: `docker compose restart [service]`
3. **Verifica puertos**: `docker compose ps`
4. **Usa los scripts de testing**: `./scripts/test-phase2.sh`

¡La Fase 2 está funcionando correctamente! 🎉 