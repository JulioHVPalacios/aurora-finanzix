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

import { getServicesForCountry } from './servicesCatalog.js';

// Comprehensive Catalogue of Real Services (Peru & Global default)
export const POPULAR_SUBSCRIPTIONS_CATALOG = getServicesForCountry('Perú');


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
