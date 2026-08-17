/* ==========================================================================
   AURORA FINANZIX - STORAGE & DATA SERVICE
   Clean Vector Icon Mapping (Zero Emoji / Zero AI Templates)
   ========================================================================== */

const STORAGE_KEYS = {
  TRANSACTIONS: 'finanzix_transactions_v1',
  CATEGORIES: 'finanzix_categories_v1',
  SETTINGS: 'finanzix_settings_v1',
  COST_PROJECTS: 'finanzix_cost_projects_v1',
  BUDGETS: 'finanzix_budgets_v1',
  SAVINGS_GOALS: 'finanzix_savings_goals_v1',
};

// Clean Vector Lucide Categories
export const DEFAULT_CATEGORIES = [
  { id: 'food', name: 'Alimentación', icon: 'utensils', type: 'expense', color: '#10B981' },
  { id: 'home', name: 'Vivienda & Luz', icon: 'home', type: 'expense', color: '#0EA5E9' },
  { id: 'transport', name: 'Transporte', icon: 'car', type: 'expense', color: '#F59E0B' },
  { id: 'services', name: 'Internet & Móvil', icon: 'wifi', type: 'expense', color: '#8B5CF6' },
  { id: 'health', name: 'Salud & Medicina', icon: 'heart-pulse', type: 'expense', color: '#EC4899' },
  { id: 'entertainment', name: 'Ocio & Salidas', icon: 'film', type: 'expense', color: '#F43F5E' },
  { id: 'education', name: 'Educación', icon: 'book-open', type: 'expense', color: '#3B82F6' },
  { id: 'shopping', name: 'Compras & Ropa', icon: 'shopping-bag', type: 'expense', color: '#14B8A6' },
  { id: 'business', name: 'Insumos Negocio', icon: 'package', type: 'expense', color: '#F97316' },
  { id: 'other_exp', name: 'Otros Gastos', icon: 'receipt', type: 'expense', color: '#64748B' },
  
  // Incomes
  { id: 'salary', name: 'Sueldo Principal', icon: 'briefcase', type: 'income', color: '#10B981' },
  { id: 'sales', name: 'Ventas de Negocio', icon: 'shopping-cart', type: 'income', color: '#059669' },
  { id: 'freelance', name: 'Freelance & Extra', icon: 'laptop', type: 'income', color: '#34D399' },
  { id: 'invest', name: 'Inversiones', icon: 'trending-up', type: 'income', color: '#0EA5E9' },
  { id: 'gift', name: 'Regalos / Otros', icon: 'gift', type: 'income', color: '#8B5CF6' },
];

export const PAYMENT_METHODS = [
  { id: 'cash', name: 'Efectivo', icon: 'banknote' },
  { id: 'yape', name: 'Yape', icon: 'smartphone' },
  { id: 'plin', name: 'Plin', icon: 'zap' },
  { id: 'debit', name: 'Débito', icon: 'credit-card' },
  { id: 'credit', name: 'Crédito', icon: 'gem' },
  { id: 'transfer', name: 'Transferencia', icon: 'building-2' },
];

const SEED_TRANSACTIONS = [
  {
    id: 'tx_1',
    type: 'income',
    title: 'Sueldo Mensual',
    amount: 3200,
    category: 'salary',
    paymentMethod: 'transfer',
    isFixed: true,
    date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
    note: 'Pago quincenal'
  },
  {
    id: 'tx_2',
    type: 'expense',
    title: 'Supermercado Mensual',
    amount: 420.50,
    category: 'food',
    paymentMethod: 'debit',
    isFixed: false,
    date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    note: 'Despensa del hogar'
  },
  {
    id: 'tx_3',
    type: 'expense',
    title: 'Alquiler Residencia',
    amount: 850,
    category: 'home',
    paymentMethod: 'transfer',
    isFixed: true,
    date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    note: 'Renta fija'
  },
  {
    id: 'tx_4',
    type: 'income',
    title: 'Venta de Pedido #104',
    amount: 580,
    category: 'sales',
    paymentMethod: 'yape',
    isFixed: false,
    date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    note: 'Cliente directo'
  },
  {
    id: 'tx_5',
    type: 'expense',
    title: 'Cena Restaurante',
    amount: 85,
    category: 'entertainment',
    paymentMethod: 'plin',
    isFixed: false,
    date: new Date().toISOString().split('T')[0],
    note: 'Salida fin de semana'
  }
];

