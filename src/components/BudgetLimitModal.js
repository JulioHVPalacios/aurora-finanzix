/* ==========================================================================
   VALO OS - MONTHLY BUDGET LIMIT MODAL
   Set Monthly Spending Cap, Quick Presets & Financial Pace Tracking
   ========================================================================== */

import { storage } from '../services/storage.js';
import { t, formatCurrency } from '../services/i18n.js';
import { createIcons, icons } from 'lucide';

export function showBudgetLimitModal({ onSave = null } = {}) {
  const portal = document.getElementById('modal-portal') || document.body;
  const settings = storage.getSettings() || {};
  const symbol = settings.currencySymbol || 'S/';
  const currentLimit = settings.monthlyBudget || 0;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  overlay.innerHTML = `
    <div class="bottom-sheet" style="max-width: 420px;">
      <div class="sheet-handle"></div>
      <div class="sheet-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 32px; height: 32px; border-radius: 10px; background: rgba(79, 70, 229, 0.1); color: #4F46E5; display: flex; align-items: center; justify-content: center;">
            <i data-lucide="target" style="width: 18px; height: 18px;"></i>
          </div>
          <h3 class="sheet-title" style="margin: 0; font-size: 1.05rem; font-weight: 800; color: #0F172A;">Fijar Presupuesto Mensual</h3>
        </div>
        <button type="button" class="sheet-close-btn" id="btn-close-budget-modal" aria-label="Cerrar">
          <i data-lucide="x" style="width: 18px; height: 18px;"></i>
        </button>
      </div>

      <p style="font-size: 0.78rem; color: #64748B; margin: 4px 0 16px; line-height: 1.45;">
        Establece tu techo máximo de gastos para el mes. Te servirá para medir tu velocidad de gasto diario y mantener tus finanzas bajo control.
      </p>

      <!-- Budget Input -->
      <div class="form-group" style="margin-bottom: 14px;">
        <label class="form-label" style="font-size: 0.72rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em;">Límite Mensual (${symbol})</label>
        <div style="position: relative; display: flex; align-items: center;">
          <span style="position: absolute; left: 16px; font-weight: 800; font-size: 1.1rem; color: #64748B; font-family: var(--font-mono);">${symbol}</span>
          <input type="number" id="input-budget-limit" class="input-control" value="${currentLimit > 0 ? currentLimit : ''}" placeholder="2500" min="1" step="50" style="padding-left: 48px; font-size: 1.25rem; font-weight: 800; font-family: var(--font-mono); color: #0F172A;" />
        </div>
      </div>

      <!-- Quick Preset Chips -->
      <div style="margin-bottom: 18px;">
        <label class="form-label" style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 6px;">Sugerencias Rápidas</label>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <button type="button" class="btn-preset-budget" data-val="1000" style="background: #F1F5F9; border: 1px solid #E2E8F0; border-radius: 999px; padding: 5px 12px; font-size: 0.76rem; font-weight: 700; color: #334155; cursor: pointer;">${symbol}1,000</button>
          <button type="button" class="btn-preset-budget" data-val="2000" style="background: #F1F5F9; border: 1px solid #E2E8F0; border-radius: 999px; padding: 5px 12px; font-size: 0.76rem; font-weight: 700; color: #334155; cursor: pointer;">${symbol}2,000</button>
          <button type="button" class="btn-preset-budget" data-val="3000" style="background: #F1F5F9; border: 1px solid #E2E8F0; border-radius: 999px; padding: 5px 12px; font-size: 0.76rem; font-weight: 700; color: #334155; cursor: pointer;">${symbol}3,000</button>
          <button type="button" class="btn-preset-budget" data-val="5000" style="background: #F1F5F9; border: 1px solid #E2E8F0; border-radius: 999px; padding: 5px 12px; font-size: 0.76rem; font-weight: 700; color: #334155; cursor: pointer;">${symbol}5,000</button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; gap: 8px;">
        ${currentLimit > 0 ? `
          <button type="button" id="btn-clear-budget" class="btn btn-secondary" style="flex: 1; padding: 12px; font-size: 0.85rem; font-weight: 700;">
            Quitar Límite
          </button>
        ` : ''}
        <button type="button" id="btn-save-budget" class="btn btn-primary" style="flex: 2; padding: 12px; font-size: 0.88rem; font-weight: 800; background: #0F172A; color: #FFFFFF;">
          Guardar Presupuesto
        </button>
      </div>
    </div>
  `;

  portal.appendChild(overlay);
  createIcons({ icons, root: overlay });

  // Focus input
  const inputEl = overlay.querySelector('#input-budget-limit');
  inputEl?.focus();

  // Close logic
  const closeModal = () => {
    overlay.classList.add('closing');
    setTimeout(() => overlay.remove(), 250);
  };

  overlay.querySelector('#btn-close-budget-modal')?.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Preset chips click
  overlay.querySelectorAll('.btn-preset-budget').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.val;
      if (inputEl && val) {
        inputEl.value = val;
        inputEl.focus();
      }
    });
  });

  // Clear budget button
  overlay.querySelector('#btn-clear-budget')?.addEventListener('click', () => {
    storage.updateSettings({ monthlyBudget: 0 });
    window.dispatchEvent(new CustomEvent('finanzix:data-changed'));
    closeModal();
    onSave?.(0);
  });

  // Save budget button
  overlay.querySelector('#btn-save-budget')?.addEventListener('click', () => {
    const val = Number(inputEl?.value) || 0;
    if (val < 0) return;
    storage.updateSettings({ monthlyBudget: val });
    window.dispatchEvent(new CustomEvent('finanzix:data-changed'));
    closeModal();
    onSave?.(val);
  });
}
