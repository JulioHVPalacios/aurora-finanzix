/* ==========================================================================
   AURORA FINANZIX - TOP NAVBAR COMPONENT
   ========================================================================== */

import { storage } from '../services/storage.js';
import { t } from '../services/i18n.js';

export function renderNavbar(container, { onOpenMobileQR, onOpenExportImport, onCurrencyChange, onCheckUpdates }) {
  const settings = storage.getSettings() || {};

  container.innerHTML = `
    <div class="navbar-user">
      <div class="user-avatar-glass">
        ${(settings.userName || 'A')[0].toUpperCase()}
      </div>
      <div>
        <div class="greeting-sub">Aurora Liquid OS</div>
        <div class="greeting-main">${settings.userName || t('nav_my_space')}</div>
      </div>
    </div>

    <div class="navbar-actions">
      <!-- Language Badge Chip -->
      <button id="btn-lang-selector" class="chip-glass" style="cursor: pointer; padding: 6px 10px; font-family: var(--font-mono); font-weight: 700; margin-right: 4px;" title="Cambiar Idioma">
        <span id="nav-lang-txt" style="color: #6366F1;">${settings.lang === 'en' ? 'EN' : 'ES'}</span>
      </button>

      <!-- Currency Badge Chip -->
      <button id="btn-currency-selector" class="chip-glass" style="cursor: pointer; padding: 6px 10px; font-family: var(--font-mono); font-weight: 700;" title="Cambiar Moneda">
        <span id="nav-currency-sym" style="color: #059669;">${settings.currencySymbol || 'S/'}</span>
      </button>

      <!-- Zen Mode Button -->
      <button id="btn-nav-zen" class="tool-circle-glass" title="Modo Privacidad (Zen)">
        <i data-lucide="eye-off" style="width: 17px; height: 17px; color: var(--ink-60);"></i>
      </button>

      <!-- Sync & Update Button -->
      <button id="btn-nav-sync-update" class="tool-circle-glass" title="Verificar Actualizaciones">
        <i data-lucide="refresh-cw" style="width: 17px; height: 17px; color: #4F46E5;"></i>
      </button>

      <!-- Backup / Export Tool Button -->
      <button id="btn-nav-backup" class="tool-circle-glass" title="Respaldos y Reportes">
        <i data-lucide="folder-down" style="width: 17px; height: 17px;"></i>
      </button>

      <!-- Mobile QR Tool Button -->
      <button id="btn-nav-qr" class="tool-circle-glass" title="Conectar Celular">
        <i data-lucide="qr-code" style="width: 17px; height: 17px;"></i>
      </button>
    </div>
  `;

  // Bind events
  container.querySelector('#btn-lang-selector')?.addEventListener('click', () => {
    const current = settings.lang || 'es';
    const next = current === 'es' ? 'en' : 'es';
    storage.updateSettings({ lang: next });
    window.location.reload(); // Reload to apply i18n everywhere
  });

  container.querySelector('#btn-currency-selector')?.addEventListener('click', () => {
    const current = settings.currency || 'PEN';
    let nextCurrency = 'USD';
    let nextSymbol = '$';
    
    if (current === 'PEN') {
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
}
