/* ==========================================================================
   VALO OS - TRANSACTIONS VIEW (HIGH-END FINTECH LEDGER)
   Clean Search, Category Filter & High-Contrast Transaction Ledger
   ========================================================================== */

import { storage, PAYMENT_METHODS } from '../services/storage.js';
import { t, formatCurrency, getCategoryName, getPaymentMethodName } from '../services/i18n.js';
import { createIcons, icons } from 'lucide';

export function renderTransactions(container, { onAddTransaction, onShowToast }) {
  let allTransactions = storage.getTransactions() || [];
  const categories = storage.getCategories() || [];
  const settings = storage.getSettings() || {};
  const symbol = settings.currencySymbol || 'S/';

  let activeFilter = 'all';
  let searchQuery = '';
  let selectedCategoryFilter = 'all';

  function renderList() {
    let filtered = allTransactions.filter(tx => {
      if (activeFilter === 'expense' && tx.type !== 'expense') return false;
      if (activeFilter === 'income' && tx.type !== 'income') return false;
      if (activeFilter === 'fixed' && !tx.isFixed) return false;

      const categoryId = tx.category || tx.categoryId;
      if (selectedCategoryFilter !== 'all' && categoryId !== selectedCategoryFilter) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const cat = getCategoryName(categoryId).toLowerCase();
        const matchTitle = (tx.title || tx.description || '').toLowerCase().includes(q);
        const matchCat = cat.includes(q);
        const matchNote = (tx.note || '').toLowerCase().includes(q);
        if (!matchTitle && !matchCat && !matchNote) return false;
      }

      return true;
    });

    const totalFiltered = filtered.reduce((acc, tx) => {
      return tx.type === 'income' ? acc + Number(tx.amount || 0) : acc - Number(tx.amount || 0);
    }, 0);

    const listContainer = container.querySelector('#tx-full-list');
    const totalCountEl = container.querySelector('#tx-filtered-count');
    const totalSumEl = container.querySelector('#tx-filtered-sum');

    if (totalCountEl) totalCountEl.textContent = `${filtered.length} ${t('tx_items_count')}`;
    if (totalSumEl) {
      totalSumEl.textContent = `${totalFiltered >= 0 ? '+' : ''}${formatCurrency(Math.abs(totalFiltered))}`;
      totalSumEl.style.color = totalFiltered >= 0 ? '#059669' : '#DC2626';
    }

    if (!listContainer) return;

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 36px 16px; color: var(--ink-60); background: #FFFFFF; border-radius: 16px; border: 1px solid rgba(15, 23, 42, 0.08);">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; background: #F8FAFC; border-radius: 12px; margin-bottom: 10px; color: var(--ink-60);">
            <i data-lucide="search" style="width: 22px; height: 22px;"></i>
          </div>
          <div style="font-size: 0.94rem; font-weight: 800; color: var(--ink);">${t('tx_no_results_title')}</div>
          <div style="font-size: 0.78rem; margin-top: 4px;">${t('tx_no_results_desc')}</div>
        </div>
      `;
      createIcons({ icons });
      return;
    }

    listContainer.innerHTML = filtered.map(tx => {
      const categoryId = tx.category || tx.categoryId;
      const cat = categories.find(c => c.id === categoryId) || { name: 'General', icon: 'receipt' };
      const pm = PAYMENT_METHODS.find(p => p.id === tx.paymentMethod) || { name: 'Efectivo', icon: 'banknote' };
      const catDisplayName = getCategoryName(categoryId || cat);
      const pmDisplayName = getPaymentMethodName(tx.paymentMethod || pm);
      const isIncome = tx.type === 'income';

      return `
        <div class="tx-item" data-id="${tx.id}">
          <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1;">
            <div class="tx-icon-badge" style="background: ${isIncome ? '#F0FDF4' : '#FEF2F2'}; color: ${isIncome ? '#059669' : '#DC2626'}; border: 1px solid ${isIncome ? 'rgba(5,150,105,0.15)' : 'rgba(220,38,38,0.15)'};">
              <i data-lucide="${cat.icon || (isIncome ? 'arrow-down-left' : 'arrow-up-right')}" style="width: 17px; height: 17px;"></i>
            </div>
            <div class="tx-details">
              <span class="tx-title">${tx.title || tx.description || catDisplayName}</span>
              <div class="tx-meta-info">
                <span>${catDisplayName}</span>
                <span>•</span>
                <span class="tx-payment-method">
                  <i data-lucide="${pm.icon || 'credit-card'}" style="width: 11px; height: 11px;"></i>
                  ${pmDisplayName}
                </span>
                ${tx.isFixed ? `<span style="color: #D97706; font-weight: 800;">[${t('tx_fixed_tag')}]</span>` : ''}
              </div>
              ${tx.note ? `<span style="font-size: 0.68rem; color: var(--ink-60); font-style: italic; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">"${tx.note}"</span>` : ''}
            </div>
          </div>

          <div style="display: flex; flex-direction: column; align-items: flex-end; flex-shrink: 0; margin-left: 8px;">
            <span class="tx-amount ${isIncome ? 'income' : 'expense'}" style="color: ${isIncome ? '#059669' : '#DC2626'}; font-size: 0.98rem; font-weight: 800; font-family: var(--font-mono);">
              ${isIncome ? '+' : '-'}${formatCurrency(tx.amount || 0)}
            </span>
            <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
              <span style="font-size: 0.7rem; color: var(--ink-60);">${tx.date || t('tx_today')}</span>
              <button type="button" class="btn-delete-tx" data-id="${tx.id}" style="background: none; border: none; color: var(--ink-40); cursor: pointer; padding: 4px;" title="${t('goals_delete')}">
                <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    listContainer.querySelectorAll('.btn-delete-tx').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        if (confirm(t('tx_delete_confirm'))) {
          storage.deleteTransaction(id);
          allTransactions = storage.getTransactions() || [];
          renderList();
          onShowToast?.(t('tx_delete_success'), 'success');
        }
      });
    });

    createIcons({ icons });
  }

  container.innerHTML = `
    <div class="view-transition-wrap">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; color: var(--ink);">
            ${t('tx_ledger_title')}
          </h2>
          <p style="font-size: 0.75rem; color: var(--ink-60); margin-top: 2px;">
            ${t('tx_ledger_sub')}
          </p>
        </div>
        <button type="button" class="btn btn-primary" id="btn-header-add-tx" style="font-size: 0.78rem; padding: 8px 14px;">
          ${t('tx_new_btn')}
        </button>
      </div>

      <!-- Search Input -->
      <div style="position: relative;">
        <input type="text" id="tx-search-input" class="input-control" placeholder="${t('tx_search_placeholder')}" style="padding-left: 38px; font-size: 0.88rem;" />
        <span style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--ink-40);">
          <i data-lucide="search" style="width: 16px; height: 16px;"></i>
        </span>
      </div>

      <!-- Segmented Filter Control -->
      <div class="segmented-control">
        <button class="segment-btn active" data-filter="all">${t('tx_filter_all')}</button>
        <button class="segment-btn" data-filter="expense">${t('tx_filter_expense')}</button>
        <button class="segment-btn" data-filter="income">${t('tx_filter_income')}</button>
        <button class="segment-btn" data-filter="fixed">${t('tx_filter_fixed')}</button>
      </div>

      <!-- Category Dropdown Filter -->
      <select id="tx-category-filter" class="input-control" style="font-size: 0.85rem; font-weight: 600;">
        <option value="all">${t('tx_cat_all')}</option>
        ${categories.map(c => `<option value="${c.id}">${getCategoryName(c)}</option>`).join('')}
      </select>

      <!-- Filter Summary Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #FFFFFF; border: 1px solid rgba(15, 23, 42, 0.08); border-radius: var(--radius-md); font-size: 0.8rem; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
        <span id="tx-filtered-count" style="color: var(--ink-60); font-weight: 700;">0 ${t('tx_items_count')}</span>
        <span style="font-weight: 700; color: var(--ink);">${t('tx_filtered_balance')} <span id="tx-filtered-sum" style="font-family: var(--font-mono); font-weight: 800; font-size: 0.95rem;">${symbol}0.00</span></span>
      </div>

      <!-- Transaction Items Container -->
      <div class="tx-list" id="tx-full-list"></div>
    </div>
  `;

  // Bind Events
  container.querySelector('#btn-add-tx-direct')?.addEventListener('click', () => onAddTransaction('expense'));

  const searchInput = container.querySelector('#tx-search-input');
  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderList();
  });

  const catFilter = container.querySelector('#tx-category-filter');
  catFilter?.addEventListener('change', (e) => {
    selectedCategoryFilter = e.target.value;
    renderList();
  });

  container.querySelectorAll('.segment-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter') || 'all';
      renderList();
    });
  });

  renderList();
  createIcons({ icons });
}
