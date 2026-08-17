/* ==========================================================================
   AURORA FINANZIX - STORAGE & DATA SERVICE (CLEAN ZERO-STATE PRODUCTION)
   All Initial Balances at S/ 0.00 Ready for Real User Data
   ========================================================================== */

const STORAGE_KEYS = {
  TRANSACTIONS: 'finanzix_transactions_v2_clean',
  CATEGORIES: 'finanzix_categories_v2_clean',
  SETTINGS: 'finanzix_settings_v2_clean',
  COST_PROJECTS: 'finanzix_cost_projects_v2_clean',
  BUDGETS: 'finanzix_budgets_v2_clean',
  SAVINGS_GOALS: 'finanzix_savings_goals_v2_clean',
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

// Clean Zero State - No mock transactions or seeded money
const SEED_TRANSACTIONS = [];

const SEED_COST_PROJECTS = [
  {
    id: 'proj_default',
    name: 'Mi Primer Producto / Servicio',
    batchSize: 1,
    targetMargin: 40,
    taxRate: 0,
    materials: [
      { id: 'm1', name: 'Insumo principal', qty: 1, unitCost: 0 }
    ],
    labor: { hours: 1, ratePerHour: 0 },
    overheads: [
      { id: 'o1', name: 'Servicios / Empaque', amount: 0 }
    ],
    updatedAt: new Date().toISOString()
  }
];

const SEED_SAVINGS_GOALS = [];

const SEED_BUDGETS = {};

class StorageService {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      this.save(STORAGE_KEYS.TRANSACTIONS, SEED_TRANSACTIONS);
    }
    // Always sync clean categories
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
        userName: 'Mi Espacio',
        monthlyBudget: 0
      });
    }
  }

  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error(`Error reading ${key} from localStorage`, e);
      return null;
    }
  }

  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('finanzix:data-changed', { detail: { key, data } }));
    } catch (e) {
      console.error(`Error saving ${key} to localStorage`, e);
    }
  }

  // Transactions
  getTransactions() {
    return this.get(STORAGE_KEYS.TRANSACTIONS) || [];
  }

  saveTransactions(transactions) {
    this.save(STORAGE_KEYS.TRANSACTIONS, transactions);
  }

  addTransaction(transaction) {
    const transactions = this.getTransactions();
    const newTx = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      ...transaction
    };
    transactions.unshift(newTx);
    this.saveTransactions(transactions);
    return newTx;
  }

  deleteTransaction(id) {
    const transactions = this.getTransactions().filter(t => t.id !== id);
    this.saveTransactions(transactions);
  }

  updateTransaction(id, updatedData) {
    const transactions = this.getTransactions().map(t => {
      if (t.id === id) {
        return { ...t, ...updatedData, updatedAt: new Date().toISOString() };
      }
      return t;
    });
    this.saveTransactions(transactions);
  }

  // Categories
  getCategories() {
    return this.get(STORAGE_KEYS.CATEGORIES) || DEFAULT_CATEGORIES;
  }

  saveCategories(categories) {
    this.save(STORAGE_KEYS.CATEGORIES, categories);
  }

  addCategory(category) {
    const categories = this.getCategories();
    const newCat = {
      id: 'cat_' + Date.now(),
      ...category
    };
    categories.push(newCat);
    this.saveCategories(categories);
    return newCat;
  }

  // Cost Projects
  getCostProjects() {
    return this.get(STORAGE_KEYS.COST_PROJECTS) || SEED_COST_PROJECTS;
  }

  saveCostProject(project) {
    let projects = this.getCostProjects();
    const index = projects.findIndex(p => p.id === project.id);
    if (index >= 0) {
      projects[index] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      projects.push({ ...project, id: project.id || 'proj_' + Date.now(), updatedAt: new Date().toISOString() });
    }
    this.save(STORAGE_KEYS.COST_PROJECTS, projects);
  }

  deleteCostProject(id) {
    const projects = this.getCostProjects().filter(p => p.id !== id);
    this.save(STORAGE_KEYS.COST_PROJECTS, projects.length > 0 ? projects : SEED_COST_PROJECTS);
  }

  // Savings Goals
  getSavingsGoals() {
    return this.get(STORAGE_KEYS.SAVINGS_GOALS) || [];
  }

  saveSavingsGoal(goal) {
    let goals = this.getSavingsGoals();
    const index = goals.findIndex(g => g.id === goal.id);
    if (index >= 0) {
      goals[index] = goal;
    } else {
      goals.push(goal);
    }
    this.save(STORAGE_KEYS.SAVINGS_GOALS, goals);
  }

  deleteSavingsGoal(id) {
    const goals = this.getSavingsGoals().filter(g => g.id !== id);
    this.save(STORAGE_KEYS.SAVINGS_GOALS, goals);
  }

  // Budgets
  getBudgets() {
    return this.get(STORAGE_KEYS.BUDGETS) || {};
  }

  saveBudget(categoryId, limitAmount) {
    const budgets = this.getBudgets();
    budgets[categoryId] = Number(limitAmount);
    this.save(STORAGE_KEYS.BUDGETS, budgets);
  }

  // Settings
  getSettings() {
    return this.get(STORAGE_KEYS.SETTINGS) || {
      currency: 'PEN',
      currencySymbol: 'S/',
      userName: 'Mi Espacio',
      monthlyBudget: 0
    };
  }

  updateSettings(newSettings) {
    const current = this.getSettings();
    this.save(STORAGE_KEYS.SETTINGS, { ...current, ...newSettings });
  }

  // Reset Everything to Absolute Zero
  resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.COST_PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.SAVINGS_GOALS);
    localStorage.removeItem(STORAGE_KEYS.BUDGETS);
    this.init();
    window.location.reload();
  }

  // Export all data as JSON
  exportDataJSON() {
    return JSON.stringify({
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      transactions: this.getTransactions(),
      categories: this.getCategories(),
      costProjects: this.getCostProjects(),
      savingsGoals: this.getSavingsGoals(),
      budgets: this.getBudgets(),
      settings: this.getSettings(),
    }, null, 2);
  }

  // Import JSON backup
  importDataJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.transactions) this.save(STORAGE_KEYS.TRANSACTIONS, data.transactions);
      if (data.categories) this.save(STORAGE_KEYS.CATEGORIES, data.categories);
      if (data.costProjects) this.save(STORAGE_KEYS.COST_PROJECTS, data.costProjects);
      if (data.savingsGoals) this.save(STORAGE_KEYS.SAVINGS_GOALS, data.savingsGoals);
      if (data.budgets) this.save(STORAGE_KEYS.BUDGETS, data.budgets);
      if (data.settings) this.save(STORAGE_KEYS.SETTINGS, data.settings);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}

export const storage = new StorageService();
