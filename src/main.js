/* ==========================================================================
   AURORA FINANZIX - MAIN APPLICATION ENTRYPOINT
   ========================================================================== */

import { createIcons, icons } from 'lucide';
import { storage } from './services/storage.js';
import { renderNavbar } from './components/Navbar.js';
import { renderBottomNav } from './components/BottomNav.js';
import { renderDashboard } from './components/DashboardView.js';
import { renderTransactions } from './components/TransactionsView.js';
import { renderCostCalculator } from './components/CostCalculatorView.js';
import { renderBudgets } from './components/BudgetsView.js';
import { renderAnalytics } from './components/AnalyticsView.js';
import { renderTools } from './components/ToolsView.js';
import { showTransactionModal } from './components/TransactionModal.js';
import { showConnectMobileModal } from './components/ConnectMobileModal.js';
import { showExportImportModal } from './components/ExportImportModal.js';

class App {
  constructor() {
    this.currentTab = 'dashboard';
    this.isExpanded = false;
    this.init();
  }

  init() {
    this.setupServiceWorker();
    this.setupClock();
    this.setupDesktopToggles();
    this.render();

    window.addEventListener('finanzix:data-changed', () => {
      this.renderCurrentView();
      this.refreshNavbar();
    });
  }

  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.warn('SW registration skipped:', err);
      });
    }
  }

  setupClock() {
    const clockEl = document.getElementById('status-clock');
    const updateTime = () => {
      if (clockEl) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        clockEl.textContent = `${hours}:${mins}`;
      }
    };
    updateTime();
    setInterval(updateTime, 30000);
  }

  setupDesktopToggles() {
    const qrBtn = document.getElementById('btn-open-mobile-qr');
    qrBtn?.addEventListener('click', () => {
      showConnectMobileModal();
    });

    const toggleBtn = document.getElementById('btn-device-toggle');
    const toggleText = document.getElementById('device-toggle-text');
    const phoneContainer = document.getElementById('phone-container');

    toggleBtn?.addEventListener('click', () => {
      this.isExpanded = !this.isExpanded;
      phoneContainer?.classList.toggle('mode-expanded', this.isExpanded);
      if (toggleText) {
        toggleText.textContent = this.isExpanded ? 'Vista Celular' : 'Vista Expandida';
      }
    });
  }

  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✓' : '⚠️'}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  openTransactionModal(initialType = 'expense') {
    showTransactionModal({
      initialType,
      onSave: (tx) => {
        this.showToast(`¡${tx.type === 'income' ? 'Ingreso' : 'Gasto'} de ${storage.getSettings().currencySymbol || 'S/'} ${tx.amount.toFixed(2)} registrado!`, 'success');
        this.render();
      }
    });
  }

  refreshNavbar() {
    const navEl = document.getElementById('app-navbar');
    if (navEl) {
      renderNavbar(navEl, {
        onOpenMobileQR: () => showConnectMobileModal(),
        onOpenExportImport: () => showExportImportModal({
          onDataReload: () => this.render(),
          onShowToast: (msg, type) => this.showToast(msg, type)
        }),
        onCurrencyChange: (curr, sym) => {
          this.showToast(`Moneda cambiada a ${curr} (${sym})`, 'success');
          this.render();
        }
      });
    }
  }

  renderCurrentView() {
    const mainEl = document.getElementById('app-main-content');
    if (!mainEl) return;
    mainEl.scrollTop = 0;

    switch (this.currentTab) {
      case 'dashboard':
        renderDashboard(mainEl, {
          onNavigate: (tab) => this.switchTab(tab),
          onAddTransaction: (type) => this.openTransactionModal(type),
          onShowToast: (msg, type) => this.showToast(msg, type)
        });
        break;

      case 'transactions':
        renderTransactions(mainEl, {
          onAddTransaction: (type) => this.openTransactionModal(type),
          onShowToast: (msg, type) => this.showToast(msg, type)
        });
        break;

      case 'costs':
        renderCostCalculator(mainEl, {
          onShowToast: (msg, type) => this.showToast(msg, type)
        });
        break;

      case 'budgets':
        renderBudgets(mainEl, {
          onShowToast: (msg, type) => this.showToast(msg, type)
        });
        break;

      case 'analytics':
        renderAnalytics(mainEl);
        break;

      case 'tools':
        renderTools(mainEl);
        break;

      default:
        this.currentTab = 'dashboard';
        this.renderCurrentView();
        break;
    }

    createIcons({ icons });
  }

  switchTab(tabName) {
    this.currentTab = tabName;
    const bottomNavEl = document.getElementById('app-bottom-nav');
    if (bottomNavEl) {
      renderBottomNav(bottomNavEl, this.currentTab, (tab) => this.switchTab(tab), () => this.openTransactionModal('expense'));
    }
    this.renderCurrentView();
  }

  render() {
    this.refreshNavbar();

    const bottomNavEl = document.getElementById('app-bottom-nav');
    if (bottomNavEl) {
      renderBottomNav(
        bottomNavEl,
        this.currentTab,
        (tab) => this.switchTab(tab),
        () => this.openTransactionModal('expense')
      );
    }

    this.renderCurrentView();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new App();
});
