/* ==========================================================================
   AURORA FINANZIX - BOTTOM NAVIGATION COMPONENT (CENTERED FAB DOCK)
   ========================================================================== */

export function renderBottomNav(container, activeTab, onTabSelect, onFabClick) {
  const isReportsActive = ['analytics', 'budgets', 'tools'].includes(activeTab);

  container.innerHTML = `
    <!-- Slot 1: Inicio -->
    <button class="nav-item ${activeTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">
      <i data-lucide="layout-dashboard" style="width: 20px; height: 20px;"></i>
      <span>Inicio</span>
    </button>

    <!-- Slot 2: Gastos -->
    <button class="nav-item ${activeTab === 'transactions' ? 'active' : ''}" data-tab="transactions">
      <i data-lucide="receipt" style="width: 20px; height: 20px;"></i>
      <span>Gastos</span>
    </button>

    <!-- Slot 3: Center Floating Action Button (Exact Math Center) -->
    <div class="nav-fab-wrap">
      <button class="nav-fab-btn" id="btn-nav-fab" title="Nuevo Movimiento">
        <i data-lucide="plus" style="width: 26px; height: 26px;"></i>
      </button>
    </div>

    <!-- Slot 4: Costos -->
    <button class="nav-item ${activeTab === 'costs' ? 'active' : ''}" data-tab="costs">
      <i data-lucide="calculator" style="width: 20px; height: 20px;"></i>
      <span>Costos</span>
    </button>

    <!-- Slot 5: Reportes & Más -->
    <button class="nav-item ${isReportsActive ? 'active' : ''}" data-tab="analytics">
      <i data-lucide="pie-chart" style="width: 20px; height: 20px;"></i>
      <span>Reportes</span>
    </button>
  `;

  // Attach events
  container.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      if (tab) onTabSelect(tab);
    });
  });

  const fab = container.querySelector('#btn-nav-fab');
  fab?.addEventListener('click', onFabClick);
}
