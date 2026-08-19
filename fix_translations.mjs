import fs from 'fs';

// --- 1. Fix i18n.js ---
let i18n = fs.readFileSync('src/services/i18n.js', 'utf8');

const esKeys = `
    // Extra Markets & Profile
    nav_markets: "Mercados",
    market_loading: "Cargando Mercados...",
    market_connecting: "Conectando...",
    market_crypto: "Criptomonedas",
    market_search: "Buscar...",
    market_asset: "Activo",
    market_price: "Precio",
    market_24h: "24h %",
    market_stocks: "Acciones",
    market_live: "En vivo",
    market_reconnecting: "Reconectando...",
    sub_edit: "Editar Pago",
    sub_add: "Añadir Pago / Servicio",
    sub_catalog: "Catálogo",
    sub_search_ph: "Buscar servicio...",
    sub_name: "Nombre del Servicio",
    sub_cost: "Costo por Periodo",
    sub_freq: "Frecuencia de Cobro",
    sub_monthly: "Mensual",
    sub_annual: "Anual",
    sub_save: "Guardar Cambios",
    sub_add_btn: "+ Añadir Servicio",
    sub_weekly: "Semanal",
    sub_biweekly: "Quincenal",
    sub_day: "Día de Cobro (1-31)",
    sub_pm: "Método de Pago",
    sub_not_found: "No se encontraron servicios",
    panel_title: "Editar Perfil",
    panel_first: "Primer Nombre",
    panel_last: "Apellidos",
    panel_country: "País",
    panel_city: "Ciudad",
    panel_email: "Correo",
    panel_budget: "Presupuesto Mensual",
    panel_bio: "Usar Huella / Face ID",
`;

const enKeys = `
    // Extra Markets & Profile
    nav_markets: "Markets",
    market_loading: "Loading Markets...",
    market_connecting: "Connecting...",
    market_crypto: "Cryptocurrencies",
    market_search: "Search...",
    market_asset: "Asset",
    market_price: "Price",
    market_24h: "24h %",
    market_stocks: "Stocks",
    market_live: "Live",
    market_reconnecting: "Reconnecting...",
    sub_edit: "Edit Payment",
    sub_add: "Add Payment / Service",
    sub_catalog: "Catalog",
    sub_search_ph: "Search service...",
    sub_name: "Service Name",
    sub_cost: "Cost per Period",
    sub_freq: "Billing Frequency",
    sub_monthly: "Monthly",
    sub_annual: "Annual",
    sub_save: "Save Changes",
    sub_add_btn: "+ Add Service",
    sub_weekly: "Weekly",
    sub_biweekly: "Biweekly",
    sub_day: "Billing Day (1-31)",
    sub_pm: "Payment Method",
    sub_not_found: "No services found",
    panel_title: "Edit Profile",
    panel_first: "First Name",
    panel_last: "Last Name",
    panel_country: "Country",
    panel_city: "City",
    panel_email: "Email",
    panel_budget: "Monthly Budget",
    panel_bio: "Use Fingerprint / Face ID",
`;

if (!i18n.includes('market_loading: "Loading')) {
  i18n = i18n.replace('more_title: "Panel de Control",', 'more_title: "Panel de Control",' + esKeys);
  i18n = i18n.replace('more_title: "Control Center",', 'more_title: "Control Center",' + enKeys);
  fs.writeFileSync('src/services/i18n.js', i18n);
}

