/* ==========================================================================
   AURORA FINANZIX - MAIN APPLICATION ENTRYPOINT
   ========================================================================== */

import { createIcons, icons } from 'lucide';
import { storage } from './services/storage.js';
import { t, formatCurrency } from './services/i18n.js';
import { renderNavbar } from './components/Navbar.js';
import { renderBottomNav } from './components/BottomNav.js';
import { renderDashboard } from './components/DashboardView.js';
import { renderTransactions } from './components/TransactionsView.js';
import { renderBudgets } from './components/BudgetsView.js';
import { renderAnalytics } from './components/AnalyticsView.js';
import { renderTools } from './components/ToolsView.js';
import { renderSubscriptions } from './components/SubscriptionsView.js';
import { renderDebts } from './components/DebtsView.js';
import { showTransactionModal } from './components/TransactionModal.js';
import { showConnectMobileModal } from './components/ConnectMobileModal.js';
import { showExportImportModal } from './components/ExportImportModal.js';

class App {
  constructor() {
    this.currentTab = 'dashboard';
    this.isExpanded = false;
    this.swRegistration = null;
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
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            this.swRegistration = registration;
            this.setupPushSubscription(registration);
            
            // Check for updates immediately
            registration.update().catch(() => {});
            
            window.addEventListener('focus', () => registration.update().catch(() => {}));
            document.addEventListener('visibilitychange', () => {
              if (document.visibilityState === 'visible') {
                registration.update().catch(() => {});
              }
            });

            // Register Periodic Background Sync if supported (Android Chrome)
            if ('periodicSync' in registration) {
              navigator.permissions?.query({ name: 'periodic-background-sync' }).then((status) => {
                if (status.state === 'granted') {
                  registration.periodicSync.register('check-app-updates', {
                    minInterval: 60 * 60 * 1000 // Every 1 hour
                  }).catch(() => {});
                }
              }).catch(() => {});
            }

            // Periodic check every 5 minutes
            setInterval(() => {
              registration.update().catch(() => {});
            }, 5 * 60 * 1000);

            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed') {
                    this.showUpdateBanner();

                    if ('Notification' in window && Notification.permission === 'granted') {
                      registration.showNotification('✨ Aurora Finanzix Actualizada', {
                        body: 'Se ha instalado la última versión.',
                        icon: '/icon.svg',
                        vibrate: [200, 100, 200],
                        data: { url: '/' }
                      }).catch(() => {});
                    }
                  }
                });
              }
            });
          }).catch(err => {
            console.warn('SW registration skipped:', err);
          });
          
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!refreshing) {
            refreshing = true;
            window.location.reload();
          }
        });
      });
    }
  }

  async setupPushSubscription(registration) {
    if (!('PushManager' in window) || !('Notification' in window)) return;

    try {
      if (Notification.permission === 'default') {
        // Request permission on first user interaction or after a short delay
        setTimeout(() => {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              this.subscribeUserToPush(registration);
            }
          }).catch(() => {});
        }, 3000);
      } else if (Notification.permission === 'granted') {
        this.subscribeUserToPush(registration);
      }
    } catch (e) {
      console.warn('Push subscription init error:', e);
    }
  }

  async subscribeUserToPush(registration) {
    try {
      const publicVapidKey = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
      const applicationServerKey = this.urlBase64ToUint8Array(publicVapidKey);

      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey
        });
      }

      if (subscription) {
        fetch('/api/push-subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription)
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('Unable to subscribe to push:', e);
    }
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async checkUpdates(manual = false) {
    if (manual) {
      this.showToast(t('update_checking'), 'info');
    }

    try {
      if (this.swRegistration) {
        await this.swRegistration.update();
      }

      const res = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-cache' });
      if (res.ok) {
        const data = await res.json();
        const storedVersion = localStorage.getItem('aurora_app_version');

        if (storedVersion && storedVersion !== data.version) {
          localStorage.setItem('aurora_app_version', data.version);
          this.showUpdateBanner();
        } else {
          localStorage.setItem('aurora_app_version', data.version);
          if (manual) {
            this.showToast(`✓ ${t('update_latest')} (v${data.version})`, 'success');
          }
        }
      }
    } catch (e) {
      if (manual) {
        this.showToast(t('update_synced'), 'success');
      }
    }
  }

  showUpdateBanner() {
    const existing = document.getElementById('app-update-banner');
    if (existing) return;

    const banner = document.createElement('div');
    banner.id = 'app-update-banner';
    banner.style.cssText = `
      position: fixed;
      top: 14px;
      left: 50%;
      transform: translateX(-50%) translateY(-20px);
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(240, 243, 250, 0.98));
      color: #0F172A;
      padding: 10px 18px;
      border-radius: 999px;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(15, 23, 42, 0.08);
      font-size: 0.84rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 99999;
      opacity: 0;
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      max-width: 90vw;
    `;

    banner.innerHTML = `
      <span style="display: flex; align-items: center; gap: 6px;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10B981; box-shadow: 0 0 8px #10B981;"></span>
        <span>${t('update_banner_title')}</span>
      </span>
      <button type="button" id="btn-update-reload" style="
        background: #0F172A;
        color: #FFFFFF;
        border: none;
        padding: 5px 14px;
        border-radius: 999px;
        font-size: 0.78rem;
        font-weight: 700;
        cursor: pointer;
      ">
        ${t('update_banner_btn')}
      </button>
    `;

    document.body.appendChild(banner);

    requestAnimationFrame(() => {
      banner.style.transform = 'translateX(-50%) translateY(0)';
      banner.style.opacity = '1';
    });

    banner.querySelector('#btn-update-reload')?.addEventListener('click', () => {
      banner.style.opacity = '0';
      window.location.reload();
    });
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
      <span>${type === 'success' ? '✓' : 'ℹ️'}</span>
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
        this.showToast(`¡${tx.type === 'income' ? t('modal_tx_income') : t('modal_tx_expense')} de ${formatCurrency(tx.amount)} registrado!`, 'success');
        this.render();
      }
    });
  }

  refreshNavbar() {
    const navEl = document.getElementById('app-navbar');
    if (navEl) {
      renderNavbar(navEl, {
        onOpenMobileQR: () => showConnectMobileModal(),
        onCheckUpdates: () => this.checkUpdates(true),
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

      case 'subscriptions':
        renderSubscriptions(mainEl);
        break;

      case 'debts':
        renderDebts(mainEl);
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
