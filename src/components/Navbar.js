/* ==========================================================================
   AURORA LIQUID GLASS - TOP NAVBAR COMPONENT
   ========================================================================== */

import { storage } from '../services/storage.js';

export function renderNavbar(container, { onOpenMobileQR, onOpenExportImport, onCurrencyChange }) {
  const settings = storage.getSettings();

  container.innerHTML = `
    <div class="navbar-user">
      <div class="user-avatar-glass">
        ${(settings.userName || 'A')[0].toUpperCase()}
      </div>
      <div>
        <div class="greeting-sub">Aurora Liquid OS</div>
        <div class="greeting-main">${settings.userName || 'Mi Espacio'}</div>
      </div>
    </div>

    <div class="navbar-actions">
      <!-- Currency Badge Chip -->
      <button id="btn-currency-selector" class="chip-glass" style="cursor: pointer; padding: 6px 12px; font-family: var(--font-mono); font-weight: 700;" title="Cambiar Moneda">
        <span id="nav-currency-sym" style="color: #6EE7B7;">${settings.currencySymbol || 'S/'}</span>
        <span style="font-size: 0.65rem; color: var(--ink-40); margin-left: 2px;">▼</span>
      </button>

      <!-- Backup / Export Tool Button -->
      <button id="btn-nav-backup" class="tool-circle-glass" title="Respaldos y Reportes">
        <i data-lucide="folder-down" style="width: 18px; height: 18px;"></i>
      </button>

      <!-- Mobile QR Tool Button -->
      <button id="btn-nav-qr" class="tool-circle-glass" title="Conectar Celular">
        <i data-lucide="qr-code" style="width: 18px; height: 18px;"></i>
      </button>
    </div>
  `;

  // Bind events
  container.querySelector('#btn-currency-selector')?.addEventListener('click', () => {
    const current = settings.currency || 'PEN';
    let nextCurrency = 'USD';
    let nextSymbol = '$';
    
    if (current === 'PEN') {
      nextCurrency = 'USD';
      nextSymbol = '$';
    } else if (current === 'USD') {
      nextCurrency = 'EUR';
      nextSymbol = '€';
    } else {
      nextCurrency = 'PEN';
      nextSymbol = 'S/';
    }

    storage.updateSettings({ currency: nextCurrency, currencySymbol: nextSymbol });
    onCurrencyChange?.(nextCurrency, nextSymbol);
  });

  container.querySelector('#btn-nav-backup')?.addEventListener('click', onOpenExportImport);
  container.querySelector('#btn-nav-qr')?.addEventListener('click', onOpenMobileQR);
}
