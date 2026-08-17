/* ==========================================================================
   FINANZIX PRO - BOTTOM NAVIGATION COMPONENT
   ========================================================================== */

export function renderBottomNav(container, activeTab, onTabSelect, onFabClick) {
  container.innerHTML = `
    <button class="nav-item ${activeTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">
      <i data-lucide="layout-dashboard"></i>
      <span>Inicio</span>
    </button>

    <button class="nav-item ${activeTab === 'transactions' ? 'active' : ''}" data-tab="transactions">
      <i data-lucide="receipt"></i>
      <span>Gastos</span>
    </button>

    <!-- Center Floating Action Button -->
    <button class="nav-fab-btn" id="btn-nav-fab" title="Nuevo Registro">
      <i data-lucide="plus"></i>
    </button>

    <button class="nav-item ${activeTab === 'costs' ? 'active' : ''}" data-tab="costs">
      <i data-lucide="calculator"></i>
      <span>Costos</span>
    </button>

    <button class="nav-item ${activeTab === 'analytics' ? 'active' : ''}" data-tab="analytics">
      <i data-lucide="pie-chart"></i>
      <span>Reportes</span>
    </button>

    <button class="nav-item ${activeTab === 'tools' ? 'active' : ''}" data-tab="tools">
      <i data-lucide="wrench"></i>
      <span>Utilidades</span>
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
