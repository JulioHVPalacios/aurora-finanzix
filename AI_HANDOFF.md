# 🧠 AI HANDOFF & MASTER SYSTEM DIRECTIVES

> **Protocolo de Continuidad para cualquier Agente de IA / Ingeniero / Sesión Futura**

## 1. Identidad y Contexto
- **Desarrollador Líder:** Julio Palacios (Vexor Systems).
- **Enfoque:** Construcción de software de nivel mundial, robusto, seguro, con diseño de lujo y costo operativo $0.
- **Aprendizaje:** El desarrollador está aprendiendo ingeniería de software. Explicar siempre el **porqué** de cada decisión de diseño, estructura de datos y seguridad.

## 2. Reglas Inquebrantables de Desarrollo
1. **Zero Secrets in Git:** NUNCA quemar contraseñas, keystores (`.keystore`, `.jks`), ni API keys privadas en el código fuente. Usar siempre `keystore.properties` (ignorado en `.gitignore`) o variables de entorno.
2. **Arquitectura No Destructiva:** No reescribir ni romper módulos funcionales sin un plan claro.
3. **Estándar de Calidad:** Siempre verificar que `npm run build` pase limpiamente antes de commitear.
4. **Sincronización Multiplataforma:** Toda modificación visual o lógica debe sincronizarse con Android vía `npx cap sync android` y mantener compatibilidad con PWA / Microsoft Store.
5. **Idioma y Localización:** 100% de los textos deben estar preparados para traducción bilingüe (`src/services/i18n.js`).

## 3. Estado de Módulos Críticos
- `src/services/fxService.js`: Motor de divisas en vivo con paridad Bloomberg/BCE.
- `src/components/EdgePanel.js`: Panel Edge lateral flotante con calculadora y conversor.
- `src/components/BudgetLimitModal.js`: Modal de límite mensual de gastos.
- `src/components/AppLockScreen.js`: Pantalla de bloqueo PIN Obsidian con candado físico animado y sincronización de barra de título.
- `android/app/build.gradle`: Android SDK 35 (Android 15), versionCode 4, versionName "1.0.26".
