# AURORA FINANZIX (VALO OS) - MEMORIA MAESTRA DEL PROYECTO

> **Documento de Contexto Universal para el Asistente AI (Antigravity)**
> Este archivo sirve para que cualquier cuenta o sesión de AI comprenda inmediatamente el estado exacto del proyecto, su arquitectura y los pendientes sin perder continuidad.

---

## 📌 1. Información General del Proyecto
* **Nombre de la App:** Aurora Finanzix (VALO - Control de Gastos y Finanzas)
* **Marca Desarrolladora:** Vexor Systems
* **Desarrollador Principal:** Julio Humberto Vera Palacios
* **Ubicación Local del Proyecto:** `D:\Descargas\Aplicativo para calcular gastos`
* **Repositorio GitHub:** `https://github.com/JulioHVPalacios/aurora-finanzix`
* **Producción Web / Vercel:** Conectado a la rama `main` con despliegue automático.
* **Versión de Service Worker (PWA):** `v39` (en `public/sw.js`).

---

## 🏗️ 2. Stack Tecnológico & Arquitectura
* **Frontend:** Vanilla JavaScript (ES Modules), HTML5, CSS3 Glassmorphic / Design Tokens.
* **Empaquetador:** Vite v6.
* **Motor Nativo Android:** Capacitor v6 con Gradle y Java 17.
* **Streaming de Mercados en Tiempo Real:** 
  * Criptomonedas: Binance WebSocket Combined Streams (`wss://stream.binance.com:9443/stream?streams=...`) para los Top 100 pares USDT con caché O(1) en el DOM (`rowsMap`) y logos de CoinCap CDN.
  * Acciones / Globales: TradingView Market Quotes Widget integrado mediante `iframe` con `srcdoc`.
* **Seguridad y Persistencia:** LocalStorage encriptado/estructurado (`src/services/storage.js`), soporte biométrico con WebAuthn/FaceID/Huella (`src/services/biometrics.js`).
* **Internacionalización:** Módulo `i18n.js` con soporte multi-moneda (S/, $, €, etc.) y multi-idioma.

---

## 🚀 3. Estado de Publicación en Tiendas (Distribution Radar)

### 🟢 Google Play Store (En Proceso Activo)
* **Cuenta Creada:** Cuenta de desarrollador individual como **Vexor Systems**.
* **Estado Actual:** Google está verificando el documento de identidad (DNI). Luego se validará el teléfono por SMS para habilitar el botón "Crear app".
* **Paquete de Producción:** Archivo firmado `.aab` generado y listo en:
  `D:\Descargas\Aplicativo para calcular gastos\AuroraFinanzix_v1.0.aab`
* **Keystore de Firma:** `android/app/release.keystore` (Alias: `vexorsystems`, Pass: `vexorsystems`).

### 🟢 Microsoft Store (Windows PC)
* **Estado:** En fase de **Certificación** en Microsoft Partner Center para la aplicación "VALO OS - Finanzas Personales".

### 🟢 Uptodown
* **Estado:** Archivo APK subido y en estado **"Pending review"**.

### 🟡 Samsung Galaxy Store & Xiaomi GetApps
* **Estado:** Piden Ficha RUC con actividad económica comercial / software para validar cuenta comercial. Se decidió priorizar Google Play, Microsoft y Uptodown primero.

---

## 🎨 4. Últimos Cambios Visuales y de UX (Sesión Reciente)
1. **Botón Central Flotante (`+`):** Rediseñado con estilo ultra-premium **Obsidiana Satinada & Titanio** inspirado en Revolut y Apple Wallet, con anillo de porcelana blanca de 4px, reflejo de cúpula de cristal y sombra ambiental índigo.
2. **Modal de Suscripciones / Pagos Fijos:**
   * Corregido el solapamiento vertical de las píldoras de categorías ("Streaming & Video", "Servicios Básicos", etc.) dándoles altura fija de 36px y evitando la compresión flex.
   * Implementado gesto táctil completo **Swipe-to-Dismiss** (deslizar hacia abajo con el dedo para cerrar el modal suavemente).
3. **Optimización de Caché PWA:** Bump a versión `v39` en `public/sw.js`.

---

## 🛠️ 5. Guía Rápida para el Asistente AI que lea este archivo
Si estás leyendo esto en una nueva sesión o cuenta de Antigravity:
1. Tu entorno de trabajo es `D:\Descargas\Aplicativo para calcular gastos`.
2. Para compilar cambios web: `npm.cmd run build`.
3. Para sincronizar con Android: `npx.cmd cap copy android`.
4. Para generar el paquete firmado de Google Play: `.\gradlew.bat bundleRelease` dentro de la carpeta `android`.
5. Para publicar en Vercel: `git add . ; git commit -m "..." ; git push origin main`.
6. Recuerda siempre incrementar `CACHE_VERSION` en `public/sw.js` tras modificar archivos visuales.
