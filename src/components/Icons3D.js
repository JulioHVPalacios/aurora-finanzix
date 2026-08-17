/* ==========================================================================
   FINANZIX PRO - 3D REALISTIC TACTILE SVG ICONS & ASSETS
   Rendered with Multi-Stop Gradients, Specular Bevels & Depth Layers
   ========================================================================== */

export const ICONS_3D = {
  // 3D Gold EMV Microchip
  chip: `
    <svg width="34" height="26" viewBox="0 0 34 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="chipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDE68A"/>
          <stop offset="35%" stop-color="#F59E0B"/>
          <stop offset="70%" stop-color="#D97706"/>
          <stop offset="100%" stop-color="#78350F"/>
        </linearGradient>
      </defs>
      <rect width="34" height="26" rx="5" fill="url(#chipGrad)" stroke="rgba(255,255,255,0.4)" stroke-width="0.8"/>
      <path d="M0 9H12M0 17H12M22 9H34M22 17H34M12 9V17M22 9V17M12 13H22" stroke="#78350F" stroke-width="1.2" stroke-linecap="round"/>
      <rect x="13" y="10" width="8" height="6" rx="2" fill="#FDE68A" opacity="0.6"/>
    </svg>
  `,

  // 3D Emerald Coin (Ingreso)
  incomeCoin: `
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="coinEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6EE7B7"/>
          <stop offset="40%" stop-color="#10B981"/>
          <stop offset="100%" stop-color="#047857"/>
        </linearGradient>
        <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#10B981" flood-opacity="0.4"/>
        </filter>
      </defs>
      <circle cx="22" cy="22" r="19" fill="url(#coinEmerald)" filter="url(#emeraldGlow)"/>
      <circle cx="22" cy="22" r="16.5" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1.5" stroke-dasharray="3 2"/>
      <path d="M22 13V31M17 19L22 14L27 19" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="22" cy="22" r="19" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1"/>
    </svg>
  `,

  // 3D Ruby Sphere (Gasto)
  expenseCoin: `
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="coinRuby" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDA4AF"/>
          <stop offset="40%" stop-color="#F43F5E"/>
          <stop offset="100%" stop-color="#BE123C"/>
        </linearGradient>
        <filter id="rubyGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#F43F5E" flood-opacity="0.4"/>
        </filter>
      </defs>
      <circle cx="22" cy="22" r="19" fill="url(#coinRuby)" filter="url(#rubyGlow)"/>
      <circle cx="22" cy="22" r="16.5" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1.5" stroke-dasharray="3 2"/>
      <path d="M22 31V13M17 25L22 30L27 25" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="22" cy="22" r="19" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1"/>
    </svg>
  `,

  // 3D Calculator (Costos)
  calc3D: `
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="calcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1E293B"/>
          <stop offset="100%" stop-color="#0F172A"/>
        </linearGradient>
        <linearGradient id="amberAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDE68A"/>
          <stop offset="100%" stop-color="#F59E0B"/>
        </linearGradient>
      </defs>
      <rect x="5" y="4" width="30" height="32" rx="8" fill="url(#calcGrad)" stroke="rgba(255,255,255,0.15)"/>
      <rect x="9" y="8" width="22" height="7" rx="3" fill="#020617" stroke="rgba(245,158,11,0.4)"/>
      <circle cx="12" cy="20" r="2.2" fill="#64748B"/>
      <circle cx="20" cy="20" r="2.2" fill="#64748B"/>
      <circle cx="28" cy="20" r="2.2" fill="url(#amberAccent)"/>
      <circle cx="12" cy="26" r="2.2" fill="#64748B"/>
      <circle cx="20" cy="26" r="2.2" fill="#64748B"/>
      <circle cx="28" cy="26" r="2.2" fill="url(#amberAccent)"/>
      <rect x="10" y="30" width="12" height="3" rx="1.5" fill="#64748B"/>
      <circle cx="28" cy="31.5" r="2.2" fill="#10B981"/>
    </svg>
  `,

  // 3D Target Bullseye (Metas)
  target3D: `
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="17" fill="#1E293B" stroke="rgba(14,165,233,0.4)" stroke-width="2"/>
      <circle cx="20" cy="20" r="12" fill="#0F172A" stroke="rgba(14,165,233,0.7)" stroke-width="2"/>
      <circle cx="20" cy="20" r="7" fill="#0EA5E9"/>
      <circle cx="20" cy="20" r="3" fill="#FFFFFF"/>
      <path d="M26 14L34 6M34 6H29M34 6V11" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // Contactless RFID Waves
  contactless: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.5 7.5C10.5 9.5 10.5 14.5 8.5 16.5M12.5 5C15.5 8 15.5 16 12.5 19M16.5 2.5C20.5 6.5 20.5 17.5 16.5 21.5" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `
};
