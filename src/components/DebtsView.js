/* ==========================================================================
   AURORA FINANZIX - LOANS & DEBTS MANAGER (HIGH-END FINTECH LEDGER)
   ========================================================================== */

import { t, formatCurrency } from '../services/i18n.js';
import { createIcons, icons } from 'lucide';

export function renderDebts(container) {
  container.innerHTML = `
    <div class="view-transition-wrap" style="padding: 16px;">
      <div style="text-align: center; margin-bottom: 24px; padding-top: 10px;">
        <div style="display: inline-flex; align-items: center; justify-content: center; width: 52px; height: 52px; background: #0F172A; border-radius: 16px; color: #FFFFFF; margin-bottom: 14px; box-shadow: 0 8px 16px rgba(15, 23, 42, 0.15);">
          <i data-lucide="hand-coins" style="width: 26px; height: 26px;"></i>
        </div>
        <h2 style="font-family: var(--font-display); font-weight: 800; font-size: 1.4rem; color: var(--ink); letter-spacing: -0.5px;">
          ${t('debt_title')}
        </h2>
        <p style="color: var(--ink-60); font-size: 0.85rem; margin-top: 4px;">${t('debt_desc')}</p>
      </div>

      <!-- Quick Action Buttons -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
        <button class="btn" style="background: #F0FDF4; color: #059669; border: 1px solid rgba(5, 150, 105, 0.2); font-weight: 700;">
          <i data-lucide="arrow-down-left" style="width: 16px; height: 16px; margin-right: 6px;"></i>
          ${t('debt_owed_to_me')}
        </button>
        <button class="btn" style="background: #FEF2F2; color: #DC2626; border: 1px solid rgba(220, 38, 38, 0.2); font-weight: 700;">
          <i data-lucide="arrow-up-right" style="width: 16px; height: 16px; margin-right: 6px;"></i>
          ${t('debt_i_owe')}
        </button>
      </div>

      <!-- Cards -->
      <div style="display: grid; gap: 14px;">
        <!-- Me Deben -->
        <div style="background: #FFFFFF; border: 1px solid rgba(15, 23, 42, 0.08); border-left: 4px solid #059669; border-radius: 16px; padding: 16px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.02);">
          <div>
            <div style="font-weight: 700; color: var(--ink); font-size: 1rem;">Carlos M.</div>
            <div style="color: #059669; font-size: 0.74rem; font-weight: 600; margin-top: 2px;">
              ${t('debt_owed_to_me')} (${t('debt_type_loan')})
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 800; font-family: var(--font-mono); color: #059669; font-size: 1.05rem;">
              +${formatCurrency(150)}
            </div>
          </div>
        </div>

        <!-- Yo Debo -->
        <div style="background: #FFFFFF; border: 1px solid rgba(15, 23, 42, 0.08); border-left: 4px solid #DC2626; border-radius: 16px; padding: 16px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.02);">
          <div>
            <div style="font-weight: 700; color: var(--ink); font-size: 1rem;">Banco (Tarjeta)</div>
            <div style="color: #DC2626; font-size: 0.74rem; font-weight: 600; margin-top: 2px;">
              ${t('debt_i_owe')} (Cuota 1/3)
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 800; font-family: var(--font-mono); color: #DC2626; font-size: 1.05rem;">
              -${formatCurrency(85)}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  createIcons({ icons });
}
