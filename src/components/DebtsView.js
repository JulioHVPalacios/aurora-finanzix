/* ==========================================================================
   AURORA FINANZIX - LOANS & DEBTS MANAGER (Paisa Style)
   ========================================================================== */

import { t, formatCurrency } from '../services/i18n.js';
import { createIcons, icons } from 'lucide';

export function renderDebts(container) {
  container.innerHTML = `
    <div class="view-transition-wrap" style="padding: 16px;">
      <div style="text-align: center; margin-bottom: 24px; padding-top: 10px;">
        <div style="display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; background: linear-gradient(135deg, #ECFDF5, #D1FAE5); border-radius: 20px; color: #10B981; margin-bottom: 16px; box-shadow: 0 8px 16px rgba(16, 185, 129, 0.15);">
          <i data-lucide="hand-coins" style="width: 28px; height: 28px;"></i>
        </div>
        <h2 style="font-family: var(--font-display); font-weight: 800; font-size: 1.5rem; color: var(--ink); letter-spacing: -0.5px;">${t('debt_title')}</h2>
        <p style="color: var(--ink-60); font-size: 0.9rem; margin-top: 6px;">${t('debt_desc')}</p>
      </div>

      <!-- Quick Action Buttons -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;">
        <button class="btn" style="background: rgba(16, 185, 129, 0.1); color: #059669; border: 1px solid rgba(16, 185, 129, 0.2); font-weight: 700;">
          <i data-lucide="arrow-down-left" style="width: 16px; height: 16px; margin-right: 6px;"></i>
          Me deben
        </button>
        <button class="btn" style="background: rgba(239, 68, 68, 0.1); color: #DC2626; border: 1px solid rgba(239, 68, 68, 0.2); font-weight: 700;">
          <i data-lucide="arrow-up-right" style="width: 16px; height: 16px; margin-right: 6px;"></i>
          Yo debo
        </button>
      </div>

      <!-- Mock Cards (Paisa Style) -->
      <div style="display: grid; gap: 16px;">
        <!-- Me Deben -->
        <div style="background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(16, 185, 129, 0.2); border-left: 4px solid #10B981; border-radius: 16px; padding: 16px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
          <div>
            <div style="font-weight: 700; color: var(--ink); font-size: 1.05rem;">Carlos M.</div>
            <div style="color: #059669; font-size: 0.75rem; font-weight: 600; margin-top: 2px;">Me debe (Préstamo)</div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 800; font-family: var(--font-mono); color: #059669; font-size: 1.1rem;">+${formatCurrency(150)}</div>
          </div>
        </div>

        <!-- Yo Debo -->
        <div style="background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(239, 68, 68, 0.2); border-left: 4px solid #EF4444; border-radius: 16px; padding: 16px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
          <div>
            <div style="font-weight: 700; color: var(--ink); font-size: 1.05rem;">Banco (Tarjeta)</div>
            <div style="color: #DC2626; font-size: 0.75rem; font-weight: 600; margin-top: 2px;">Yo debo (Cuota 1/3)</div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 800; font-family: var(--font-mono); color: #DC2626; font-size: 1.1rem;">-${formatCurrency(85)}</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  createIcons({ icons });
}
