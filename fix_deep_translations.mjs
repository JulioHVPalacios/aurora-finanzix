import fs from 'fs';

// --- 1. Fix MarketsView.js ---
let markets = fs.readFileSync('src/components/MarketsView.js', 'utf8');

markets = markets.replace(
  '<h2 style="font-size:1rem;font-weight:800;margin:0;color:var(--ink);">Criptomonedas',
  '<h2 style="font-size:1rem;font-weight:800;margin:0;color:var(--ink);">${t("market_crypto")}'
);
markets = markets.replace(
  'Activo <i data-lucide="chevrons-up-down"',
  '${t("market_asset")} <i data-lucide="chevrons-up-down"'
);
markets = markets.replace(
  'Precio <i data-lucide="chevrons-up-down"',
  '${t("market_price")} <i data-lucide="chevrons-up-down"'
);
markets = markets.replace(
  '24h % <i data-lucide="chevrons-up-down"',
  '${t("market_24h")} <i data-lucide="chevrons-up-down"'
);
markets = markets.replace(
  '<h2 style="font-size:1rem;font-weight:800;margin:0 0 10px 0;color:var(--ink);">Acciones Globales',
  '<h2 style="font-size:1rem;font-weight:800;margin:0 0 10px 0;color:var(--ink);">${t("market_stocks")}'
);

fs.writeFileSync('src/components/MarketsView.js', markets);

// --- 2. Fix BudgetsView.js (Categories Translation) ---
let budgets = fs.readFileSync('src/components/BudgetsView.js', 'utf8');
if (!budgets.includes('getCategoryName')) {
  budgets = budgets.replace(
    "import { formatCurrency, t } from '../services/i18n.js';",
    "import { formatCurrency, t, getCategoryName } from '../services/i18n.js';"
  );
}
// Replace ${cat.name} with ${getCategoryName(cat)} when displaying category names
budgets = budgets.replace(
  /<span style="font-weight: 700; font-size: 0.88rem; color: var\(--ink\);">\$\{cat\.name\}<\/span>/g,
  '<span style="font-weight: 700; font-size: 0.88rem; color: var(--ink);">${getCategoryName(cat)}</span>'
);
fs.writeFileSync('src/components/BudgetsView.js', budgets);

// --- 3. Optional: Quick fix for Sponsored Deals to be bilingual (if possible) ---
// Just translating the labels 'Patrocinado' -> t('sponsored') etc.
let sponsored = fs.readFileSync('src/components/SponsoredDealsCard.js', 'utf8');
if (!sponsored.includes("import { t }")) {
  sponsored = "import { t } from '../services/i18n.js';\n" + sponsored;
  sponsored = sponsored.replace("Patrocinado", "${t('sponsored') || 'Patrocinado'}");
  fs.writeFileSync('src/components/SponsoredDealsCard.js', sponsored);
}

// Add 'sponsored' to i18n
let i18n = fs.readFileSync('src/services/i18n.js', 'utf8');
if (!i18n.includes('sponsored: "Sponsored"')) {
  i18n = i18n.replace('panel_reset: "Reiniciar App",', 'panel_reset: "Reiniciar App",\nsponsored: "Patrocinado",');
  i18n = i18n.replace('panel_reset: "Reset App",', 'panel_reset: "Reset App",\nsponsored: "Sponsored",');
  fs.writeFileSync('src/services/i18n.js', i18n);
}

console.log("Deep structural translations fixed.");
