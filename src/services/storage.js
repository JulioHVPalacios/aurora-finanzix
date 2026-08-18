/* ==========================================================================
   VALO OS - STORAGE & DATA SERVICE (CLEAN PRODUCTION)
   Local-First, Zero-Leak Personal Financial Engine
   ========================================================================== */

const STORAGE_KEYS = {
  TRANSACTIONS: 'valo_transactions_v1',
  CATEGORIES: 'valo_categories_v1',
  SETTINGS: 'valo_settings_v1',
  COST_PROJECTS: 'valo_cost_projects_v1',
  BUDGETS: 'valo_budgets_v1',
  SAVINGS_GOALS: 'valo_savings_goals_v1',
  SUBSCRIPTIONS: 'valo_subscriptions_v1'
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

// Comprehensive Catalogue of Real Services (Peru & Global)
export const POPULAR_SUBSCRIPTIONS_CATALOG = [
  // Streaming & Video
  { id: 'netflix', name: 'Netflix', category: 'entertainment', defaultAmount: 44.90, icon: 'netflix', color: '#E50914', hasOfficialLogo: true },
  { id: 'spotify', name: 'Spotify', category: 'entertainment', defaultAmount: 20.90, icon: 'spotify', color: '#1DB954', hasOfficialLogo: true },
  { id: 'disney', name: 'Disney+', category: 'entertainment', defaultAmount: 38.90, icon: 'disneyplus', color: '#113CCF', hasOfficialLogo: true },
  { id: 'max', name: 'Max (HBO)', category: 'entertainment', defaultAmount: 29.90, icon: 'max', color: '#002BE7', hasOfficialLogo: true },
  { id: 'prime', name: 'Amazon Prime', category: 'entertainment', defaultAmount: 19.90, icon: 'amazonprime', color: '#00A8E1', hasOfficialLogo: true },
  { id: 'youtube', name: 'YouTube Premium', category: 'entertainment', defaultAmount: 24.90, icon: 'youtube', color: '#FF0000', hasOfficialLogo: true },
  { id: 'appletv', name: 'Apple TV+', category: 'entertainment', defaultAmount: 29.90, icon: 'appletv', color: '#000000', hasOfficialLogo: true },
  { id: 'crunchyroll', name: 'Crunchyroll', category: 'entertainment', defaultAmount: 19.00, icon: 'crunchyroll', color: '#F47521', hasOfficialLogo: true },
  
  // Servicios Hogar & Telecom Perú
  { id: 'movistar', name: 'Movistar Fibra', category: 'services', defaultAmount: 89.90, icon: 'movistar', color: '#019DF4', hasOfficialLogo: true },
  { id: 'claro', name: 'Claro Hogar', category: 'services', defaultAmount: 85.00, icon: 'claro', color: '#DA291C', hasOfficialLogo: true },
  { id: 'win', name: 'WIN Internet', category: 'services', defaultAmount: 99.00, icon: 'wifi', color: '#F97316', hasOfficialLogo: false },
  { id: 'entel', name: 'Entel Móvil', category: 'services', defaultAmount: 49.90, icon: 'smartphone', color: '#0055A5', hasOfficialLogo: false },
  { id: 'luz_del_sur', name: 'Luz del Sur / Pluz', category: 'home', defaultAmount: 120.00, icon: 'zap', color: '#F59E0B', hasOfficialLogo: false },
  { id: 'sedapal', name: 'Sedapal (Agua)', category: 'home', defaultAmount: 65.00, icon: 'droplet', color: '#0284C7', hasOfficialLogo: false },
  { id: 'calidda', name: 'Cálidda Gas', category: 'home', defaultAmount: 35.00, icon: 'flame', color: '#EF4444', hasOfficialLogo: false },
  
  // Gimnasios & Salud Perú
  { id: 'smartfit', name: 'SmartFit', category: 'health', defaultAmount: 99.00, icon: 'dumbbell', color: '#FFB81C', hasOfficialLogo: false },
  { id: 'bodytech', name: 'Bodytech', category: 'health', defaultAmount: 150.00, icon: 'dumbbell', color: '#DC2626', hasOfficialLogo: false },
  { id: 'pacifico', name: 'Pacífico EPS', category: 'health', defaultAmount: 180.00, icon: 'heart-pulse', color: '#0D9488', hasOfficialLogo: false },
  { id: 'rimac', name: 'Rímac Seguros', category: 'health', defaultAmount: 160.00, icon: 'shield', color: '#B91C1C', hasOfficialLogo: false },
  
  // Tech & Productividad
  { id: 'icloud', name: 'Apple iCloud', category: 'education', defaultAmount: 3.90, icon: 'icloud', color: '#3699F2', hasOfficialLogo: true },
  { id: 'googleone', name: 'Google One', category: 'education', defaultAmount: 6.90, icon: 'google', color: '#4285F4', hasOfficialLogo: true },
  { id: 'chatgpt', name: 'ChatGPT Plus', category: 'education', defaultAmount: 76.00, icon: 'openai', color: '#10A37F', hasOfficialLogo: true },
  { id: 'canva', name: 'Canva Pro', category: 'education', defaultAmount: 34.90, icon: 'canva', color: '#00C4CC', hasOfficialLogo: true },
  { id: 'microsoft365', name: 'Microsoft 365', category: 'education', defaultAmount: 26.00, icon: 'microsoft', color: '#0078D4', hasOfficialLogo: true },
  
  // Gaming & Delivery
  { id: 'rappi', name: 'Rappi Prime', category: 'shopping', defaultAmount: 22.90, icon: 'shopping-bag', color: '#FF441F', hasOfficialLogo: false },
  { id: 'psplus', name: 'PlayStation Plus', category: 'entertainment', defaultAmount: 35.00, icon: 'playstation', color: '#003791', hasOfficialLogo: true },
  { id: 'xbox', name: 'Xbox Game Pass', category: 'entertainment', defaultAmount: 39.90, icon: 'xbox', color: '#107C10', hasOfficialLogo: true }
];

class StorageService {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      this.save(STORAGE_KEYS.TRANSACTIONS, []);
    }
    this.save(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);

    if (!localStorage.getItem(STORAGE_KEYS.COST_PROJECTS)) {
      this.save(STORAGE_KEYS.COST_PROJECTS, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SAVINGS_GOALS)) {
      this.save(STORAGE_KEYS.SAVINGS_GOALS, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.BUDGETS)) {
      this.save(STORAGE_KEYS.BUDGETS, {});
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS)) {
      // Seed popular starter templates for realistic user management
      this.save(STORAGE_KEYS.SUBSCRIPTIONS, [
        {
          id: 'sub_netflix',
          name: 'Netflix',
          amount: 44.90,
          billingPeriod: 'monthly',
          renewalDay: 15,
          category: 'entertainment',
          paymentMethod: 'debit',
          icon: 'netflix',
          color: '#E50914',
          hasOfficialLogo: true
        },
        {
          id: 'sub_spotify',
          name: 'Spotify',
          amount: 20.90,
          billingPeriod: 'monthly',
          renewalDay: 28,
          category: 'entertainment',
          paymentMethod: 'credit',
          icon: 'spotify',
          color: '#1DB954',
          hasOfficialLogo: true
        },
        {
          id: 'sub_movistar',
          name: 'Movistar Fibra',
          amount: 89.90,
          billingPeriod: 'monthly',
          renewalDay: 5,
          category: 'services',
          paymentMethod: 'transfer',
          icon: 'movistar',
          color: '#019DF4',
          hasOfficialLogo: true
        }
      ]);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      this.save(STORAGE_KEYS.SETTINGS, {
        currency: 'PEN',
        currencySymbol: 'S/',
        userName: 'Mi Espacio',
        userFirstName: '',
        userLastName: '',
        userCity: 'Lima',
        userCountry: 'Perú',
        userEmail: '',
        userAge: '',
        monthlyBudget: 0,
        language: 'es'
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

  // Subscriptions & Fixed Bills
  getSubscriptions() {
    return this.get(STORAGE_KEYS.SUBSCRIPTIONS) || [];
  }

  saveSubscriptions(subscriptions) {
    this.save(STORAGE_KEYS.SUBSCRIPTIONS, subscriptions);
  }

  addSubscription(subscription) {
    const subscriptions = this.getSubscriptions();
    const newSub = {
      id: 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      createdAt: new Date().toISOString(),
      ...subscription
    };
    subscriptions.push(newSub);
    this.saveSubscriptions(subscriptions);
    return newSub;
  }

  deleteSubscription(id) {
    const subscriptions = this.getSubscriptions().filter(s => s.id !== id);
    this.saveSubscriptions(subscriptions);
  }

  // Categories
  getCategories() {
    return this.get(STORAGE_KEYS.CATEGORIES) || DEFAULT_CATEGORIES;
  }

  // Savings Goals
  getSavingsGoals() {
    return this.get(STORAGE_KEYS.SAVINGS_GOALS) || [];
  }

  saveSavingsGoals(goals) {
    this.save(STORAGE_KEYS.SAVINGS_GOALS, goals);
  }

  // Budgets
  getBudgets() {
    return this.get(STORAGE_KEYS.BUDGETS) || {};
  }

  saveBudgets(budgets) {
    this.save(STORAGE_KEYS.BUDGETS, budgets);
  }

  // Settings & Profile
  getSettings() {
    return this.get(STORAGE_KEYS.SETTINGS) || {
      currency: 'PEN',
      currencySymbol: 'S/',
      userName: 'Mi Espacio',
      userFirstName: '',
      userLastName: '',
      userCity: 'Lima',
      userCountry: 'Perú',
      userEmail: '',
      userAge: '',
      monthlyBudget: 0,
      language: 'es'
    };
  }

  updateSettings(newSettings) {
    const current = this.getSettings();
    this.save(STORAGE_KEYS.SETTINGS, { ...current, ...newSettings });
  }

  exportAllData() {
    return {
      version: 'VALO-2.0',
      exportedAt: new Date().toISOString(),
      transactions: this.getTransactions(),
      categories: this.getCategories(),
      subscriptions: this.getSubscriptions(),
      savingsGoals: this.getSavingsGoals(),
      budgets: this.getBudgets(),
      settings: this.getSettings(),
    };
  }

  importAllData(data) {
    try {
      if (!data) return false;
      if (data.transactions) this.save(STORAGE_KEYS.TRANSACTIONS, data.transactions);
      if (data.categories) this.save(STORAGE_KEYS.CATEGORIES, data.categories);
      if (data.subscriptions) this.save(STORAGE_KEYS.SUBSCRIPTIONS, data.subscriptions);
      if (data.savingsGoals) this.save(STORAGE_KEYS.SAVINGS_GOALS, data.savingsGoals);
      if (data.budgets) this.save(STORAGE_KEYS.BUDGETS, data.budgets);
      if (data.settings) this.save(STORAGE_KEYS.SETTINGS, data.settings);
      return true;
    } catch (e) {
      console.error('Error importing backup data:', e);
      return false;
    }
  }
}

export const storage = new StorageService();
