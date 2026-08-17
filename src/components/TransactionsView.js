/* ==========================================================================
   AURORA FINANZIX - TRANSACTIONS VIEW
   Clean Lucide Vector Icons & Perfect Bounds
   ========================================================================== */

import { storage, PAYMENT_METHODS } from '../services/storage.js';

export function renderTransactions(container, { onAddTransaction, onShowToast }) {
  let allTransactions = storage.getTransactions();
  const categories = storage.getCategories();
  const settings = storage.getSettings();
  const symbol = settings.currencySymbol || 'S/';

  let activeFilter = 'all';
  let searchQuery = '';
  let selectedCategoryFilter = 'all';

  function renderList() {
    let filtered = allTransactions.filter(t => {
      if (activeFilter === 'expense' && t.type !== 'expense') return false;
      if (activeFilter === 'income' && t.type !== 'income') return false;
      if (activeFilter === 'fixed' && !t.isFixed) return false;

      if (selectedCategoryFilter !== 'all' && t.category !== selectedCategoryFilter) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const cat = categories.find(c => c.id === t.category)?.name.toLowerCase() || '';
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchCat = cat.includes(q);
        const matchNote = (t.note || '').toLowerCase().includes(q);
        if (!matchTitle && !matchCat && !matchNote) return false;
      }

      return true;
    });

    const totalFiltered = filtered.reduce((acc, t) => {
      return t.type === 'income' ? acc + Number(t.amount) : acc - Number(t.amount);
    }, 0);

    const listContainer = container.querySelector('#tx-full-list');
    const totalCountEl = container.querySelector('#tx-filtered-count');
    const totalSumEl = container.querySelector('#tx-filtered-sum');

    if (totalCountEl) totalCountEl.textContent = `${filtered.length} mov.`;
    if (totalSumEl) {
      totalSumEl.textContent = `${totalFiltered >= 0 ? '+' : ''}${symbol}${totalFiltered.toFixed(2)}`;
      totalSumEl.style.color = totalFiltered >= 0 ? '#6EE7B7' : '#FDA4AF';
    }

    if (!listContainer) return;

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 36px 16px; color: var(--ink-40);">
          <div style="font-size: 1.8rem; margin-bottom: 6px;">🔍</div>
          <div style="font-size: 0.92rem; font-weight: 700; color: #FFFFFF;">Sin resultados</div>
          <div style="font-size: 0.75rem; margin-top: 2px;">Ajusta tus filtros o registra un nuevo movimiento.</div>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = filtered.map(tx => {
      const cat = categories.find(c => c.id === tx.category) || { name: 'General', icon: 'receipt' };
      const pm = PAYMENT_METHODS.find(p => p.id === tx.paymentMethod) || { name: 'Efectivo', icon: 'banknote' };
      const isIncome = tx.type === 'income';

      return `
        <div class="tx-item" data-id="${tx.id}">
          <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1;">
            <div class="tx-icon-badge" style="background: ${isIncome ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)'}; color: ${isIncome ? '#6EE7B7' : '#FDA4AF'};">
              <i data-lucide="${cat.icon || 'receipt'}" style="width: 17px; height: 17px;"></i>
            </div>
            <div class="tx-details">
              <span class="tx-title">${tx.title}</span>
              <div class="tx-meta-info">
                <span>${cat.name}</span>
                <span>•</span>
                <span class="tx-payment-method">
                  <i data-lucide="${pm.icon || 'credit-card'}" style="width: 11px; height: 11px;"></i>
                  ${pm.name}
                </span>
                ${tx.isFixed ? '<span style="color: #FDE68A; font-weight: 700;">[Fijo]</span>' : ''}
              </div>
              ${tx.note ? `<span style="font-size: 0.65rem; color: var(--ink-40); font-style: italic; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">"${tx.note}"</span>` : ''}
            </div>
          </div>

          <div style="display: flex; flex-direction: column; align-items: flex-end; flex-shrink: 0; margin-left: 8px;">
            <span class="tx-amount ${isIncome ? 'income' : 'expense'}">
              ${isIncome ? '+' : '-'}${symbol}${Number(tx.amount).toFixed(2)}
            </span>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 0.68rem; color: var(--ink-40);">${tx.date}</span>
              <button type="button" class="btn-delete-tx" data-id="${tx.id}" style="background: none; border: none; color: #FDA4AF; cursor: pointer; padding: 2px;" title="Eliminar">
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
        if (confirm('¿Eliminar este registro?')) {
          storage.deleteTransaction(id);
          allTransactions = storage.getTransactions();
          renderList();
          onShowToast?.('Movimiento eliminado', 'success');
        }
      });
    });
  }

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <h2 style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 700;">
        📝 Libro de Movimientos
      </h2>
      <button id="btn-add-tx-direct" class="btn btn-primary" style="padding: 6px 14px; font-size: 0.8rem;">
        + Nuevo
      </button>
    </div>

    <!-- Search Input -->
    <div style="position: relative;">
      <input type="text" id="tx-search-input" class="input-control" placeholder="Buscar por concepto o categoría..." style="padding-left: 36px; font-size: 0.85rem;" />
      <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--ink-40); font-size: 0.9rem;">
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

    <!-- Category Dropdown -->
    <select id="tx-category-filter" class="input-control" style="font-size: 0.82rem; padding: 10px 14px;">
      <option value="all">📁 Todas las Categorías</option>
      ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
    </select>

    <!-- Filter Summary Bar -->
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: var(--radius-element); font-size: 0.75rem;">
      <span id="tx-filtered-count" style="color: var(--ink-60); font-weight: 600;">0 mov.</span>
      <span style="font-weight: 700;">Balance: <span id="tx-filtered-sum" style="font-family: var(--font-mono); font-weight: 800;">${symbol}0.00</span></span>
    </div>

    <!-- Transaction Items Container -->
    <div class="tx-list" id="tx-full-list"></div>
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
