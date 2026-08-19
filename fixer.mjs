import fs from 'fs';
import path from 'path';

// 1. Fix Dashboard Budget (2500 issue)
let dash = fs.readFileSync('src/components/DashboardView.js', 'utf8');
dash = dash.replace('const monthlyBudget = settings.monthlyBudget || 2500;', 'const monthlyBudget = settings.monthlyBudget || 0;');
fs.writeFileSync('src/components/DashboardView.js', dash);

// 2. Fix i18n keys
let i18n = fs.readFileSync('src/services/i18n.js', 'utf8');
const esKeys = `
    // Markets & Services added
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
    sub_add: "Añadir Pago",
    sub_catalog: "Catálogo",
    sub_search: "Buscar servicio...",
    sub_name: "Nombre del Servicio",
    sub_cost: "Costo",
    sub_freq: "Frecuencia",
    sub_monthly: "Mensual",
    sub_annual: "Anual",
    sub_save: "Guardar Cambios",
    panel_budget: "Definir Presupuesto",
`;
const enKeys = `
    // Markets & Services added
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
    sub_add: "Add Payment",
    sub_catalog: "Catalog",
    sub_search: "Search service...",
    sub_name: "Service Name",
    sub_cost: "Cost",
    sub_freq: "Frequency",
    sub_monthly: "Monthly",
    sub_annual: "Annual",
    sub_save: "Save Changes",
    panel_budget: "Set Budget",
`;
i18n = i18n.replace('more_title: "Panel de Control",', 'more_title: "Panel de Control",' + esKeys);
i18n = i18n.replace('more_title: "Control Panel",', 'more_title: "Control Panel",' + enKeys);
fs.writeFileSync('src/services/i18n.js', i18n);

// 3. Update MarketsView.js
let markets = fs.readFileSync('src/components/MarketsView.js', 'utf8');
if (!markets.includes("import { t }")) {
  markets = markets.replace("import { createIcons", "import { t } from '../services/i18n.js';\nimport { createIcons");
}
markets = markets.replace(/Cargando Mercados Globales.../g, '${t("market_loading")}');
markets = markets.replace(/>Mercados</g, '>${t("nav_markets")}<');
markets = markets.replace(/Conectando.../g, '${t("market_connecting")}');
markets = markets.replace(/Criptomonedas Top 100/g, '${t("market_crypto")}');
markets = markets.replace(/Buscar por nombre o símbolo.../g, '${t("market_search")}');
markets = markets.replace(/>Activo</g, '>${t("market_asset")}<');
markets = markets.replace(/>Precio</g, '>${t("market_price")}<');
markets = markets.replace(/>24h %</g, '>${t("market_24h")}<');
fs.writeFileSync('src/components/MarketsView.js', markets);

console.log("Fixes applied successfully.");
