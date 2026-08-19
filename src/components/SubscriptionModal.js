/* ==========================================================================
   VALO OS - ADVANCED MULTI-COUNTRY RECURRING SERVICES & BILLS MODAL
   Country-Aware Catalogues, Real Logos, Live Search, Category Filters
   ========================================================================== */

import { storage, PAYMENT_METHODS } from '../services/storage.js';
import { getServicesForCountry, SERVICE_CATEGORIES } from '../services/servicesCatalog.js';
import { t, formatCurrency, getPaymentMethodName } from '../services/i18n.js';
import { createIcons, icons } from 'lucide';
import { t } from '../services/i18n.js';

export function showSubscriptionModal({ onSave, subscriptionToEdit = null }) {
  const portal = document.getElementById('modal-portal');
  if (!portal) return;

  const settings = storage.getSettings() || {};
  const symbol = settings.currencySymbol || 'S/';
  const userCountry = settings.userCountry || 'Perú';

  // State
  let selectedCountry = userCountry; // Strict lock to user's country
  let selectedCategory = 'all';
  let searchQuery = '';

  let currentServicesList = getServicesForCountry(selectedCountry);
  let selectedPreset = subscriptionToEdit ? null : null; // No default preset selected initially

  let customName = subscriptionToEdit ? subscriptionToEdit.name : '';
  let customAmount = subscriptionToEdit ? subscriptionToEdit.amount : '';
  let customPeriod = subscriptionToEdit ? (subscriptionToEdit.billingPeriod || 'monthly') : 'monthly';
  let customDay = subscriptionToEdit ? (subscriptionToEdit.renewalDay || 1) : 15;
  let customPaymentMethod = subscriptionToEdit ? (subscriptionToEdit.paymentMethod || 'debit') : 'debit';
  let customCategory = subscriptionToEdit ? (subscriptionToEdit.category || 'entertainment') : 'entertainment';
  let customColor = subscriptionToEdit ? (subscriptionToEdit.color || '#0F172A') : '#0F172A';
  let customIcon = subscriptionToEdit ? (subscriptionToEdit.icon || 'receipt') : 'receipt';
  let hasOfficialLogo = subscriptionToEdit ? (subscriptionToEdit.hasOfficialLogo !== false) : true;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  function filterServices() {
    currentServicesList = getServicesForCountry(selectedCountry);
    return currentServicesList.filter(item => {
      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }

  function renderModal() {
    const filtered = filterServices();

    overlay.innerHTML = `
      <div class="bottom-sheet" style="max-height: 90vh; overflow-y: auto; -webkit-overflow-scrolling: touch;">
        <div class="sheet-handle"></div>
        <div class="sheet-header" style="margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 32px; height: 32px; border-radius: 10px; background: #0F172A; color: #FFFFFF; display: flex; align-items: center; justify-content: center;">
              <i data-lucide="${subscriptionToEdit ? 'edit-3' : 'plus-circle'}" style="width: 17px; height: 17px;"></i>
            </div>
            <div>
              <h3 class="sheet-title" style="margin: 0;">${subscriptionToEdit ? '${t('sub_edit')}' : '${t('sub_add')}'}</h3>
              <div style="font-size: 0.70rem; color: var(--ink-60);">${t('sub_catalog')} para ${selectedCountry}</div>
            </div>
          </div>
          <button type="button" class="sheet-close-btn" id="btn-sub-close">
            <i data-lucide="x" style="width: 18px; height: 18px;"></i>
          </button>
        </div>

        ${!subscriptionToEdit ? `
          <!-- Search Bar -->
          <div style="margin-bottom: 10px;">
            <div style="position: relative; display: flex; align-items: center;">
              <i data-lucide="search" style="position: absolute; left: 12px; width: 15px; height: 15px; color: var(--ink-40); pointer-events: none;"></i>
              <input type="text" id="sub-search-input" class="input-control" value="${searchQuery}" placeholder="Buscar servicio: Sedapal, Luz del Sur, WIN, Netflix, BCP..." style="padding-left: 36px; padding-top: 9px; padding-bottom: 9px; font-size: 0.82rem; border-radius: 12px;" />
              ${searchQuery ? `
                <button type="button" id="btn-clear-search" style="position: absolute; right: 10px; background: none; border: none; color: var(--ink-40); cursor: pointer; padding: 2px;">
                  <i data-lucide="x" style="width: 14px; height: 14px;"></i>
                </button>
              ` : ''}
            </div>
          </div>

          <!-- Category Filter Tabs -->
          <div style="display: flex; gap: 8px; overflow-x: auto; padding: 4px 2px 10px 2px; margin-bottom: 12px; scrollbar-width: none; -webkit-overflow-scrolling: touch; box-sizing: border-box;">
            ${SERVICE_CATEGORIES.map(cat => `
              <button type="button" class="btn-cat-chip ${selectedCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}" style="
                flex-shrink: 0;
                height: 36px;
                padding: 0 14px;
                border-radius: 12px;
                font-size: 0.76rem;
                font-weight: 600;
                border: 1.5px solid ${selectedCategory === cat.id ? '#4F46E5' : 'rgba(15, 23, 42, 0.08)'};
                background: ${selectedCategory === cat.id ? '#EEF2FF' : '#FFFFFF'};
                color: ${selectedCategory === cat.id ? '#4F46E5' : 'var(--ink-60)'};
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                white-space: nowrap;
                box-sizing: border-box;
                line-height: 1;
                transition: all 0.15s;
              ">
                <span>${cat.name}</span>
              </button>
            `).join('')}
          </div>

          <!-- Presets Grid / Carousel -->
          <div style="margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; margin-top: 2px;">
              <span style="font-size: 0.72rem; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em;">
                ${t('sub_catalog')} (${filtered.length})
              </span>
              <span style="font-size: 0.68rem; color: var(--ink-40);">Toca para autocompletar</span>
            </div>

            <div id="sub-presets-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(105px, 1fr)); gap: 8px; max-height: 160px; overflow-y: auto; padding: 8px; border: 1px solid rgba(15, 23, 42, 0.08); border-radius: 14px; background: #FAFBFD; -webkit-overflow-scrolling: touch;">
              ${filtered.length === 0 ? `
                <div style="grid-column: 1 / -1; text-align: center; padding: 18px; color: var(--ink-40); font-size: 0.78rem;">
                  No se encontraron servicios para "${searchQuery}".<br/>Puedes escribir el nombre personalizado abajo.
                </div>
              ` : filtered.map(item => {
                const isSelected = selectedPreset?.id === item.id;
                return `
                  <button type="button" class="btn-preset-service ${isSelected ? 'active' : ''}" data-id="${item.id}" style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    gap: 4px;
                    background: ${isSelected ? '#0F172A' : '#FFFFFF'};
                    color: ${isSelected ? '#FFFFFF' : 'var(--ink)'};
                    border: 1.5px solid ${isSelected ? '#0F172A' : 'rgba(15, 23, 42, 0.08)'};
                    border-radius: 12px;
                    padding: 8px 6px;
                    cursor: pointer;
                    transition: all 0.15s ease;
                    box-shadow: ${isSelected ? '0 4px 10px rgba(15, 23, 42, 0.2)' : '0 1px 3px rgba(0,0,0,0.02)'};
                    min-height: 68px;
                  ">
                    <div style="width: 28px; height: 28px; border-radius: 8px; background: ${isSelected ? 'rgba(255,255,255,0.15)' : item.color + '15'}; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid ${isSelected ? 'rgba(255,255,255,0.25)' : item.color + '30'};">
                      ${item.hasOfficialLogo ? `
                        <img src="https://cdn.simpleicons.org/${item.icon}/${(item.color || '000000').replace('#','')}" alt="${item.name}" style="width: 17px; height: 17px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                        <div style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; color: ${isSelected ? '#FFFFFF' : item.color}; font-weight: 800; font-size: 0.72rem;">
                          ${item.name.substring(0, 2).toUpperCase()}
                        </div>
                      ` : `
                        <div style="color: ${isSelected ? '#FFFFFF' : item.color}; font-weight: 800; font-size: 0.72rem; display: flex; align-items: center; justify-content: center;">
                          ${item.name.substring(0, 2).toUpperCase()}
                        </div>
                      `}
                    </div>
                    <span style="font-size: 0.68rem; font-weight: 700; max-width: 92px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; line-height: 1.1; margin-top: 4px;">
                      ${item.name}
                    </span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Manual Edit Form -->
        <form id="form-sub-record" style="display: flex; flex-direction: column; gap: 11px;">
          <!-- Service Name -->
          <div class="form-group">
            <label class="form-label">${t('sub_name')}</label>
            <input type="text" id="sub-input-name" class="input-control" value="${customName}" placeholder="Ej: Sedapal, Luz del Sur, WIN, Netflix, BCP, SmartFit..." required />
          </div>

          <!-- Amount Input -->
          <div class="form-group">
            <label class="form-label">${t('sub_cost')} (${symbol})</label>
            <div style="position: relative; display: flex; align-items: center;">
              <span style="position: absolute; left: 14px; font-weight: 800; font-size: 1.15rem; color: #0F172A;">${symbol}</span>
              <input type="number" step="0.01" min="0.01" id="sub-input-amount" class="input-control" value="${customAmount}" style="padding-left: 46px; font-size: 1.25rem; font-weight: 800;" placeholder="0.00" required />
            </div>
            <span style="font-size: 0.67rem; color: var(--ink-40); margin-top: 2px;">Puedes ajustar el importe exacto de tu recibo o plan.</span>
          </div>

          <!-- Billing Period & Renewal Day -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="form-group">
              <label class="form-label">${t('sub_freq')}</label>
              <select id="sub-input-period" class="input-control">
                <option value="monthly" ${customPeriod === 'monthly' ? 'selected' : ''}>${t('sub_monthly')}</option>
                <option value="yearly" ${customPeriod === 'yearly' ? 'selected' : ''}>${t('sub_annual')}</option>
                <option value="weekly" ${customPeriod === 'weekly' ? 'selected' : ''}>${t('sub_weekly')}</option>
                <option value="biweekly" ${customPeriod === 'biweekly' ? 'selected' : ''}>${t('sub_biweekly')}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">${t('sub_day')}</label>
              <input type="number" id="sub-input-day" class="input-control" min="1" max="31" value="${customDay}" required />
            </div>
          </div>

          <!-- Payment Method -->
          <div class="form-group">
            <label class="form-label">${t('sub_pm')}</label>
            <select id="sub-input-payment" class="input-control">
              ${PAYMENT_METHODS.map(pm => `
                <option value="${pm.id}" ${pm.id === customPaymentMethod ? 'selected' : ''}>
                  ${getPaymentMethodName(pm)}
                </option>
              `).join('')}
            </select>
          </div>

          <button type="submit" class="btn btn-primary btn-block" style="padding: 13px; font-size: 0.92rem; font-weight: 700; margin-top: 4px; border-radius: 14px;">
            ${subscriptionToEdit ? '${t('sub_save')}' : '${t('sub_add_btn')}'}
          </button>
        </form>
      </div>
    `;

    createIcons({ icons, nameAttr: 'data-lucide', root: overlay });
    bindModalEvents();
  }

  function bindModalEvents() {
    // Category Tabs
    overlay.querySelectorAll('.btn-cat-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedCategory = btn.getAttribute('data-cat');
        renderModal();
      });
    });

    // Search Input
    const searchInput = overlay.querySelector('#sub-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderModal();
        // Keep focus on search input after render
        const newSearch = overlay.querySelector('#sub-search-input');
        if (newSearch) {
          newSearch.focus();
          newSearch.setSelectionRange(searchQuery.length, searchQuery.length);
        }
      });
    }

    // Clear search
    overlay.querySelector('#btn-clear-search')?.addEventListener('click', () => {
      searchQuery = '';
      renderModal();
    });

    // Preset Selection
    overlay.querySelectorAll('.btn-preset-service').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const found = currentServicesList.find(p => p.id === id);
        if (found) {
          selectedPreset = found;
          customName = found.name;
          customAmount = ''; // Force user to enter their own price
          customCategory = found.category;
          customColor = found.color;
          customIcon = found.icon;
          hasOfficialLogo = found.hasOfficialLogo;

          // Update form inputs directly without resetting search state
          const nameInput = overlay.querySelector('#sub-input-name');
          const amountInput = overlay.querySelector('#sub-input-amount');
          if (nameInput) nameInput.value = customName;
          if (amountInput) {
            amountInput.value = customAmount;
            amountInput.focus(); // Focus it so they can type immediately
          }

          // Update active style on preset buttons
          overlay.querySelectorAll('.btn-preset-service').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-id') === id);
          });
        }
      });
    });

    // Close Button
    overlay.querySelector('#btn-sub-close')?.addEventListener('click', close);

    // Form Submit
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

  // Backdrop click to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  // Swipe to dismiss logic (Touch Gestures)
  let startY = 0;
  let currentY = 0;
  let isDragging = false;

  overlay.addEventListener('touchstart', (e) => {
    const sheetEl = overlay.querySelector('.bottom-sheet');
    if (!sheetEl) return;

    const isHandle = e.target.closest('.sheet-handle') || e.target.closest('.sheet-header');
    const isScrollable = e.target.closest('#sub-presets-grid') || e.target.closest('select') || e.target.closest('input');

    if (!isHandle) {
      if (isScrollable) return;
      if (sheetEl.scrollTop > 0) return;
    }

    startY = e.touches[0].clientY;
    currentY = startY;
    isDragging = true;
    sheetEl.style.transition = 'none';
  }, { passive: true });

  overlay.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const sheetEl = overlay.querySelector('.bottom-sheet');
    if (!sheetEl) return;

    currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;

    if (deltaY > 0) {
      sheetEl.style.transform = `translateY(${deltaY}px)`;
    }
  }, { passive: true });

  overlay.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;

    const sheetEl = overlay.querySelector('.bottom-sheet');
    if (!sheetEl) return;

    const deltaY = currentY - startY;
    sheetEl.style.transition = 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)';

    if (deltaY > 80) {
      sheetEl.style.transform = 'translateY(100%)';
      close();
    } else {
      sheetEl.style.transform = 'translateY(0)';
    }
  }, { passive: true });

  portal.appendChild(overlay);
  renderModal();
  requestAnimationFrame(() => overlay.classList.add('active'));
}
