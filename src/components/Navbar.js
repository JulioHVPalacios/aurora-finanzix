/* ==========================================================================
   AURORA FINANZIX - TOP NAVBAR COMPONENT
   Minimalist Glass Controls, Dual Currency & Full Translation
   ========================================================================== */

import { storage } from '../services/storage.js';
import { t } from '../services/i18n.js';
import { createIcons, icons } from 'lucide';

export function renderNavbar(container, { onOpenMobileQR, onOpenExportImport, onCurrencyChange, onCheckUpdates }) {
  const settings = storage.getSettings() || {};
  const currentLang = settings.lang || 'es';
  const currentCurrency = settings.currency || 'PEN';
  const currentSymbol = settings.currencySymbol || 'S/';

  const userName = (!settings.userName || settings.userName === 'Mi Espacio' || settings.userName === 'My Space')
    ? t('nav_my_space')
    : settings.userName;

  container.innerHTML = `
    <div class="navbar-user">
      <div class="user-avatar-glass" style="background: #0F172A; border: 1.5px solid rgba(255,255,255,0.8); color: #FFFFFF; font-weight: 800;">
        ${(userName[0] || 'A').toUpperCase()}
      </div>
      <div>
        <div class="greeting-sub" style="font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.1em; color: var(--ink-60);">
          ${t('app_subtitle')}
        </div>
        <div class="greeting-main" style="font-size: 0.98rem; font-weight: 800; color: var(--ink);">
          ${userName}
        </div>
      </div>
    </div>

    <div class="navbar-actions">
      <!-- Language Selector Chip (ES / EN) -->
      <button id="btn-lang-selector" class="chip-glass" style="cursor: pointer; padding: 6px 10px; font-family: var(--font-mono); font-weight: 800; font-size: 0.76rem;" title="${t('lang_title')}">
        <span id="nav-lang-txt" style="color: #4F46E5;">${currentLang.toUpperCase()}</span>
      </button>

      <!-- Currency Selector Chip (S/ or $) -->
      <button id="btn-currency-selector" class="chip-glass" style="cursor: pointer; padding: 6px 10px; font-family: var(--font-mono); font-weight: 800; font-size: 0.76rem;" title="${t('currency_title')}">
        <span id="nav-currency-sym" style="color: #059669;">${currentSymbol}</span>
      </button>

      <!-- Zen Mode (Privacy Eye) -->
      <button id="btn-nav-zen" class="tool-circle-glass" title="${t('zen_title')}">
        <i data-lucide="eye-off" style="width: 16px; height: 16px; color: var(--ink-60);"></i>
      </button>

      <!-- Sync / Update Trigger -->
      <button id="btn-nav-sync-update" class="tool-circle-glass" title="${t('sync_title')}">
        <i data-lucide="refresh-cw" style="width: 16px; height: 16px; color: #0F172A;"></i>
      </button>

      <!-- Backups / Export -->
      <button id="btn-nav-backup" class="tool-circle-glass" title="${t('backup_title')}">
        <i data-lucide="folder-down" style="width: 16px; height: 16px; color: var(--ink-75);"></i>
      </button>

      <!-- Mobile QR -->
      <button id="btn-nav-qr" class="tool-circle-glass" title="${t('qr_title')}">
        <i data-lucide="qr-code" style="width: 16px; height: 16px; color: var(--ink-75);"></i>
      </button>
    </div>
  `;

  // Bind events
  container.querySelector('#btn-lang-selector')?.addEventListener('click', () => {
    const nextLang = currentLang === 'es' ? 'en' : 'es';
    storage.updateSettings({ lang: nextLang });
    window.location.reload();
  });

  container.querySelector('#btn-currency-selector')?.addEventListener('click', () => {
    let nextCurrency = 'USD';
    let nextSymbol = '$';
    
    if (currentCurrency === 'PEN') {
      nextCurrency = 'USD';
      nextSymbol = '$';
    } else {
      nextCurrency = 'PEN';
      nextSymbol = 'S/';
    }

    storage.updateSettings({ currency: nextCurrency, currencySymbol: nextSymbol });
    onCurrencyChange?.(nextCurrency, nextSymbol);
  });

  container.querySelector('#btn-nav-zen')?.addEventListener('click', () => {
    document.body.classList.toggle('zen-mode-active');
  });

  container.querySelector('#btn-nav-sync-update')?.addEventListener('click', () => {
    onCheckUpdates?.();
  });

  container.querySelector('#btn-nav-backup')?.addEventListener('click', () => {
    onOpenExportImport?.();
  });

  container.querySelector('#btn-nav-qr')?.addEventListener('click', () => {
    onOpenMobileQR?.();
  });

  createIcons({ icons });
}
