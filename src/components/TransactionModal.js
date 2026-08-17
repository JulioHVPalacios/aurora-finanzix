/* ==========================================================================
   AURORA LIQUID GLASS - TRANSACTION MODAL (BOTTOM SHEET)
   Clean Lucide Vector Icons & Perfectly Fitted Inputs
   ========================================================================== */

import { storage, PAYMENT_METHODS } from '../services/storage.js';
import { createIcons, icons } from 'lucide';
import { t, formatCurrency } from '../services/i18n.js';

export function showTransactionModal({ initialType = 'expense', onSave, onClose }) {
  const portal = document.getElementById('modal-portal');
  if (!portal) return;

  const categories = storage.getCategories();
  const settings = storage.getSettings();
  const symbol = settings.currencySymbol || 'S/';

  let currentType = initialType;
  let selectedCategory = categories.find(c => c.type === currentType)?.id || 'food';
  let selectedPaymentMethod = 'cash';
  let attachedPhoto = null;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  function renderForm() {
    const filteredCategories = categories.filter(c => c.type === currentType);
    if (!filteredCategories.some(c => c.id === selectedCategory)) {
      selectedCategory = filteredCategories[0]?.id || 'other_exp';
    }

    overlay.innerHTML = `
      <div class="bottom-sheet">
        <div class="sheet-handle"></div>
        <div class="sheet-header">
          <h3 class="sheet-title">${t('tx_new')}</h3>
          <button type="button" class="sheet-close-btn" id="btn-sheet-close">✕</button>
        </div>

        <!-- Segmented Type Selector -->
        <div class="segmented-control" style="margin-bottom: 14px;">
          <button type="button" class="segment-btn ${currentType === 'expense' ? 'active expense' : ''}" id="btn-type-expense">
            ${t('tx_type_expense')}
          </button>
          <button type="button" class="segment-btn ${currentType === 'income' ? 'active income' : ''}" id="btn-type-income">
            ${t('tx_type_income')}
          </button>
        </div>

        <form id="form-transaction">
          <!-- Amount Input -->
          <div class="form-group">
            <label class="form-label">
              <span>${t('tx_amount')} (${symbol})</span>
            </label>
            <div style="position: relative; display: flex; align-items: center;">
              <span style="position: absolute; left: 14px; font-weight: 800; font-size: 1.3rem; color: ${currentType === 'income' ? '#059669' : '#DC2626'};">${symbol}</span>
              <input type="number" step="0.01" min="0.01" required id="tx-amount" class="input-control" style="padding-left: 48px; font-size: 1.4rem; font-weight: 800; color: ${currentType === 'income' ? '#059669' : '#DC2626'};" placeholder="0.00" autofocus />
            </div>
          </div>

          <!-- Description Input -->
          <div class="form-group">
            <label class="form-label">
              <span>${t('tx_desc')}</span>
            </label>
            <input type="text" id="tx-title" class="input-control" placeholder="Ej. Almuerzo, Uber, Sueldo..." required />
          </div>

          <!-- Receipt Attachment (ezBookkeeping style) -->
          <div class="form-group">
            <label class="form-label">
              <span>Adjuntar Recibo / Foto</span>
            </label>
            <div style="display: flex; gap: 8px;">
              <button type="button" class="btn" id="btn-attach-photo" style="background: rgba(99, 102, 241, 0.1); color: #4F46E5; width: 100%; border: 1px dashed rgba(99, 102, 241, 0.4);">
                <i data-lucide="camera" style="width: 16px; height: 16px; margin-right: 6px;"></i>
                Tomar Foto / Subir
              </button>
              <input type="file" id="tx-photo-input" accept="image/*" style="display: none;" />
            </div>
            <div id="tx-photo-preview" style="margin-top: 8px; display: none;"></div>
          </div>
          <!-- Receipt Attachment (ezBookkeeping style) -->
          <div class="form-group">
            <label class="form-label">Categoría</label>
            <div class="category-picker-grid" id="cat-picker-container">
              ${filteredCategories.map(cat => `
                <div class="cat-picker-item ${cat.id === selectedCategory ? 'selected' : ''}" data-cat-id="${cat.id}">
                  <div class="cat-picker-icon-wrap" style="background: ${cat.color || '#4F46E5'};">
                    <i data-lucide="${cat.icon || 'receipt'}" style="width: 17px; height: 17px;"></i>
                  </div>
                  <span class="cat-picker-label">${cat.name}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Payment Method -->
          <div class="form-group">
            <label class="form-label">Método de Pago</label>
            <select id="tx-payment-method" class="input-control">
              ${PAYMENT_METHODS.map(pm => `
                <option value="${pm.id}" ${pm.id === selectedPaymentMethod ? 'selected' : ''}>
                  ${pm.name}
                </option>
              `).join('')}
            </select>
          </div>

          <!-- Date & Fixed Option -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Fecha</label>
              <input type="date" id="tx-date" class="input-control" value="${new Date().toISOString().split('T')[0]}" />
            </div>
            <div class="form-group" style="margin-bottom: 0; justify-content: center;">
              <label class="form-label">Tipo</label>
              <label style="display: flex; align-items: center; gap: 8px; font-size: 0.78rem; cursor: pointer; height: 100%;">
                <input type="checkbox" id="tx-is-fixed" style="width: 16px; height: 16px; accent-color: #10B981;" />
                <span>¿Es Fijo Mensual?</span>
              </label>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-block" style="padding: 12px; font-size: 0.92rem; margin-top: 4px;">
            Guardar ${currentType === 'income' ? 'Ingreso' : 'Gasto'}
          </button>
        </form>
      </div>
    `;

    overlay.querySelector('#btn-type-expense')?.addEventListener('click', () => {
      currentType = 'expense';
      renderForm();
    });

    overlay.querySelector('#btn-type-income')?.addEventListener('click', () => {
      currentType = 'income';
      renderForm();
    });

    overlay.querySelectorAll('.cat-picker-item').forEach(item => {
      item.addEventListener('click', () => {
        selectedCategory = item.getAttribute('data-cat-id');
        overlay.querySelectorAll('.cat-picker-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
      });
    });

    overlay.querySelector('#btn-sheet-close')?.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    const form = overlay.querySelector('#form-transaction');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = parseFloat(overlay.querySelector('#tx-amount').value);
      const title = overlay.querySelector('#tx-title').value.trim();
      const paymentMethod = overlay.querySelector('#tx-payment-method').value;
      const date = overlay.querySelector('#tx-date').value;
      const isFixed = overlay.querySelector('#tx-is-fixed').checked;

      if (!amount || amount <= 0 || !title) return;

      const newTx = storage.addTransaction({
        type: currentType,
        amount,
        title,
        category: selectedCategory,
        paymentMethod,
        date,
        isFixed
      });

      close();
      onSave?.(newTx);
    });

    // Render lucide icons in the newly created modal elements
    createIcons({ icons, nameAttr: 'data-lucide', root: overlay });
  }

  function close() {
    overlay.classList.remove('active');
    setTimeout(() => {
      overlay.remove();
      onClose?.();
    }, 280);
  }

  portal.appendChild(overlay);
  renderForm();
  
  requestAnimationFrame(() => {
    overlay.classList.add('active');
    overlay.querySelector('#tx-amount')?.focus();
  });
}
