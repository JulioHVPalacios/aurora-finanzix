/* ==========================================================================
   VALO OS - BOTTOM NAVIGATION COMPONENT (CENTERED FAB DOCK)
   Always Renders Lucide Icons on Every Tab Switch
   ========================================================================== */

import { t } from '../services/i18n.js';
import { createIcons, icons } from 'lucide';

export function renderBottomNav(container, activeTab, onTabSelect, onFabClick) {
  const isReportsActive = ['analytics', 'budgets', 'tools'].includes(activeTab);

  container.innerHTML = `
    <!-- Slot 1: Inicio -->
    <button class="nav-item ${activeTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">
      <i data-lucide="layout-dashboard" style="width: 20px; height: 20px;"></i>
      <span>${t('nav_dashboard')}</span>
    </button>

    <!-- Slot 2: Gastos -->
    <button class="nav-item ${activeTab === 'transactions' ? 'active' : ''}" data-tab="transactions">
      <i data-lucide="receipt" style="width: 20px; height: 20px;"></i>
      <span>${t('nav_transactions')}</span>
    </button>

    <!-- Slot 3: Center Floating Action Button (Exact Math Center) -->
    <div class="nav-fab-wrap">
      <button class="nav-fab-btn" id="btn-nav-fab" title="${t('tx_new')}">
        <i data-lucide="plus" style="width: 26px; height: 26px;"></i>
      </button>
    </div>

    <!-- Slot 4: Suscripciones / Pagos Fijos -->
    <button class="nav-item ${activeTab === 'subscriptions' ? 'active' : ''}" data-tab="subscriptions">
      <i data-lucide="calendar-clock" style="width: 20px; height: 20px;"></i>
      <span>${t('nav_subscriptions')}</span>
    </button>

    <!-- Slot 5: Reportes & Inteligencia -->
    <button class="nav-item ${isReportsActive ? 'active' : ''}" data-tab="analytics">
      <i data-lucide="pie-chart" style="width: 20px; height: 20px;"></i>
      <span>${t('nav_reports')}</span>
    </button>
  `;

  // Attach tab events
  container.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tab = btn.getAttribute('data-tab');
      if (tab) onTabSelect(tab);
    });
  });

  const fab = container.querySelector('#btn-nav-fab');
  fab?.addEventListener('click', onFabClick);

  // Render SVG icons immediately inside bottom nav
  createIcons({ icons, nameAttr: 'data-lucide', root: container });
}