// --- 2. Fix UserProfileModal.js ---
let userProfile = fs.readFileSync('src/components/UserProfileModal.js', 'utf8');
if (!userProfile.includes("prof-budget")) {
    userProfile = userProfile.replace(
        '<label class="form-label">Primer Nombre</label>',
        '<label class="form-label">${t("panel_first")}</label>'
    );
    userProfile = userProfile.replace(
        '<label class="form-label">Apellidos</label>',
        '<label class="form-label">${t("panel_last")}</label>'
    );
    userProfile = userProfile.replace(
        '<label class="form-label">País</label>',
        '<label class="form-label">${t("panel_country")}</label>'
    );
    userProfile = userProfile.replace(
        '<label class="form-label">Ciudad</label>',
        '<label class="form-label">${t("panel_city")}</label>'
    );
    userProfile = userProfile.replace(
        '<label class="form-label">Correo (Opcional)</label>',
        '<label class="form-label">${t("panel_email")} (Opcional)</label>'
    );
    userProfile = userProfile.replace(
        '<h3 class="sheet-title">Editar Perfil</h3>',
        '<h3 class="sheet-title">${t("panel_title")}</h3>'
    );
    
    // Add Budget Field
    const budgetField = `
        <div class="form-group">
          <label class="form-label">\${t("panel_budget")}</label>
          <input type="number" id="prof-budget" class="input-control" value="\${settings.monthlyBudget || 0}" />
        </div>
    `;
    userProfile = userProfile.replace('<!-- Country first', budgetField + '\n          <!-- Country first');
    
    // Save budget in submit handler
    userProfile = userProfile.replace(
        'const email   = overlay.querySelector(\'#prof-email\').value.trim();',
        'const email   = overlay.querySelector(\'#prof-email\').value.trim();\n      const monthlyBudget = Number(overlay.querySelector(\'#prof-budget\').value) || 0;'
    );
    userProfile = userProfile.replace(
        'userEmail: email',
        'userEmail: email,\n        monthlyBudget: monthlyBudget'
    );
    
    fs.writeFileSync('src/components/UserProfileModal.js', userProfile);
}

// --- 3. Fix SubscriptionModal.js ---
let subModal = fs.readFileSync('src/components/SubscriptionModal.js', 'utf8');
if (!subModal.includes("${t('sub_edit')}")) {
    // Inject t if missing
    if (!subModal.includes("import { t }")) {
        subModal = subModal.replace("import { createIcons, icons } from 'lucide';", "import { createIcons, icons } from 'lucide';\nimport { t } from '../services/i18n.js';");
    }
    subModal = subModal.replace(/Editar Pago Fijo/g, "${t('sub_edit')}");
    subModal = subModal.replace(/Añadir Servicio \/ Pago Fijo/g, "${t('sub_add')}");
    subModal = subModal.replace(/Catálogo para/g, "${t('sub_catalog')} para");
    subModal = subModal.replace(/Buscar servicio\.\.\./g, "${t('sub_search_ph')}");
    subModal = subModal.replace(/Empresas & Servicios/g, "${t('sub_catalog')}");
    subModal = subModal.replace(/No se encontraron servicios\.\.\./g, "${t('sub_not_found')}");
    subModal = subModal.replace(/Nombre del Servicio \/ Empresa/g, "${t('sub_name')}");
    subModal = subModal.replace(/Costo por Periodo/g, "${t('sub_cost')}");
    subModal = subModal.replace(/Frecuencia de Cobro/g, "${t('sub_freq')}");
    subModal = subModal.replace(/>Mensual</g, ">${t('sub_monthly')}<");
    subModal = subModal.replace(/>Anual</g, ">${t('sub_annual')}<");
    subModal = subModal.replace(/>Semanal</g, ">${t('sub_weekly')}<");
    subModal = subModal.replace(/>Quincenal</g, ">${t('sub_biweekly')}<");
    subModal = subModal.replace(/Día de Cobro \(1-31\)/g, "${t('sub_day')}");
    subModal = subModal.replace(/Método de Pago Vinculado/g, "${t('sub_pm')}");
    subModal = subModal.replace(/Guardar Cambios/g, "${t('sub_save')}");
    subModal = subModal.replace(/\+ Añadir a Pagos Fijos/g, "${t('sub_add_btn')}");
    fs.writeFileSync('src/components/SubscriptionModal.js', subModal);
}

// --- 4. Enforce re-render on data-changed in main.js for all views ---
// `main.js` re-renders but we should make sure modals are aware. Actually modals are re-opened when clicked, 
// so if the user switches language, the next time they open the modal it'll be in the correct language.

console.log("Deep translations fixed.");
