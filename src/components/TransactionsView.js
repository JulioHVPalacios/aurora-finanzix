/* ==========================================================================
   AURORA FINANZIX - TRANSACTIONS VIEW (LIQUID GLASS EDITION)
   Clean Search, Category Filter & High-Contrast Transaction Ledger
   ========================================================================== */

import { storage, PAYMENT_METHODS } from '../services/storage.js';

export function renderTransactions(container, { onAddTransaction, onShowToast }) {
  let allTransactions = storage.getTransactions() || [];
  const categories = storage.getCategories() || [];
  const settings = storage.getSettings() || {};
  const symbol = settings.currencySymbol || 'S/';

  let activeFilter = 'all';
  let searchQuery = '';
  let selectedCategoryFilter = 'all';

  function renderList() {
    let filtered = allTransactions.filter(t => {
      if (activeFilter === 'expense' && t.type !== 'expense') return false;
      if (activeFilter === 'income' && t.type !== 'income') return false;
      if (activeFilter === 'fixed' && !t.isFixed) return false;

      const categoryId = t.category || t.categoryId;
      if (selectedCategoryFilter !== 'all' && categoryId !== selectedCategoryFilter) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const cat = categories.find(c => c.id === categoryId)?.name.toLowerCase() || '';
        const matchTitle = (t.title || t.description || '').toLowerCase().includes(q);
        const matchCat = cat.includes(q);
        const matchNote = (t.note || '').toLowerCase().includes(q);
        if (!matchTitle && !matchCat && !matchNote) return false;
      }

      return true;
    });

    const totalFiltered = filtered.reduce((acc, t) => {
      return t.type === 'income' ? acc + Number(t.amount || 0) : acc - Number(t.amount || 0);
    }, 0);

    const listContainer = container.querySelector('#tx-full-list');
    const totalCountEl = container.querySelector('#tx-filtered-count');
    const totalSumEl = container.querySelector('#tx-filtered-sum');

    if (totalCountEl) totalCountEl.textContent = `${filtered.length} movimientos`;
    if (totalSumEl) {
      totalSumEl.textContent = `${totalFiltered >= 0 ? '+' : ''}${symbol}${totalFiltered.toFixed(2)}`;
      totalSumEl.style.color = totalFiltered >= 0 ? '#059669' : '#DC2626';
    }

    if (!listContainer) return;

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 36px 16px; color: var(--ink-60); background: #FFFFFF; border-radius: 16px; border: 1px solid rgba(15, 23, 42, 0.06);">
          <div style="font-size: 1.8rem; margin-bottom: 6px;">🔍</div>
          <div style="font-size: 0.94rem; font-weight: 800; color: var(--ink);">Sin resultados encontrados</div>
          <div style="font-size: 0.78rem; margin-top: 2px;">Ajusta tus filtros o registra un nuevo movimiento.</div>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = filtered.map(tx => {
      const categoryId = tx.category || tx.categoryId;
      const cat = categories.find(c => c.id === categoryId) || { name: 'General', icon: 'receipt' };
      const pm = PAYMENT_METHODS.find(p => p.id === tx.paymentMethod) || { name: 'Efectivo', icon: 'banknote' };
      const isIncome = tx.type === 'income';

      return `
        <div class="tx-item" data-id="${tx.id}">
          <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1;">
            <div class="tx-icon-badge" style="background: ${isIncome ? '#ECFDF5' : '#FFF1F2'}; color: ${isIncome ? '#059669' : '#E11D48'};">
              <i data-lucide="${cat.icon || 'receipt'}" style="width: 18px; height: 18px;"></i>
            </div>
            <div class="tx-details">
              <span class="tx-title">${tx.title || tx.description || cat.name}</span>
              <div class="tx-meta-info">
                <span>${cat.name}</span>
                <span>•</span>
                <span class="tx-payment-method">
                  <i data-lucide="${pm.icon || 'credit-card'}" style="width: 11px; height: 11px;"></i>
                  ${pm.name}
                </span>
                ${tx.isFixed ? '<span style="color: #D97706; font-weight: 800;">[Fijo]</span>' : ''}
              </div>
              ${tx.note ? `<span style="font-size: 0.68rem; color: var(--ink-60); font-style: italic; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">"${tx.note}"</span>` : ''}
            </div>
          </div>

          <div style="display: flex; flex-direction: column; align-items: flex-end; flex-shrink: 0; margin-left: 8px;">
            <span class="tx-amount ${isIncome ? 'income' : 'expense'}" style="font-size: 1rem;">
              ${isIncome ? '+' : '-'}${symbol}${Number(tx.amount || 0).toFixed(2)}
            </span>
            <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
              <span style="font-size: 0.7rem; color: var(--ink-60);">${tx.date || 'Hoy'}</span>
              <button type="button" class="btn-delete-tx" data-id="${tx.id}" style="background: none; border: none; color: #DC2626; cursor: pointer; padding: 4px;" title="Eliminar">
                <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
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
        if (confirm('¿Eliminar este registro de gasto/ingreso?')) {
          storage.deleteTransaction(id);
          allTransactions = storage.getTransactions();
          renderList();
          onShowToast?.('Movimiento eliminado', 'success');
        }
      });
    });
  }

  container.innerHTML = `
    <div class="view-transition-wrap">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2 style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; color: var(--ink);">
            📝 Libro de Movimientos
          </h2>
          <p style="font-size: 0.74rem; color: var(--ink-60);">Historial completo de tus ingresos y gastos</p>
        </div>
        <button id="btn-add-tx-direct" class="btn btn-primary" style="padding: 8px 16px; font-size: 0.82rem;">
          + Nuevo
        </button>
      </div>

      <!-- Search Input -->
      <div style="position: relative;">
        <input type="text" id="tx-search-input" class="input-control" placeholder="Buscar por concepto o categoría..." style="padding-left: 38px; font-size: 0.88rem;" />
        <span style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--ink-40);">
          <i data-lucide="search" style="width: 16px; height: 16px;"></i>
        </span>
      </div>

      <!-- Segmented Filter Control -->
      <div class="segmented-control">
        <button class="segment-btn active" data-filter="all">Todos</button>
        <button class="segment-btn" data-filter="expense">Gastos</button>
        <button class="segment-btn" data-filter="income">Ingresos</button>
        <button class="segment-btn" data-filter="fixed">Fijos</button>
      </div>

      <!-- Category Dropdown Filter -->
      <select id="tx-category-filter" class="input-control" style="font-size: 0.85rem; font-weight: 600;">
        <option value="all">📁 Todas las Categorías</option>
        ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
      </select>

      <!-- Filter Summary Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #FFFFFF; border: 1px solid rgba(15, 23, 42, 0.08); border-radius: var(--radius-md); font-size: 0.8rem; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
        <span id="tx-filtered-count" style="color: var(--ink-60); font-weight: 700;">0 movimientos</span>
        <span style="font-weight: 700; color: var(--ink);">Balance filtrado: <span id="tx-filtered-sum" style="font-family: var(--font-mono); font-weight: 800; font-size: 0.95rem;">${symbol}0.00</span></span>
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
}
