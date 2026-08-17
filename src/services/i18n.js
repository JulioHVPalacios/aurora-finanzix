/* ==========================================================================
   AURORA FINANZIX - 100% COMPLETE I18N SERVICE (ENGLISH & SPANISH)
   Ultra-Comprehensive Localization Dictionary for Every Screen & Modal
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
    dash_empty_title: "¡Bienvenido a Aurora Finanzix!",
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
    modal_tx_title_placeholder: "Ej: Supermercado, Almuerzo...",
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
    dash_empty_title: "Welcome to Aurora Finanzix!",
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
    modal_tx_title: "Concept / Description",
    modal_tx_title_placeholder: "e.g., Groceries, Lunch...",
    modal_tx_category: "Category",
    modal_tx_payment_method: "Payment Method",
    modal_tx_date: "Date",
    modal_tx_is_fixed: "Recurring Fixed Expense (Rent, Utilities)",
    modal_tx_note: "Note / Receipt (Optional)",
    modal_tx_note_placeholder: "Additional details or receipt number...",
    modal_tx_attach_receipt: "Attach Receipt / Photo",
    modal_tx_receipt_attached: "Receipt attached successfully",
    modal_tx_save: "Save Transaction",
    modal_tx_cancel: "Cancel",

    // Subscriptions Radar
    sub_title: "Fixed Bills Radar",
    sub_desc: "Track your subscriptions and recurring bills with zero surprises.",
    sub_add_btn: "+ Add Bill",
    sub_renews_in: "Renews in",
    sub_days: "days",
    sub_per_month: "/ month",
    sub_per_year: "/ year",
    sub_empty_title: "No fixed bills registered",
    sub_empty_desc: "Add your subscriptions like Netflix, Internet or Gym.",

    // Debts & Loans
    debt_title: "Loans & Debts Manager",
    debt_desc: "Accurately track who you owe and who owes you money.",
    debt_owed_to_me: "I'm Owed",
    debt_i_owe: "I Owe",
    debt_add_btn: "+ Add Debt",
    debt_type_loan: "Loan",
    debt_type_debt: "Pending debt",
    debt_empty_title: "No active debts",
    debt_empty_desc: "Keep clear records of loans between friends or banks.",

    // Reports & Analytics Hub
    reports_title: "Financial Intelligence Center",
    reports_sub: "Statistics, budgets, savings goals and utilities",
    reports_tab_charts: "Charts",
    reports_tab_budgets: "Goals & Limits",
    reports_tab_tools: "Utilities",
    reports_savings_rate: "Savings Rate",
    reports_diagnostic: "Diagnosis",
    reports_diag_excellent: "Excellent Savings",
    reports_diag_healthy: "Healthy Flow",
    reports_diag_moderate: "Moderate Savings",
    reports_diag_deficit: "In Deficit",
    reports_fixed_expenses: "Fixed Expenses",
    reports_variable_expenses: "Variable Expenses",
    reports_expense_breakdown: "Expense Distribution by Category",
    reports_no_expense_data: "No expense data yet to plot.",

    // Budgets & Savings Goals
    goals_title: "Savings Goals & Budgets",
    goals_sub: "Control your limits by category and reach your financial goals",
    goals_new_btn: "+ New Goal",
    goals_active_title: "Your Savings Goals",
    goals_active_count: "active",
    goals_empty: "You have no savings goals yet. Create one to stay motivated!",
    goals_of: "of",
    goals_deadline: "Deadline:",
    goals_add_funds: "Add Money",
    goals_delete: "Delete",
    goals_cat_budgets: "Category Limits & Budgets",
    goals_set_limit: "Set Limit",
    goals_spent: "Spent:",
    goals_available: "Available:",
    goals_exceeded: "Exceeded!",

    // Quick Tools
    tools_title: "Quick Financial Utilities & Calculators",
    tools_sub: "Practical tools for your day-to-day financial decisions",
    tools_tab_split: "Split Bill",
    tools_tab_loan: "Loan / Installments",
    tools_tab_fx: "Currency Converter",
    tools_split_title: "Split Bill with Friends",
    tools_split_each_pays: "Each Person Pays",
    tools_split_total_with_tip: "Total with tip:",
    tools_split_tip_label: "Tip:",
    tools_split_bill_amount: "Total Bill Amount",
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
    tools_fx_result: "Conversion Result",

    // Updates & Notifications
    update_banner_title: "New version available!",
    update_banner_btn: "Update now",
    update_checking: "Checking for updates...",
    update_latest: "You have the latest version",
    update_synced: "App synchronized successfully",
    push_prompt_title: "Enable update notifications?",
    push_prompt_desc: "Receive Android status bar notifications whenever a new version is published, even when the app is closed.",
    push_prompt_allow: "Enable Alerts",
    push_prompt_later: "Later"
  }
};

export function t(key) {
  const settings = storage.getSettings() || {};
  const lang = settings.lang || 'es';
  const dict = DICTIONARIES[lang] || DICTIONARIES['es'];
  return dict[key] !== undefined ? dict[key] : key;
}

export function formatCurrency(amount) {
  const settings = storage.getSettings() || {};
  const symbol = settings.currencySymbol || 'S/';
  const num = Number(amount || 0);
  const formatted = num.toLocaleString(settings.lang === 'en' ? 'en-US' : 'es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return `${symbol}${formatted}`;
}