const SEED_COST_PROJECTS = [
  {
    id: 'proj_1',
    name: 'Torta Artesanal de Chocolate',
    batchSize: 1,
    targetMargin: 40,
    taxRate: 0,
    materials: [
      { id: 'm1', name: 'Harina preparada (500g)', qty: 1, unitCost: 4.50 },
      { id: 'm2', name: 'Cacao en polvo (200g)', qty: 1, unitCost: 8.00 },
      { id: 'm3', name: 'Huevos (6 unidades)', qty: 6, unitCost: 0.60 },
      { id: 'm4', name: 'Mantequilla y leche', qty: 1, unitCost: 7.50 },
      { id: 'm5', name: 'Caja y empaque premium', qty: 1, unitCost: 5.00 },
    ],
    labor: { hours: 2, ratePerHour: 10.00 },
    overheads: [
      { id: 'o1', name: 'Gas y Electricidad del horno', amount: 6.00 },
      { id: 'o2', name: 'Desgaste de moldes y agua', amount: 2.50 }
    ],
    updatedAt: new Date().toISOString()
  }
];

const SEED_SAVINGS_GOALS = [
  {
    id: 'goal_1',
    title: 'Fondo de Emergencia',
    targetAmount: 5000,
    currentAmount: 2400,
    deadline: '2026-12-31',
    icon: 'shield'
  },
  {
    id: 'goal_2',
    title: 'Nuevo Terminal Android',
    targetAmount: 1800,
    currentAmount: 1250,
    deadline: '2026-10-15',
    icon: 'smartphone'
  }
];

const SEED_BUDGETS = {
  food: 900,
  entertainment: 300,
  transport: 250,
  services: 200,
};

