import fs from 'fs';

// --- 1. Fix BottomNav.js ---
let bottomNav = fs.readFileSync('src/components/BottomNav.js', 'utf8');
bottomNav = bottomNav.replace('<span>Mercados</span>', '<span>${t("nav_markets")}</span>');
fs.writeFileSync('src/components/BottomNav.js', bottomNav);

// --- 2. Fix Navbar.js (Control Panel Dropdown) ---
let navbar = fs.readFileSync('src/components/Navbar.js', 'utf8');

// Replace "Editar Perfil"
navbar = navbar.replace(
  '<div style="font-size: 0.9rem;">Editar Perfil</div>',
  '<div style="font-size: 0.9rem;">${t("panel_title")}</div>'
);
navbar = navbar.replace(
  '<div style="font-size: 0.72rem; color: var(--ink-60); font-weight: 500;">Cambiar nombre, ciudad y datos personales</div>',
  '<div style="font-size: 0.72rem; color: var(--ink-60); font-weight: 500;">${t("panel_edit_desc")}</div>'
);

// Replace "Política de Privacidad"
navbar = navbar.replace(
  '<div style="font-size: 0.9rem;">Política de Privacidad</div>',
  '<div style="font-size: 0.9rem;">${t("panel_privacy")}</div>'
);
navbar = navbar.replace(
  '<div style="font-size: 0.72rem; color: var(--ink-60); font-weight: 500;">Almacenamiento 100% local y seguro</div>',
  '<div style="font-size: 0.72rem; color: var(--ink-60); font-weight: 500;">${t("panel_privacy_desc")}</div>'
);

// Replace "Reiniciar App"
navbar = navbar.replace(
  '<div style="font-size: 0.9rem; color: #DC2626;">Reiniciar App</div>',
  '<div style="font-size: 0.9rem; color: #DC2626;">${t("panel_reset")}</div>'
);
navbar = navbar.replace(
  '<div style="font-size: 0.72rem; color: #F87171; font-weight: 500;">Borrar todos los datos y volver al inicio</div>',
  '<div style="font-size: 0.72rem; color: #F87171; font-weight: 500;">${t("panel_reset_desc")}</div>'
);
fs.writeFileSync('src/components/Navbar.js', navbar);

// --- 3. Fix i18n.js keys for these new options ---
let i18n = fs.readFileSync('src/services/i18n.js', 'utf8');

const esKeys = `
    panel_edit_desc: "Cambiar nombre, ciudad y datos",
    panel_privacy: "Política de Privacidad",
    panel_privacy_desc: "Almacenamiento 100% local y seguro",
    panel_reset: "Reiniciar App",
    panel_reset_desc: "Borrar todos los datos y empezar de cero",
`;

const enKeys = `
    panel_edit_desc: "Change name, city and details",
    panel_privacy: "Privacy Policy",
    panel_privacy_desc: "100% local and secure storage",
    panel_reset: "Reset App",
    panel_reset_desc: "Erase all data and start over",
`;

// Insert the new keys after panel_bio
if (!i18n.includes('panel_reset_desc')) {
  i18n = i18n.replace('panel_bio: "Usar Huella / Face ID",', 'panel_bio: "Usar Huella / Face ID",\n' + esKeys);
  i18n = i18n.replace('panel_bio: "Use Fingerprint / Face ID",', 'panel_bio: "Use Fingerprint / Face ID",\n' + enKeys);
  fs.writeFileSync('src/services/i18n.js', i18n);
}

console.log("Navbar and BottomNav translations fixed.");
