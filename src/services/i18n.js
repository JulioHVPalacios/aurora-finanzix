/* ==========================================================================
   VALO OS - 100% COMPLETE BILINGUAL TRANSLATION SERVICE (ES / EN)
   Zero Missing Keys, Dynamic Category & Payment Method Localization
   ========================================================================== */

import { storage } from './storage.js';

export const DICTIONARIES = {
  es: {
    // Brand & Header
    app_title: "VALO",
    app_subtitle: "VALO OS",
    nav_my_space: "Mi Espacio",
    lang_btn: "ES",
    currency_title: "Cambiar Moneda",
    lang_title: "Cambiar Idioma",
    zen_title: "Modo Privacidad",
    sync_title: "Sincronizar y Actualizar",
    backup_title: "Respaldos y Reportes",
    qr_title: "Conectar Celular",
    more_title: "Panel de Control",

    // Bottom Navigation
    nav_dashboard: "Inicio",
    nav_transactions: "Gastos",
    nav_subscriptions: "Pagos Fijos",
    nav_debts: "Préstamos",
    nav_reports: "Reportes",

    // Dashboard Hero & Metrics
    dash_greeting: "Hola",
    dash_balance: "Balance Neto",
    dash_savings_rate: "Tasa de Ahorro",
    dash_budget: "Presupuesto",
    dash_income: "Ingresos",
    dash_expense: "Gastos",
    dash_savings: "Ahorro",
    dash_liquidity_trend: "Tendencia de Liquidez",
    dash_monthly_flow: "Flujo Mensual",
    dash_wk1: "Sem 1",
    dash_wk2: "Sem 2",
    dash_wk3: "Sem 3",
    dash_wk4: "Sem 4 (Actual)",
    dash_monthly_budget: "Presupuesto Mensual",
    dash_recent_tx: "Últimos Movimientos",
    dash_view_all: "Ver todos →",
    dash_empty_title: "¡Bienvenido a VALO!",
    dash_empty_desc: "Tu balance está en 0. Comienza registrando tu primer ingreso o gasto.",
    dash_empty_btn: "+ Registrar Primer Movimiento",

    // Quick Actions
    qa_expense: "Gasto",
    qa_income: "Ingreso",
    qa_costs: "Costos",
    qa_goals: "Metas",

    // Transactions Ledger
    tx_ledger_title: "Libro de Movimientos",
    tx_ledger_sub: "Historial completo de tus ingresos y gastos",
    tx_new_btn: "+ Nuevo",
    tx_new: "Nuevo Movimiento",
    tx_search_placeholder: "Buscar por concepto o categoría...",
    tx_filter_all: "Todos",
    tx_filter_expense: "Gastos",
    tx_filter_income: "Ingresos",
    tx_filter_fixed: "Fijos",
    tx_cat_all: "Todas las Categorías",
    tx_items_count: "movimientos",
    tx_filtered_balance: "Balance filtrado:",
    tx_no_results_title: "Sin resultados encontrados",
    tx_no_results_desc: "Ajusta tus filtros o registra un nuevo movimiento.",
    tx_delete_confirm: "¿Eliminar este registro de movimiento?",
    tx_delete_success: "Movimiento eliminado con éxito",
    tx_fixed_tag: "Fijo",
    tx_today: "Hoy",

    // Transaction Modal
    modal_tx_new: "Nuevo Registro Financiero",
    modal_tx_type: "Tipo de Registro",
    modal_tx_income: "Ingreso",
    modal_tx_expense: "Gasto",
    modal_tx_amount: "Monto",
    modal_tx_title: "Concepto / Descripción",
    modal_tx_title_placeholder: "Ej: Supermercado, Almuerzo, Salario...",
    modal_tx_category: "Categoría",
    modal_tx_payment_method: "Método de Pago",
    modal_tx_date: "Fecha",
    modal_tx_is_fixed: "Gasto Fijo Recurrente (Alquiler, Servicios)",
    modal_tx_note: "Nota / Comprobante (Opcional)",
    modal_tx_note_placeholder: "Detalles adicionales o número de ticket...",
    modal_tx_attach_receipt: "Adjuntar Recibo / Foto",
    modal_tx_receipt_attached: "Recibo adjuntado con éxito",
    modal_tx_save: "Guardar Movimiento",
    modal_tx_cancel: "Cancelar",

    // Subscriptions Radar
    sub_title: "Radar de Pagos Fijos",
    sub_desc: "Controla tus suscripciones y servicios recurrentes sin sorpresas.",
    sub_add_btn: "+ Añadir Servicio",
    sub_renews_in: "Renueva en",
    sub_days: "días",
    sub_per_month: "/ mes",
    sub_per_year: "/ año",
    sub_empty_title: "Sin pagos fijos registrados",
    sub_empty_desc: "Agrega tus suscripciones como Netflix, Internet o Gimnasio.",

    // Debts & Loans
    debt_title: "Gestor de Préstamos y Deudas",
    debt_desc: "Controla a quién le debes y quién te debe dinero con exactitud.",
    debt_owed_to_me: "Me deben",
    debt_i_owe: "Yo debo",
    debt_add_btn: "+ Registrar Deuda",
    debt_type_loan: "Préstamo",
    debt_type_debt: "Deuda pendiente",
    debt_empty_title: "Sin deudas activas",
    debt_empty_desc: "Mantén un registro claro de préstamos entre amigos o bancos.",

    // Reports & Analytics Hub
    reports_title: "Centro de Inteligencia Financiera",
    reports_sub: "Estadísticas, presupuestos, metas de ahorro y utilidades",
    reports_tab_charts: "Gráficos",
    reports_tab_budgets: "Metas y Límites",
    reports_tab_tools: "Utilidades",
    reports_savings_rate: "Tasa de Ahorro",
    reports_diagnostic: "Diagnóstico",
    reports_diag_excellent: "Excelente Ahorro",
    reports_diag_healthy: "Flujo Saludable",
    reports_diag_moderate: "Ahorro Moderado",
    reports_diag_deficit: "En Déficit",
    reports_fixed_expenses: "Gastos Fijos",
    reports_variable_expenses: "Gastos Variables",
    reports_expense_breakdown: "Distribución de Gastos por Categoría",
    reports_no_expense_data: "Sin datos de gastos aún para graficar.",

    // Budgets & Savings Goals
    goals_title: "Metas de Ahorro y Presupuestos",
    goals_sub: "Controla tus límites por categoría y alcanza tus sueños",
    goals_new_btn: "+ Nueva Meta",
    goals_active_title: "Tus Metas de Ahorro",
    goals_active_count: "activas",
    goals_empty: "No tienes metas de ahorro aún. ¡Crea una para motivarte!",
    goals_of: "de",
    goals_deadline: "Límite:",
    goals_add_funds: "Abonar Dinero",
    goals_delete: "Eliminar",
    goals_cat_budgets: "Límites y Presupuestos por Categoría",
    goals_set_limit: "Fijar Límite",
    goals_spent: "Gastado:",
    goals_available: "Disponible:",
    goals_exceeded: "¡Excedido!",

    // Quick Tools
    tools_title: "Utilidades y Calculadoras Rápidas",
    tools_sub: "Herramientas prácticas para tus decisiones financieras diarias",
    tools_tab_split: "Dividir Cuenta",
    tools_tab_loan: "Cuotas / Préstamo",
    tools_tab_fx: "Conversor Divisas",
    tools_split_title: "Dividir Cuenta entre Amigos",
    tools_split_each_pays: "Cada persona paga",
    tools_split_total_with_tip: "Total con propina:",
    tools_split_tip_label: "Propina:",
    tools_split_bill_amount: "Total de la Cuenta",
    tools_split_people_count: "Número de Personas",
    tools_split_tip_percent: "Porcentaje de Propina",
    tools_loan_title: "Calculadora de Cuotas de Préstamo",
    tools_loan_monthly_payment: "Cuota Mensual Estimada",
    tools_loan_total_interest: "Total de Intereses:",
    tools_loan_total_to_pay: "Total a Pagar:",
    tools_loan_amount: "Monto del Préstamo",
    tools_loan_interest_rate: "Tasa de Interés Anual (%)",
    tools_loan_months: "Plazo (Meses)",
    tools_fx_title: "Conversor de Moneda en Tiempo Real",
    tools_fx_amount: "Monto a Convertir",
    tools_fx_from: "De",
    tools_fx_to: "A",
    tools_fx_result: "Resultado de Conversión",

    // Export & Backup Modal
    modal_export_title: "Respaldos y Exportación",
    modal_export_desc: "Tus datos son 100% privados y se guardan en tu dispositivo. Puedes descargarlos o exportarlos cuando quieras.",
    modal_export_csv_title: "Descargar reporte en Excel (.CSV)",
    modal_export_csv_desc: "Tabla de todos tus movimientos y gastos",
    modal_export_json_title: "Crear Respaldo Completo (.JSON)",
    modal_export_json_desc: "Copia de seguridad de gastos, metas y presupuestos",
    modal_import_json_title: "Restaurar Respaldo (.JSON)",
    modal_import_json_desc: "Cargar datos guardados previamente",
    modal_print_title: "Imprimir / Guardar en PDF",
    modal_print_desc: "Resumen ejecutivo para archivar",

    // Connect Mobile Modal
    modal_qr_title: "Conectar con Celular",
    modal_qr_download_apk: "Descargar Archivo APK Directo (.apk)",
    modal_qr_tab_tunnel: "Túnel Seguro",
    modal_qr_tab_wifi: "Wi-Fi Local",
    modal_qr_copy_btn: "Copiar Enlace",
    modal_qr_copied: "✓ ¡Enlace Copiado!",
    modal_qr_pwd_label: "Contraseña / IP de Verificación:",

    // Categories
    cat_food: "Alimentación",
    cat_home: "Vivienda & Luz",
    cat_transport: "Transporte",
    cat_services: "Internet & Móvil",
    cat_health: "Salud & Medicina",
    cat_entertainment: "Ocio & Salidas",
    cat_education: "Educación",
    cat_shopping: "Compras & Ropa",
    cat_business: "Insumos Negocio",
    cat_other_exp: "Otros Gastos",
    cat_salary: "Sueldo Principal",
    cat_sales: "Ventas de Negocio",
    cat_freelance: "Freelance & Extra",
    cat_invest: "Inversiones",
    cat_gift: "Regalos / Otros",

    // Payment Methods
    pm_cash: "Efectivo",
    pm_yape: "Yape",
    pm_plin: "Plin",
    pm_debit: "Tarjeta Débito",
    pm_credit: "Tarjeta Crédito",
    pm_transfer: "Transferencia",

    // Updates & Notifications
    update_banner_title: "¡Nueva versión disponible!",
    update_banner_btn: "Actualizar ahora",
    update_checking: "Verificando actualizaciones...",
    update_latest: "Tienes la versión más reciente",
    update_synced: "App sincronizada con éxito",
    push_prompt_title: "¿Activar alertas de actualización?",
    push_prompt_desc: "Recibe notificaciones en tu barra de estado de Android cuando haya nuevas versiones, incluso con la app cerrada.",
    push_prompt_allow: "Activar Alertas",
    push_prompt_later: "Más tarde"
  },
  en: {
    // Brand & Header
    app_title: "VALO",
    app_subtitle: "VALO OS",
    nav_my_space: "My Space",
    lang_btn: "EN",
    currency_title: "Change Currency",
    lang_title: "Change Language",
    zen_title: "Privacy Mode",
    sync_title: "Sync & Update",
    backup_title: "Backups & Reports",
    qr_title: "Connect Mobile",
    more_title: "Control Center",

    // Bottom Navigation
    nav_dashboard: "Home",
    nav_transactions: "Expenses",
    nav_subscriptions: "Fixed Bills",
    nav_debts: "Debts",
    nav_reports: "Reports",

    // Dashboard Hero & Metrics
    dash_greeting: "Hello",
    dash_balance: "Net Balance",
    dash_savings_rate: "Savings Rate",
    dash_budget: "Budget",
    dash_income: "Income",
    dash_expense: "Expenses",
    dash_savings: "Savings",
    dash_liquidity_trend: "Liquidity Trend",
    dash_monthly_flow: "Monthly Flow",
    dash_wk1: "Wk 1",
    dash_wk2: "Wk 2",
    dash_wk3: "Wk 3",
    dash_wk4: "Wk 4 (Current)",
    dash_monthly_budget: "Monthly Budget",
    dash_recent_tx: "Recent Transactions",
    dash_view_all: "View all →",
    dash_empty_title: "Welcome to VALO!",
    dash_empty_desc: "Your balance is 0. Start by recording your first income or expense.",
    dash_empty_btn: "+ Add First Transaction",

    // Quick Actions
    qa_expense: "Expense",
    qa_income: "Income",
    qa_costs: "Costs",
    qa_goals: "Goals",

    // Transactions Ledger
    tx_ledger_title: "Transaction Ledger",
    tx_ledger_sub: "Complete history of your income and expenses",
    tx_new_btn: "+ New",
    tx_new: "New Transaction",
    tx_search_placeholder: "Search by title or category...",
    tx_filter_all: "All",
    tx_filter_expense: "Expenses",
    tx_filter_income: "Income",
    tx_filter_fixed: "Fixed",
    tx_cat_all: "All Categories",
    tx_items_count: "transactions",
    tx_filtered_balance: "Filtered balance:",
    tx_no_results_title: "No results found",
    tx_no_results_desc: "Adjust your filters or add a new transaction.",
    tx_delete_confirm: "Delete this transaction record?",
    tx_delete_success: "Transaction deleted successfully",
    tx_fixed_tag: "Fixed",
    tx_today: "Today",

    // Transaction Modal
    modal_tx_new: "New Financial Record",
    modal_tx_type: "Record Type",
    modal_tx_income: "Income",
    modal_tx_expense: "Expense",
    modal_tx_amount: "Amount",
    modal_tx_title: "Title / Description",
    modal_tx_title_placeholder: "e.g. Supermarket, Lunch, Salary...",
    modal_tx_category: "Category",
    modal_tx_payment_method: "Payment Method",
    modal_tx_date: "Date",
    modal_tx_is_fixed: "Recurring Fixed Expense (Rent, Bills)",
    modal_tx_note: "Note / Receipt (Optional)",
    modal_tx_note_placeholder: "Additional details or invoice number...",
    modal_tx_attach_receipt: "Attach Receipt / Photo",
    modal_tx_receipt_attached: "Receipt attached successfully",
    modal_tx_save: "Save Record",
    modal_tx_cancel: "Cancel",

    // Subscriptions Radar
    sub_title: "Recurring Bills Radar",
    sub_desc: "Track your subscriptions and recurring bills with zero surprises.",
    sub_add_btn: "+ Add Service",
    sub_renews_in: "Renews in",
    sub_days: "days",
    sub_per_month: "/ month",
    sub_per_year: "/ year",
    sub_empty_title: "No recurring bills yet",
    sub_empty_desc: "Add your subscriptions like Netflix, Internet or Gym.",

    // Debts & Loans
    debt_title: "Loans & Debts Manager",
    debt_desc: "Keep precise track of who owes you and what you owe.",
    debt_owed_to_me: "Owed to me",
    debt_i_owe: "I owe",
    debt_add_btn: "+ Add Debt",
    debt_type_loan: "Loan",
    debt_type_debt: "Pending Debt",
    debt_empty_title: "No active debts",
    debt_empty_desc: "Keep a transparent ledger of loans between friends or banks.",

    // Reports & Analytics Hub
    reports_title: "Financial Intelligence Hub",
    reports_sub: "Real-time analytics, budgets, savings goals & utilities",
    reports_tab_charts: "Charts",
    reports_tab_budgets: "Goals & Limits",
    reports_tab_tools: "Utilities",
    reports_savings_rate: "Savings Rate",
    reports_diagnostic: "Diagnostic",
    reports_diag_excellent: "Excellent Savings",
    reports_diag_healthy: "Healthy Flow",
    reports_diag_moderate: "Moderate Savings",
    reports_diag_deficit: "In Deficit",
    reports_fixed_expenses: "Fixed Expenses",
    reports_variable_expenses: "Variable Expenses",
    reports_expense_breakdown: "Expense Breakdown by Category",
    reports_no_expense_data: "No expense data yet to plot.",

    // Budgets & Savings Goals
    goals_title: "Savings Goals & Budgets",
    goals_sub: "Set category limits and reach your milestones",
    goals_new_btn: "+ New Goal",
    goals_active_title: "Your Savings Goals",
    goals_active_count: "active",
    goals_empty: "No savings goals yet. Create one to get started!",
    goals_of: "of",
    goals_deadline: "Target:",
    goals_add_funds: "Add Funds",
    goals_delete: "Delete",
    goals_cat_budgets: "Category Budgets & Limits",
    goals_set_limit: "Set Limit",
    goals_spent: "Spent:",
    goals_available: "Available:",
    goals_exceeded: "Exceeded!",

    // Quick Tools
    tools_title: "Utilities & Quick Calculators",
    tools_sub: "Everyday financial engines for smart decisions",
    tools_tab_split: "Split Bill",
    tools_tab_loan: "Loan / Rates",
    tools_tab_fx: "FX Converter",
    tools_split_title: "Split Bill with Friends",
    tools_split_each_pays: "Each person pays",
    tools_split_total_with_tip: "Grand total with tip:",
    tools_split_tip_label: "Tip:",
    tools_split_bill_amount: "Bill Total",
    tools_split_people_count: "Number of People",
    tools_split_tip_percent: "Tip Percentage",
    tools_loan_title: "Loan Installment Calculator",
    tools_loan_monthly_payment: "Estimated Monthly Payment",
    tools_loan_total_interest: "Total Interest:",
    tools_loan_total_to_pay: "Total to Pay:",
    tools_loan_amount: "Loan Principal",
    tools_loan_interest_rate: "Annual Interest Rate (%)",
    tools_loan_months: "Term (Months)",
    tools_fx_title: "Real-Time Currency Converter",
    tools_fx_amount: "Amount to Convert",
    tools_fx_from: "From",
    tools_fx_to: "To",
    tools_fx_result: "Converted Result",

    // Export & Backup Modal
    modal_export_title: "Backups & Export",
    modal_export_desc: "Your data is 100% private and saved locally on your device. Export to Excel or backup whenever you wish.",
    modal_export_csv_title: "Download Excel Report (.CSV)",
    modal_export_csv_desc: "Spreadsheet of all your transactions and expenses",
    modal_export_json_title: "Create Full Backup (.JSON)",
    modal_export_json_desc: "Complete archive of expenses, goals and budgets",
    modal_import_json_title: "Restore Backup (.JSON)",
    modal_import_json_desc: "Load previously saved financial data",
    modal_print_title: "Print / Save as PDF",
    modal_print_desc: "Executive financial summary for archiving",

    // Connect Mobile Modal
    modal_qr_title: "Connect with Mobile",
    modal_qr_download_apk: "Direct APK File Download (.apk)",
    modal_qr_tab_tunnel: "Secure Tunnel",
    modal_qr_tab_wifi: "Local Wi-Fi",
    modal_qr_copy_btn: "Copy Link",
    modal_qr_copied: "✓ Link Copied!",
    modal_qr_pwd_label: "Verification Password / IP:",

    // Categories
    cat_food: "Food & Dining",
    cat_home: "Housing & Utilities",
    cat_transport: "Transportation",
    cat_services: "Internet & Mobile",
    cat_health: "Health & Medical",
    cat_entertainment: "Entertainment",
    cat_education: "Education",
    cat_shopping: "Shopping & Clothes",
    cat_business: "Business Supplies",
    cat_other_exp: "Other Expenses",
    cat_salary: "Main Salary",
    cat_sales: "Business Sales",
    cat_freelance: "Freelance & Extra",
    cat_invest: "Investments",
    cat_gift: "Gifts / Others",

    // Payment Methods
    pm_cash: "Cash",
    pm_yape: "Yape",
    pm_plin: "Plin",
    pm_debit: "Debit Card",
    pm_credit: "Credit Card",
    pm_transfer: "Bank Transfer",

    // Updates & Notifications
    update_banner_title: "New version available!",
    update_banner_btn: "Update now",
    update_checking: "Checking for updates...",
    update_latest: "You have the latest version",
    update_synced: "App synced successfully",
    push_prompt_title: "Enable update alerts?",
    push_prompt_desc: "Get instant Android status bar notifications when new versions are released, even with the app closed.",
    push_prompt_allow: "Enable Alerts",
    push_prompt_later: "Later"
  }
};

