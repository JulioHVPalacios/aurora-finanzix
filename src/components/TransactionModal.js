/* ==========================================================================
   VALO OS - TRANSACTION MODAL (HIGH-END FINTECH BOTTOM SHEET)
   Clean Lucide Vector Icons & Perfectly Fitted Inputs with 100% i18n
   ========================================================================== */

import { storage, PAYMENT_METHODS } from '../services/storage.js';
import { createIcons, icons } from 'lucide';
import { t, formatCurrency, getCategoryName, getPaymentMethodName } from '../services/i18n.js';
import { enableHorizontalScroll } from '../utils/mouseDragScroll.js';

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
          <h3 class="sheet-title">${t('modal_tx_new')}</h3>
        </div>

        <!-- Segmented Type Selector -->
        <div class="segmented-control" style="margin-bottom: 14px;">
          <button type="button" class="segment-btn ${currentType === 'expense' ? 'active expense' : ''}" id="btn-type-expense">
            ${t('modal_tx_expense')}
          </button>
          <button type="button" class="segment-btn ${currentType === 'income' ? 'active income' : ''}" id="btn-type-income">
            ${t('modal_tx_income')}
          </button>
        </div>

        <form id="form-transaction">
          <!-- Amount Input -->
          <div class="form-group">
            <label class="form-label">
              <span>${t('modal_tx_amount')} (${symbol})</span>
            </label>
            <div style="position: relative; display: flex; align-items: center;">
              <span style="position: absolute; left: 14px; font-weight: 800; font-size: 1.3rem; color: ${currentType === 'income' ? '#059669' : '#DC2626'};">${symbol}</span>
              <input type="number" step="0.01" min="0.01" required id="tx-amount" class="input-control" style="padding-left: 48px; font-size: 1.4rem; font-weight: 800; color: ${currentType === 'income' ? '#059669' : '#DC2626'};" placeholder="0.00" autofocus />
            </div>
          </div>

          <!-- Description Input -->
          <div class="form-group">
            <label class="form-label">
              <span>${t('modal_tx_title')}</span>
            </label>
            <input type="text" id="tx-title" class="input-control" placeholder="${t('modal_tx_title_placeholder')}" required />
          </div>

          <!-- Receipt Attachment -->
          <div class="form-group">
            <label class="form-label">
              <span>${t('modal_tx_attach_receipt')}</span>
            </label>
            <div style="display: flex; gap: 8px;">
              <button type="button" class="btn" id="btn-attach-photo" style="background: #F8FAFC; color: #0F172A; width: 100%; border: 1px dashed rgba(15, 23, 42, 0.2); font-weight: 600;">
                <i data-lucide="camera" style="width: 16px; height: 16px; margin-right: 6px;"></i>
                ${t('modal_tx_attach_receipt')}
              </button>
              <input type="file" id="tx-photo-input" accept="image/*" style="display: none;" />
            </div>
            <div id="tx-photo-preview" style="margin-top: 8px; display: none;"></div>
          </div>

          <!-- Category Picker -->
          <div class="form-group" style="margin-bottom: 18px;">
            <label class="form-label">${t('modal_tx_category')}</label>
            <div id="cat-picker-container" style="
              display: flex;
              gap: 10px;
              overflow-x: auto;
              padding-bottom: 8px;
              margin: 0 -20px;
              padding-left: 20px;
              padding-right: 20px;
              -webkit-overflow-scrolling: touch;
            ">
              ${filteredCategories.map(cat => `
                <div class="cat-picker-item ${cat.id === selectedCategory ? 'selected' : ''}" data-cat-id="${cat.id}" style="
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  min-width: 76px;
                  height: 76px;
                  border-radius: 16px;
                  background: ${cat.id === selectedCategory ? '#0F172A' : '#F8FAFC'};
                  color: ${cat.id === selectedCategory ? '#FFFFFF' : '#64748B'};
                  border: 1px solid ${cat.id === selectedCategory ? '#0F172A' : 'rgba(15,23,42,0.08)'};
                  cursor: pointer;
                  scroll-snap-align: start;
                  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                  flex-shrink: 0;
                ">
                  <i data-lucide="${cat.icon || 'receipt'}" style="width: 22px; height: 22px; margin-bottom: 6px;"></i>
                  <span style="font-size: 0.65rem; font-weight: 700; text-align: center; line-height: 1.1; max-width: 68px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; white-space: normal;">
                    ${getCategoryName(cat)}
                  </span>
                </div>
              `).join('')}
            </div>
            
            <style>
              /* Hide scrollbar for the horizontal list */
              #cat-picker-container::-webkit-scrollbar { display: none; }
              #cat-picker-container { -ms-overflow-style: none; scrollbar-width: none; }
            </style>
          </div>

          <!-- Payment Method -->
          <div class="form-group">
            <label class="form-label">${t('modal_tx_payment_method')}</label>
            <select id="tx-payment-method" class="input-control">
              ${PAYMENT_METHODS.map(pm => `
                <option value="${pm.id}" ${pm.id === selectedPaymentMethod ? 'selected' : ''}>
                  ${getPaymentMethodName(pm)}
                </option>
              `).join('')}
            </select>
          </div>

          <!-- Date & Fixed Option -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">${t('modal_tx_date')}</label>
              <input type="date" id="tx-date" class="input-control" value="${new Date().toISOString().split('T')[0]}" />
            </div>
            <div class="form-group" style="margin-bottom: 0; justify-content: center;">
              <label class="form-label">${t('tx_fixed_tag')}</label>
              <label style="display: flex; align-items: center; gap: 8px; font-size: 0.78rem; cursor: pointer; height: 100%;">
                <input type="checkbox" id="tx-is-fixed" style="width: 16px; height: 16px; accent-color: #059669;" />
                <span>${t('modal_tx_is_fixed')}</span>
              </label>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-block" style="padding: 12px; font-size: 0.92rem; margin-top: 4px;">
            ${t('modal_tx_save')}
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
        
        // Reset all styles
        overlay.querySelectorAll('.cat-picker-item').forEach(i => {
          i.classList.remove('selected');
          i.style.background = '#F8FAFC';
          i.style.color = '#64748B';
          i.style.borderColor = 'rgba(15,23,42,0.08)';
        });
        
        // Apply active style
        item.classList.add('selected');
        item.style.background = '#0F172A';
        item.style.color = '#FFFFFF';
        item.style.borderColor = '#0F172A';
      });
    });

    const catPickerEl = overlay.querySelector('#cat-picker-container');
    if (catPickerEl) {
      enableHorizontalScroll(catPickerEl);
    }

    const photoBtn = overlay.querySelector('#btn-attach-photo');
    const photoInput = overlay.querySelector('#tx-photo-input');
    const photoPreview = overlay.querySelector('#tx-photo-preview');

    photoBtn?.addEventListener('click', () => photoInput?.click());
    photoInput?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          attachedPhoto = re.target.result;
          if (photoPreview) {
            photoPreview.style.display = 'block';
            photoPreview.innerHTML = `
              <div style="position: relative; display: inline-block;">
                <img src="${attachedPhoto}" style="max-height: 80px; border-radius: 8px; border: 1px solid rgba(15,23,42,0.1);" />
                <span style="position: absolute; top: -6px; right: -6px; background: #DC2626; color: white; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; font-size: 11px; cursor: pointer;" id="btn-remove-photo">✕</span>
              </div>
            `;
            photoPreview.querySelector('#btn-remove-photo')?.addEventListener('click', () => {
              attachedPhoto = null;
              photoPreview.style.display = 'none';
              photoPreview.innerHTML = '';
            });
          }
        };
        reader.readAsDataURL(file);
      }
    });

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
        isFixed,
        receiptPhoto: attachedPhoto
      });

      close();
      onSave?.(newTx);
    });

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

  // Swipe to dismiss logic
  let startY = 0;
  let currentY = 0;
  let isDragging = false;
  
  overlay.addEventListener('touchstart', (e) => {
    const sheet = overlay.querySelector('.bottom-sheet');
    if (!sheet) return;
    // Don't drag if scrolling inside a scrollable area unless at the top
    const isScrollable = e.target.closest('#cat-picker-container') || e.target.closest('select');
    if (isScrollable) return;

    startY = e.touches[0].clientY;
    isDragging = true;
    sheet.style.transition = 'none'; // Disable transition while dragging
  }, { passive: true });

  overlay.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const sheet = overlay.querySelector('.bottom-sheet');
    if (!sheet) return;

    currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;

    // Only allow dragging downwards
    if (deltaY > 0) {
      sheet.style.transform = `translateY(${deltaY}px)`;
    }
  }, { passive: true });

  overlay.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    
    const sheet = overlay.querySelector('.bottom-sheet');
    if (!sheet) return;
    
    const deltaY = currentY - startY;
    
    // Re-enable transitions
    sheet.style.transition = 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)';
    
    // If dragged down more than 100px, close the modal
    if (deltaY > 100) {
      sheet.style.transform = `translateY(100%)`;
      close();
    } else {
      // Snap back to original position
      sheet.style.transform = '';
    }
    
    // Reset values
    startY = 0;
    currentY = 0;
  });
}
