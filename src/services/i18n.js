/* ==========================================================================
   AURORA FINANZIX - I18N SERVICE (INTERNATIONALIZATION)
   ========================================================================== */

import { storage } from './storage.js';

const DICTIONARIES = {
  es: {
    // Navigation & Common
    app_title: "Aurora Finanzix",
    nav_dashboard: "Inicio",
    nav_transactions: "Gastos",
    nav_subscriptions: "Pagos Fijos",
    nav_debts: "Préstamos",
    nav_reports: "Reportes",
    nav_costs: "Costos",
    nav_goals: "Metas",
    nav_my_space: "Mi Espacio",
    
    // Dashboard
    dash_greeting: "Hola",
    dash_balance: "Balance Neto",
    dash_income: "Ingresos",
    dash_expense: "Gastos",
    dash_savings: "Ahorro",
    dash_budget: "Presupuesto",
    dash_recent_tx: "Últimos Movimientos",
    dash_view_all: "Ver todos →",
    dash_empty_title: "¡Bienvenido a Aurora Finanzix!",
    dash_empty_desc: "Tu balance está en 0. Comienza registrando tu primer ingreso o gasto.",
    dash_empty_btn: "+ Registrar Primer Movimiento",

    // Quick Actions
    qa_expense: "Gasto",
    qa_income: "Ingreso",
    qa_costs: "Costos",
    qa_goals: "Metas",

    // Transactions
    tx_new: "Nuevo Movimiento",
    tx_type_income: "Ingreso",
    tx_type_expense: "Gasto",
    tx_amount: "Monto",
    tx_desc: "Descripción",
    tx_category: "Categoría",
    tx_date: "Fecha",
    tx_save: "Guardar",
    tx_cancel: "Cancelar",
    
    // Modules
    sub_title: "Radar de Suscripciones",
    sub_desc: "Controla tus pagos fijos mensuales y anuales.",
    sub_add: "Añadir Suscripción",
    sub_renews: "Renueva en",
    sub_days: "días",
    sub_month: "/ mes",
    debt_title: "Préstamos y Deudas",
    debt_desc: "Controla a quién le debes y quién te debe dinero.",
    
    // Zen Mode
    zen_mode_on: "Modo Privacidad Activado",
    zen_mode_off: "Modo Privacidad Desactivado"
  },
  en: {
    // Navigation & Common
    app_title: "Aurora Finanzix",
    nav_dashboard: "Home",
    nav_transactions: "Expenses",
    nav_subscriptions: "Fixed Bills",
    nav_debts: "Debts",
    nav_reports: "Reports",
    nav_costs: "Costs",
    nav_goals: "Goals",
    nav_my_space: "My Space",
    
    // Dashboard
    dash_greeting: "Hello",
    dash_balance: "Net Balance",
    dash_income: "Income",
    dash_expense: "Expenses",
    dash_savings: "Savings",
    dash_budget: "Budget",
    dash_recent_tx: "Recent Transactions",
    dash_view_all: "View all →",
    dash_empty_title: "Welcome to Aurora Finanzix!",
    dash_empty_desc: "Your balance is 0. Start by recording your first income or expense.",
    dash_empty_btn: "+ Add First Transaction",

    // Quick Actions
    qa_expense: "Expense",
    qa_income: "Income",
    qa_costs: "Costs",
    qa_goals: "Goals",

    // Transactions
    tx_new: "New Transaction",
    tx_type_income: "Income",
    tx_type_expense: "Expense",
    tx_amount: "Amount",
    tx_desc: "Description",
    tx_category: "Category",
    tx_date: "Date",
    tx_save: "Save",
    tx_cancel: "Cancel",

    // Modules
    sub_title: "Subscriptions Radar",
    sub_desc: "Track your monthly and yearly fixed bills.",
    sub_add: "Add Subscription",
    sub_renews: "Renews in",
    sub_days: "days",
    sub_month: "/ month",
    debt_title: "Loans & Debts",
    debt_desc: "Track who you owe and who owes you money.",

    // Zen Mode
    zen_mode_on: "Privacy Mode Enabled",
    zen_mode_off: "Privacy Mode Disabled"
  }
};

export function t(key) {
  const settings = storage.getSettings() || {};
  const lang = settings.lang || 'es';
  const dict = DICTIONARIES[lang] || DICTIONARIES['es'];
  return dict[key] || key;
}

export function formatCurrency(amount) {
  const settings = storage.getSettings() || {};
  const symbol = settings.currencySymbol || 'S/';
  return `${symbol}${Number(amount || 0).toLocaleString(settings.lang === 'en' ? 'en-US' : 'es-PE', { minimumFractionDigits: 2 })}`;
}