export function getLanguage() {
  const settings = storage.getSettings() || {};
  return settings.language || 'es';
}

export function setLanguage(lang) {
  const validLang = lang === 'en' ? 'en' : 'es';
  storage.updateSettings({ language: validLang });
  window.dispatchEvent(new CustomEvent('finanzix:data-changed'));
}

export function t(key) {
  const lang = getLanguage();
  const dict = DICTIONARIES[lang] || DICTIONARIES.es;
  if (dict && dict[key] !== undefined) {
    return dict[key];
  }
  if (DICTIONARIES.es && DICTIONARIES.es[key] !== undefined) {
    return DICTIONARIES.es[key];
  }
  return key;
}

export function getCategoryName(cat) {
  if (!cat) return t('cat_other_exp');
  const catId = typeof cat === 'object' ? cat.id : cat;
  const key = `cat_${catId}`;
  const translated = t(key);
  if (translated !== key) return translated;
  return typeof cat === 'object' ? cat.name : catId;
}

export function getPaymentMethodName(pm) {
  if (!pm) return t('pm_cash');
  const pmId = typeof pm === 'object' ? pm.id : pm;
  const key = `pm_${pmId}`;
  const translated = t(key);
  if (translated !== key) return translated;
  return typeof pm === 'object' ? pm.name : pmId;
}

export function formatCurrency(amount, currencyCode = null) {
  const settings = storage.getSettings() || {};
  const symbol = settings.currencySymbol || 'S/';
  const num = Number(amount) || 0;
  
  const formatted = num.toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return `${symbol} ${formatted}`;
}
