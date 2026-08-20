# 🚀 VALO OS — Estado Maestro del Proyecto & Handoff de Continuidad

> **Documento de Memoria y Continuidad para Agentes de IA y Sesiones Futuras**  
> **Última actualización:** 20 de Agosto, 2026  
> **Desarrollador / Empresa:** Julio Palacios (Vexor Systems)  
> **Repositorio Principal:** `https://github.com/JulioHVPalacios/aurora-finanzix.git` (Rama `main`)  
> **Package ID:** `com.valo.app` | **Versión Actual:** `1.0.26` (Build Code 4 / Android SDK 35)

---

## 🏛️ 1. Protocolo de Ingeniería Profesional (Estándar de Élite)

Para cualquier sesión futura, agente de IA o cambio de cuenta, se deben seguir estrictamente estas reglas fundamentales:

1. **Flujo de Trabajo Estructurado (Cero Costo / 100% Gratis):**
   * **Requisito / Especificación:** Comprender el problema antes de escribir código.
   * **Seguridad Primero (OWASP):** Cero secretos, API keys o contraseñas en Git. Uso exclusivo de `keystore.properties` y variables de entorno.
   * **Ramas y Commits Convencionales:** Trabajar en ramas `feat/...` o `fix/...` y fusionar mediante PRs con mensajes claros (`feat(modulo): descripcion`).
   * **Quality Gate:** Todo cambio debe compilar con `npm run build` y sincronizarse con `npx cap sync android` sin errores.
2. **Filosofía de Aprendizaje:**
   * El usuario (Julio) está aprendiendo ingeniería de software paso a paso. Cada cambio debe explicarse con claridad didáctica, justificando el porqué técnico.

---

## 📌 2. Estado de Despliegues y Tiendas

| Tienda / Plataforma | Estado Actual | Detalles Técnicos |
| :--- | :--- | :--- |
| **Microsoft Store (Windows)** | 🟢 **PUBLICADA & ACTIVA** | Disponible en la Microsoft Store para Windows 10/11 como PWA/MSIX con soporte de Window Controls Overlay. |
| **Google Play Store (Android)** | 🟢 **Prueba Cerrada (SDK 35)** | Versión `1.0.26` (Code 4) con `targetSdkVersion = 35` (Android 15). Contador actual: 3/12 testers. Meta: 12 testers durante 14 días para producción. |
| **Web / PWA (Vercel)** | 🟢 **100% Activo** | Desplegado en `https://aurora-finanzix.vercel.app/` sincronizado con GitHub `main`. |
| **Uptodown (Android)** | 🟡 **En Revisión** | APK enviado en estado editorial. |

---

## 🛠️ 3. Arquitectura y Módulos Clave de VALO OS

* **Core Engine:** Vanilla JavaScript ES Modules + Vite 6 + CSS3 Custom Properties.
* **Motor de Divisas en Tiempo Real (`src/services/fxService.js`):**
  * Cotización Spot de alta frecuencia (Bloomberg / Banco Central Europeo / Google Match) para 11+ divisas con failover triple.
* **Panel Edge Flotante (`src/components/EdgePanel.js`):**
  * Desplegable global lateral con calculadora financiera y conversor de divisas.
* **Presupuesto Mensual (`src/components/BudgetLimitModal.js`):**
  * Modal interactivo de fijación de límites y cálculo de ritmo de gasto diario.
* **Pantalla de Bloqueo PIN (`src/components/AppLockScreen.js`):**
  * Fondo Obsidian Glass, sincronización de la barra de título de Windows, insignia de seguridad con apertura física animada y zoom cinemático.
* **Seguridad Android (`android/app/build.gradle` & `android/keystore.properties`):**
  * Keystore desacoplado de Git. Credenciales cargadas localmente mediante `keystore.properties`.
* **Notificaciones Push (`api/push-send.js` & `api/push-subscribe.js`):**
  * Funciones Serverless de Vercel protegidas con `PUSH_ADMIN_TOKEN` y VAPID.

---

## 📂 4. Mapa Maestro de Repositorios en GitHub (`JulioHVPalacios`)

1. **`aurora-finanzix` (VALO OS):** 🟢 Repositorio principal de finanzas personales.
2. **`roadmap-maestro-computacion` (Campus Maestro):** 🟢 Repositorio educativo con TypeScript, ESLint y CI/CD.
3. **`julio-premium-landing`:** 🟢 Portafolio y hub personal.
4. **`VEXOR-ITSM`:** 🟡 Repositorio archivado como evidencia histórica/académica.
5. **`vexor-blueprint`:** 🔒 Repositorio privado de planificación.
6. **`register`:** 🔴 Fork auxiliar temporal de `is-a.dev` pendiente de eliminación en Settings.

---

## 🎯 5. Hoja de Ruta Inmediata

1. **Google Play:** Invitar a 9 verificadores adicionales (total 12) durante 14 días para solicitar acceso a producción.
2. **Compilación de AAB:** Ejecutar `cmd /c npm run build ; npx cap sync android` y compilar en Android Studio o Gradle cuando se requiera subir un nuevo bundle.
3. **Continuidad:** Ante cualquier cambio de cuenta o sesión, leer este archivo para retomar con 100% de precisión y contexto.
