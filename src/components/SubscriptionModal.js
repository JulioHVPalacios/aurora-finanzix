/* ==========================================================================
   VALO OS - ADD / EDIT SUBSCRIPTION & FIXED BILL MODAL
   Complete Catalogue of Peru & Global Services, Custom Pricing & Logos
   ========================================================================== */

import { storage, POPULAR_SUBSCRIPTIONS_CATALOG, PAYMENT_METHODS } from '../services/storage.js';
import { t, formatCurrency, getPaymentMethodName } from '../services/i18n.js';
import { createIcons, icons } from 'lucide';

export function showSubscriptionModal({ onSave, subscriptionToEdit = null }) {
  const portal = document.getElementById('modal-portal');
  if (!portal) return;

  const settings = storage.getSettings() || {};
  const symbol = settings.currencySymbol || 'S/';

  let selectedPreset = subscriptionToEdit ? null : POPULAR_SUBSCRIPTIONS_CATALOG[0];
  let customName = subscriptionToEdit ? subscriptionToEdit.name : selectedPreset.name;
  let customAmount = subscriptionToEdit ? subscriptionToEdit.amount : selectedPreset.defaultAmount;
  let customPeriod = subscriptionToEdit ? (subscriptionToEdit.billingPeriod || 'monthly') : 'monthly';
  let customDay = subscriptionToEdit ? (subscriptionToEdit.renewalDay || 1) : 15;
  let customPaymentMethod = subscriptionToEdit ? (subscriptionToEdit.paymentMethod || 'debit') : 'debit';
  let customCategory = subscriptionToEdit ? (subscriptionToEdit.category || 'entertainment') : selectedPreset.category;
  let customColor = subscriptionToEdit ? (subscriptionToEdit.color || '#0F172A') : selectedPreset.color;
  let customIcon = subscriptionToEdit ? (subscriptionToEdit.icon || 'receipt') : selectedPreset.icon;
  let hasOfficialLogo = subscriptionToEdit ? (subscriptionToEdit.hasOfficialLogo !== false) : selectedPreset.hasOfficialLogo;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  function renderModal() {
    overlay.innerHTML = `
      <div class="bottom-sheet" style="max-height: 90vh; overflow-y: auto;">
        <div class="sheet-handle"></div>
        <div class="sheet-header">
          <h3 class="sheet-title">${subscriptionToEdit ? 'Editar Pago Fijo' : 'Añadir Servicio / Suscripción'}</h3>
          <button type="button" class="sheet-close-btn" id="btn-sub-close">
            <i data-lucide="x" style="width: 18px; height: 18px;"></i>
          </button>
        </div>

        <!-- Presets Carousel / Grid -->
        ${!subscriptionToEdit ? `
          <div class="form-group" style="margin-bottom: 12px;">
            <label class="form-label">Servicios Populares (Perú e Internacional)</label>
            <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; -webkit-overflow-scrolling: touch; scrollbar-width: none;">
              ${POPULAR_SUBSCRIPTIONS_CATALOG.map(item => `
                <button type="button" class="btn-preset-service ${selectedPreset?.id === item.id ? 'active' : ''}" data-id="${item.id}" style="
                  flex-shrink: 0;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 4px;
                  background: ${selectedPreset?.id === item.id ? '#0F172A' : '#F8FAFC'};
                  color: ${selectedPreset?.id === item.id ? '#FFFFFF' : 'var(--ink)'};
                  border: 1px solid ${selectedPreset?.id === item.id ? '#0F172A' : 'rgba(15, 23, 42, 0.08)'};
                  border-radius: 14px;
                  padding: 8px 10px;
                  min-width: 72px;
                  cursor: pointer;
                  transition: all 0.2s ease;
                ">
                  <div style="width: 28px; height: 28px; border-radius: 8px; background: ${item.color}20; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    ${item.hasOfficialLogo ? `
                      <img src="https://cdn.simpleicons.org/${item.icon}/${item.color.replace('#','')}" alt="${item.name}" style="width: 18px; height: 18px;" onerror="this.style.display='none'" />
                    ` : `
                      <i data-lucide="${item.icon || 'receipt'}" style="width: 15px; height: 15px; color: ${item.color};"></i>
                    `}
                  </div>
                  <span style="font-size: 0.68rem; font-weight: 700; max-width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    ${item.name}
                  </span>
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <form id="form-sub-record" style="display: flex; flex-direction: column; gap: 12px;">
          <!-- Service Name -->
          <div class="form-group">
            <label class="form-label">Nombre del Servicio / Pago Fijo</label>
            <input type="text" id="sub-input-name" class="input-control" value="${customName}" placeholder="Ej: Netflix, Gimnasio, Alquiler, WIN..." required />
          </div>

          <!-- Amount Input -->
          <div class="form-group">
            <label class="form-label">Costo por Periodo (${symbol})</label>
            <div style="position: relative; display: flex; align-items: center;">
              <span style="position: absolute; left: 14px; font-weight: 800; font-size: 1.2rem; color: #0F172A;">${symbol}</span>
              <input type="number" step="0.1" min="0.5" id="sub-input-amount" class="input-control" value="${customAmount}" style="padding-left: 46px; font-size: 1.3rem; font-weight: 800;" placeholder="0.00" required />
            </div>
            <span style="font-size: 0.68rem; color: var(--ink-40); margin-top: 2px;">Puedes ajustar el costo exacto de tu plan personal.</span>
          </div>

          <!-- Billing Period & Renewal Day -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="form-group">
              <label class="form-label">Frecuencia de Cobro</label>
              <select id="sub-input-period" class="input-control">
                <option value="monthly" ${customPeriod === 'monthly' ? 'selected' : ''}>Mensual</option>
                <option value="yearly" ${customPeriod === 'yearly' ? 'selected' : ''}>Anual</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Día de Cobro (del mes)</label>
              <input type="number" id="sub-input-day" class="input-control" min="1" max="31" value="${customDay}" required />
            </div>
          </div>

          <!-- Payment Method -->
          <div class="form-group">
            <label class="form-label">Método de Pago Vinculado</label>
            <select id="sub-input-payment" class="input-control">
              ${PAYMENT_METHODS.map(pm => `
                <option value="${pm.id}" ${pm.id === customPaymentMethod ? 'selected' : ''}>
                  ${getPaymentMethodName(pm)}
                </option>
              `).join('')}
            </select>
          </div>

          <button type="submit" class="btn btn-primary btn-block" style="padding: 12px; font-size: 0.92rem; font-weight: 700; margin-top: 4px;">
            ${subscriptionToEdit ? 'Guardar Cambios' : '+ Añadir a Pagos Fijos'}
          </button>
        </form>
      </div>
    `;

    createIcons({ icons, nameAttr: 'data-lucide', root: overlay });

    // Handle Presets selection
    overlay.querySelectorAll('.btn-preset-service').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const found = POPULAR_SUBSCRIPTIONS_CATALOG.find(p => p.id === id);
        if (found) {
          selectedPreset = found;
          customName = found.name;
          customAmount = found.defaultAmount;
          customCategory = found.category;
          customColor = found.color;
          customIcon = found.icon;
          hasOfficialLogo = found.hasOfficialLogo;
          renderModal();
        }
      });
    });

    overlay.querySelector('#btn-sub-close')?.addEventListener('click', close);

    overlay.querySelector('#form-sub-record')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = overlay.querySelector('#sub-input-name').value.trim();
      const amount = Number(overlay.querySelector('#sub-input-amount').value) || 0;
      const period = overlay.querySelector('#sub-input-period').value;
      const day = Number(overlay.querySelector('#sub-input-day').value) || 1;
      const paymentMethod = overlay.querySelector('#sub-input-payment').value;

      if (!name || amount <= 0) return;

      const subData = {
        name,
        amount,
        billingPeriod: period,
        renewalDay: day,
        paymentMethod,
        category: customCategory || 'entertainment',
        color: customColor || '#0F172A',
        icon: customIcon || 'receipt',
        hasOfficialLogo: !!hasOfficialLogo
      };

      if (subscriptionToEdit) {
        const all = storage.getSubscriptions();
        const idx = all.findIndex(s => s.id === subscriptionToEdit.id);
        if (idx >= 0) {
          all[idx] = { ...all[idx], ...subData };
          storage.saveSubscriptions(all);
        }
      } else {
        storage.addSubscription(subData);
      }

      onSave?.();
      close();
    });
  }

  function close() {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 280);
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  portal.appendChild(overlay);
  renderModal();
  requestAnimationFrame(() => overlay.classList.add('active'));
}
