/* ==========================================================================
   AURORA FINANZIX - DASHBOARD VIEW
   Clean Vector Icons & Profile Hero / 3-Column Stats Grid
   ========================================================================== */

import { storage, PAYMENT_METHODS } from '../services/storage.js';
import { getFinancialMetrics } from '../services/analytics.js';

export function renderDashboard(container, { onNavigate, onAddTransaction, onShowToast }) {
  const metrics = getFinancialMetrics();
  const settings = storage.getSettings();
  const symbol = settings.currencySymbol || 'S/';
  const transactions = storage.getTransactions().slice(0, 5);
  const categories = storage.getCategories();
  const savingsGoals = storage.getSavingsGoals();
  const activeGoal = savingsGoals[0] || null;

  const monthlyBudget = settings.monthlyBudget || 2500;
  const budgetSpentPct = Math.min(100, Math.round((metrics.totalExpense / monthlyBudget) * 100));

  container.innerHTML = `
    <!-- Mobile Profile Hero Video Section (Prompt 3 Reference) -->
    <div class="mobile-profile-hero">
      <video autoplay muted loop playsinline>
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4" type="video/mp4" />
      </video>
      <div class="mobile-profile-hero-fade"></div>

      <div class="mobile-identity-row">
        <div class="mobile-user-name">${settings.userName || 'Mi Espacio'}</div>
        <div class="mobile-user-sub">Balance: <strong style="color: #FFFFFF; font-family: var(--font-mono);">${symbol}${metrics.netBalance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</strong></div>
        <div class="trophy-pill">
          <i data-lucide="shield-check" style="width: 14px; height: 14px; color: #10B981;"></i>
          <span>${metrics.savingsRate}% Tasa de Ahorro</span>
        </div>
      </div>
    </div>

    <!-- 3-Column Stats Grid (Prompt 3 Reference) -->
    <div class="stats-3col-grid">
      <div class="stat-box">
        <span class="stat-box-num" style="color: #6EE7B7;">+${symbol}${metrics.totalIncome.toFixed(0)}</span>
        <span class="stat-box-lbl">Ingresos</span>
      </div>
      <div class="stat-box">
        <span class="stat-box-num" style="color: #FDA4AF;">-${symbol}${metrics.totalExpense.toFixed(0)}</span>
        <span class="stat-box-lbl">Gastos</span>
      </div>
      <div class="stat-box">
        <span class="stat-box-num" style="color: #BAE6FD;">${metrics.savingsRate}%</span>
        <span class="stat-box-lbl">Ahorro</span>
      </div>
    </div>

    <!-- Quick Action Buttons Grid -->
    <div class="quick-actions-grid">
      <button class="aurora-action-btn" id="btn-quick-expense">
        <i data-lucide="minus" style="width: 16px; height: 16px; color: #FDA4AF;"></i>
        <span>Gasto</span>
      </button>
      <button class="aurora-action-btn" id="btn-quick-income">
        <i data-lucide="plus" style="width: 16px; height: 16px; color: #6EE7B7;"></i>
        <span>Ingreso</span>
      </button>
      <button class="aurora-action-btn" id="btn-quick-cost">
        <i data-lucide="calculator" style="width: 16px; height: 16px; color: #FDE68A;"></i>
        <span>Costos</span>
      </button>
      <button class="aurora-action-btn" id="btn-quick-budget">
        <i data-lucide="target" style="width: 16px; height: 16px; color: #BAE6FD;"></i>
        <span>Metas</span>
      </button>
    </div>

    <!-- Central Jakarta Liquid Wave Chart -->
    <div class="aurora-card">
      <div class="card-header" style="margin-bottom: 2px;">
        <span class="card-title">
          <i data-lucide="activity" style="width: 16px; height: 16px; color: #10B981;"></i>
          Tendencia de Liquidez
        </span>
        <span style="font-size: 0.72rem; color: var(--ink-40); font-family: var(--font-mono);">Flujo Mensual</span>
      </div>

      <div class="svg-wave-container">
        <svg class="svg-wave" viewBox="0 0 400 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.25"/>
              <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <path d="M0,75 Q50,30 100,50 T200,35 T300,70 T400,20 L400,100 L0,100 Z" fill="url(#waveFill)" />
          <path class="wline" d="M0,75 Q50,30 100,50 T200,35 T300,70 T400,20" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" pathLength="1" />
        </svg>
      </div>

      <div style="display: flex; justify-content: space-between; font-size: 0.68rem; color: var(--ink-40);">
        <span>Sem 1</span>
        <span>Sem 2</span>
        <span>Sem 3</span>
        <span style="color: #FFFFFF; font-weight: 600;">Sem 4 (Actual)</span>
      </div>
    </div>

    <!-- Monthly Budget Progress -->
    <div class="aurora-card" style="padding: 14px 16px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <span style="font-family: var(--font-display); font-size: 0.85rem; font-weight: 700;">
          Presupuesto Mensual
        </span>
        <span style="font-family: var(--font-mono); font-size: 0.78rem; color: ${budgetSpentPct > 85 ? '#FDA4AF' : 'var(--ink-60)'};">
          ${symbol}${metrics.totalExpense.toFixed(0)} / ${symbol}${monthlyBudget} (${budgetSpentPct}%)
        </span>
      </div>
      <div style="width: 100%; height: 7px; background: rgba(255, 255, 255, 0.08); border-radius: 99px; overflow: hidden;">
        <div style="width: ${budgetSpentPct}%; height: 100%; background: ${budgetSpentPct > 90 ? 'var(--rose-pure)' : '#FFFFFF'}; border-radius: 99px; transition: width 0.5s var(--e-out);"></div>
      </div>
    </div>

    <!-- Active Savings Goal -->
    ${activeGoal ? `
      <div class="aurora-card" style="padding: 14px 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i data-lucide="${activeGoal.icon || 'shield'}" style="width: 16px; height: 16px; color: #10B981;"></i>
            <div style="font-family: var(--font-display); font-weight: 700; font-size: 0.88rem; color: #FFFFFF;">${activeGoal.title}</div>
          </div>
          <span style="font-family: var(--font-mono); font-size: 0.88rem; font-weight: 800; color: #FFFFFF;">
            ${Math.round((activeGoal.currentAmount / activeGoal.targetAmount) * 100)}%
          </span>
        </div>
        <div style="width: 100%; height: 6px; background: rgba(255, 255, 255, 0.08); border-radius: 99px; overflow: hidden;">
          <div style="width: ${Math.min(100, Math.round((activeGoal.currentAmount / activeGoal.targetAmount) * 100))}%; height: 100%; background: #FFFFFF; border-radius: 99px;"></div>
        </div>
      </div>
    ` : ''}

    <!-- Recent Activity Ledger -->
    <div class="aurora-card">
      <div class="card-header">
        <span class="card-title">Últimos Movimientos</span>
        <a class="card-action-link" id="btn-view-all-txs">Ver Todos</a>
      </div>

      <div class="tx-list">
        ${transactions.length === 0 ? `
          <div style="text-align: center; padding: 18px 0; color: var(--ink-40); font-size: 0.82rem;">
            Sin movimientos registrados.<br/>Presiona <strong>+</strong> para registrar uno.
          </div>
        ` : transactions.map(tx => {
          const cat = categories.find(c => c.id === tx.category) || { name: 'General', icon: 'receipt' };
          const pm = PAYMENT_METHODS.find(p => p.id === tx.paymentMethod) || { name: 'Efectivo', icon: 'banknote' };
          const isIncome = tx.type === 'income';

          return `
            <div class="tx-item" data-id="${tx.id}">
              <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1;">
                <div class="tx-icon-badge">
                  <i data-lucide="${cat.icon || 'receipt'}" style="width: 16px; height: 16px;"></i>
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
                </div>
              </div>

              <div style="display: flex; flex-direction: column; align-items: flex-end; flex-shrink: 0; margin-left: 8px;">
                <span class="tx-amount ${isIncome ? 'income' : 'expense'}">
                  ${isIncome ? '+' : '-'}${symbol}${Number(tx.amount).toFixed(2)}
                </span>
                <span style="font-size: 0.68rem; color: var(--ink-40);">${tx.date}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Bind Events
  container.querySelector('#btn-quick-expense')?.addEventListener('click', () => onAddTransaction('expense'));
  container.querySelector('#btn-quick-income')?.addEventListener('click', () => onAddTransaction('income'));
  container.querySelector('#btn-quick-cost')?.addEventListener('click', () => onNavigate('costs'));
  container.querySelector('#btn-quick-budget')?.addEventListener('click', () => onNavigate('budgets'));
  container.querySelector('#btn-view-all-txs')?.addEventListener('click', () => onNavigate('transactions'));
}