class StorageService {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      this.save(STORAGE_KEYS.TRANSACTIONS, SEED_TRANSACTIONS);
    }
    // Always sync categories to ensure vector icons
    this.save(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);

    if (!localStorage.getItem(STORAGE_KEYS.COST_PROJECTS)) {
      this.save(STORAGE_KEYS.COST_PROJECTS, SEED_COST_PROJECTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SAVINGS_GOALS)) {
      this.save(STORAGE_KEYS.SAVINGS_GOALS, SEED_SAVINGS_GOALS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.BUDGETS)) {
      this.save(STORAGE_KEYS.BUDGETS, SEED_BUDGETS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      this.save(STORAGE_KEYS.SETTINGS, {
        currency: 'PEN',
        currencySymbol: 'S/',
        userName: 'Usuario',
        theme: 'dark',
        monthlyBudget: 2500
      });
    }
  }

  get(key, fallback = []) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.error('Error reading localStorage:', e);
      return fallback;
    }
  }

  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('finanzix:data-changed', { detail: { key } }));
    } catch (e) {
      console.error('Error saving localStorage:', e);
    }
  }

  getTransactions() {
    return this.get(STORAGE_KEYS.TRANSACTIONS, []);
  }

  addTransaction(tx) {
    const transactions = this.getTransactions();
    const newTx = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      createdAt: new Date().toISOString(),
      ...tx
    };
    transactions.unshift(newTx);
    this.save(STORAGE_KEYS.TRANSACTIONS, transactions);
    return newTx;
  }

  deleteTransaction(id) {
    let transactions = this.getTransactions();
    transactions = transactions.filter(t => t.id !== id);
    this.save(STORAGE_KEYS.TRANSACTIONS, transactions);
  }

  getCategories() {
    return this.get(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
  }

  getCategoryById(id) {
    const categories = this.getCategories();
    return categories.find(c => c.id === id) || { id: 'other', name: 'General', icon: 'receipt', color: '#64748B' };
  }

  getCostProjects() {
    return this.get(STORAGE_KEYS.COST_PROJECTS, []);
  }

  saveCostProject(project) {
    const projects = this.getCostProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    if (existingIndex !== -1) {
      projects[existingIndex] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      projects.unshift({
        id: 'proj_' + Date.now(),
        ...project,
        updatedAt: new Date().toISOString()
      });
    }
    this.save(STORAGE_KEYS.COST_PROJECTS, projects);
  }

  deleteCostProject(id) {
    let projects = this.getCostProjects();
    projects = projects.filter(p => p.id !== id);
    this.save(STORAGE_KEYS.COST_PROJECTS, projects);
  }

  getSavingsGoals() {
    return this.get(STORAGE_KEYS.SAVINGS_GOALS, []);
  }

  saveSavingsGoal(goal) {
    const goals = this.getSavingsGoals();
    const index = goals.findIndex(g => g.id === goal.id);
    if (index !== -1) {
      goals[index] = goal;
    } else {
      goals.push({ id: 'goal_' + Date.now(), ...goal });
    }
    this.save(STORAGE_KEYS.SAVINGS_GOALS, goals);
  }

  deleteSavingsGoal(id) {
    let goals = this.getSavingsGoals();
    goals = goals.filter(g => g.id !== id);
    this.save(STORAGE_KEYS.SAVINGS_GOALS, goals);
  }

  getBudgets() {
    return this.get(STORAGE_KEYS.BUDGETS, {});
  }

  saveBudget(categoryId, amount) {
    const budgets = this.getBudgets();
    budgets[categoryId] = Number(amount);
    this.save(STORAGE_KEYS.BUDGETS, budgets);
  }

  getSettings() {
    return this.get(STORAGE_KEYS.SETTINGS, {
      currency: 'PEN',
      currencySymbol: 'S/',
      userName: 'Usuario',
      theme: 'dark'
    });
  }

  updateSettings(newSettings) {
    const settings = { ...this.getSettings(), ...newSettings };
    this.save(STORAGE_KEYS.SETTINGS, settings);
    return settings;
  }

  exportBackupJSON() {
    const backup = {
      transactions: this.getTransactions(),
      categories: this.getCategories(),
      costProjects: this.getCostProjects(),
      savingsGoals: this.getSavingsGoals(),
      budgets: this.getBudgets(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(backup, null, 2);
  }

  importBackupJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.transactions) this.save(STORAGE_KEYS.TRANSACTIONS, data.transactions);
      if (data.categories) this.save(STORAGE_KEYS.CATEGORIES, data.categories);
      if (data.costProjects) this.save(STORAGE_KEYS.COST_PROJECTS, data.costProjects);
      if (data.savingsGoals) this.save(STORAGE_KEYS.SAVINGS_GOALS, data.savingsGoals);
      if (data.budgets) this.save(STORAGE_KEYS.BUDGETS, data.budgets);
      if (data.settings) this.save(STORAGE_KEYS.SETTINGS, data.settings);
      return { success: true, message: '¡Datos restaurados con éxito!' };
    } catch (e) {
      return { success: false, message: 'Archivo JSON inválido o corrupto.' };
    }
  }

  exportCSV() {
    const txs = this.getTransactions();
    const categories = this.getCategories();
    let csv = 'ID,Fecha,Tipo,Titulo,Monto,Categoria,MetodoPago,Fijo,Nota\n';
    txs.forEach(t => {
      const cat = categories.find(c => c.id === t.category)?.name || t.category;
      csv += `"${t.id}","${t.date}","${t.type}","${t.title.replace(/"/g, '""')}","${t.amount}","${cat}","${t.paymentMethod}","${t.isFixed ? 'SI' : 'NO'}","${(t.note || '').replace(/"/g, '""')}"\n`;
    });
    return csv;
  }
}

export const storage = new StorageService();
