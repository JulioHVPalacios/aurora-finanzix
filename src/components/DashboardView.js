/* ==========================================================================
   AURORA FINANZIX - DASHBOARD VIEW (PEARL WHITE & VIBRANT LIQUID GLASS)
   High-Contrast Radiant Hero Card & Silky Micro-Interactions
   ========================================================================== */

import { storage, PAYMENT_METHODS } from '../services/storage.js';
import { getFinancialMetrics } from '../services/analytics.js';
import { t, formatCurrency } from '../services/i18n.js';

export function renderDashboard(container, { onNavigate, onAddTransaction, onShowToast }) {
  const metrics = getFinancialMetrics() || { netBalance: 0, totalIncome: 0, totalExpense: 0, savingsRate: 0 };
  const settings = storage.getSettings() || {};
  const symbol = settings.currencySymbol || 'S/';
  const transactions = (storage.getTransactions() || []).slice(0, 5);
  const categories = storage.getCategories() || [];
  const savingsGoals = storage.getSavingsGoals() || [];
  const activeGoal = savingsGoals[0] || null;

  const monthlyBudget = settings.monthlyBudget || 2500;
  const budgetSpentPct = Math.min(100, Math.round(((metrics.totalExpense || 0) / (monthlyBudget || 1)) * 100));

  container.innerHTML = `
    <div class="view-transition-wrap">
      <!-- Hero Balance Card (Radiant Indigo/Violet Liquid Glass) -->
      <div class="hero-balance-card">
        <div class="hero-user-name">${t('dash_greeting')}, ${settings.userName || 'Usuario'}</div>
        <div class="hero-balance-amount">${formatCurrency(metrics.netBalance || 0)}</div>
        
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
          <div class="hero-savings-chip">
            <i data-lucide="shield-check" style="width: 14px; height: 14px; color: #10B981;"></i>
            <span>${metrics.savingsRate || 0}% Tasa de Ahorro</span>
          </div>
          <div style="font-family: var(--font-mono); font-size: 0.76rem; color: rgba(255, 255, 255, 0.9);">
            Presupuesto: <strong>${symbol}${monthlyBudget}</strong>
          </div>
        </div>
      </div>

      <!-- 3-Column Vibrant Stat Box Grid (Mint, Rose, Sky Glass) -->
      <div class="stats-grid">
        <div class="stat-box-card stat-box-income" id="card-stat-income">
          <div class="stat-amount">+${formatCurrency(metrics.totalIncome || 0)}</div>
          <div class="stat-label">${t('dash_income')}</div>
        </div>
        <div class="stat-box-card stat-box-expense" id="card-stat-expense">
          <div class="stat-amount">-${formatCurrency(metrics.totalExpense || 0)}</div>
          <div class="stat-label">${t('dash_expense')}</div>
        </div>
        <div class="stat-box-card stat-box-savings" id="card-stat-savings">
          <div class="stat-amount">${metrics.savingsRate || 0}%</div>
          <div class="stat-label">${t('dash_savings')}</div>
        </div>
      </div>

      <!-- Quick Action Pill Buttons -->
      <div class="quick-actions-row">
        <button type="button" class="action-pill-btn" id="btn-quick-expense">
          <div class="action-icon-circle action-icon-expense">
            <i data-lucide="minus" style="width: 16px; height: 16px;"></i>
          </div>
          <span>Gasto</span>
        </button>

        <button type="button" class="action-pill-btn" id="btn-quick-income">
          <div class="action-icon-circle action-icon-income">
            <i data-lucide="plus" style="width: 16px; height: 16px;"></i>
          </div>
          <span>Ingreso</span>
        </button>

        <button type="button" class="action-pill-btn" id="btn-quick-cost">
          <div class="action-icon-circle action-icon-cost">
            <i data-lucide="calculator" style="width: 16px; height: 16px;"></i>
          </div>
          <span>Costos</span>
        </button>

        <button type="button" class="action-pill-btn" id="btn-quick-budget">
          <div class="action-icon-circle action-icon-goals">
            <i data-lucide="target" style="width: 16px; height: 16px;"></i>
          </div>
          <span>Metas</span>
        </button>
      </div>

      <!-- Liquidity Wave Chart (Vibrant Liquid Glass) -->
      <div class="chart-card-glass">
        <div class="chart-card-header">
          <div class="chart-title-left">
            <i data-lucide="activity" style="width: 17px; height: 17px; color: #4F46E5;"></i>
            <span>Tendencia de Liquidez</span>
          </div>
          <span class="chart-title-sub">Flujo Mensual</span>
        </div>

        <div style="width: 100%; height: 90px; position: relative;">
          <svg viewBox="0 0 400 90" preserveAspectRatio="none" style="width: 100%; height: 100%;">
            <defs>
              <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#4F46E5" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="#4F46E5" stop-opacity="0.0"/>
              </linearGradient>
            </defs>
            <path d="M0,65 Q60,25 120,45 T240,30 T320,60 T400,15 L400,90 L0,90 Z" fill="url(#waveGradient)" />
            <path d="M0,65 Q60,25 120,45 T240,30 T320,60 T400,15" fill="none" stroke="#4F46E5" stroke-width="2.8" stroke-linecap="round" />
          </svg>
        </div>

        <div class="chart-legend-row">
          <span>Sem 1</span>
          <span>Sem 2</span>
          <span>Sem 3</span>
          <span class="chart-legend-active">Sem 4 (Actual)</span>
        </div>
      </div>

      <!-- Monthly Budget Progress Card -->
      <div class="budget-card-glass">
        <div class="budget-header-row">
          <div class="budget-title">Presupuesto Mensual</div>
          <div class="budget-values">
            ${symbol}${(metrics.totalExpense || 0).toFixed(0)} / ${symbol}${monthlyBudget} <span style="color: #4F46E5; font-weight: 800;">(${budgetSpentPct}%)</span>
          </div>
        </div>
        <div class="budget-progress-track">
          <div class="budget-progress-bar" style="width: ${budgetSpentPct}%;"></div>
        </div>
      </div>

      <!-- Active Savings Goal Card (if any) -->
      ${activeGoal ? `
        <div class="budget-card-glass" style="background: linear-gradient(135deg, rgba(238, 242, 255, 0.95), rgba(245, 243, 255, 0.9)); border-color: rgba(99, 102, 241, 0.25);">
          <div class="budget-header-row">
            <div style="display: flex; align-items: center; gap: 8px;">
              <i data-lucide="target" style="width: 16px; height: 16px; color: #4F46E5;"></i>
              <span class="budget-title">${activeGoal.title || activeGoal.name || 'Meta'}</span>
            </div>
            <div class="budget-values" style="color: #4338CA;">
              ${symbol}${(activeGoal.currentAmount || activeGoal.current || 0).toFixed(0)} / ${symbol}${(activeGoal.targetAmount || activeGoal.target || 0).toFixed(0)}
            </div>
          </div>
          <div class="budget-progress-track" style="background: rgba(99, 102, 241, 0.1);">
            <div class="budget-progress-bar" style="width: ${Math.min(100, Math.round(((activeGoal.currentAmount || activeGoal.current || 0) / (activeGoal.targetAmount || activeGoal.target || 1)) * 100))}%; background: linear-gradient(90deg, #4F46E5, #7C3AED);"></div>
          </div>
        </div>
      ` : ''}

      <!-- Recent Transactions Section -->
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-family: var(--font-display); font-weight: 800; font-size: 0.96rem; color: var(--ink);">${t('dash_recent_tx')}</span>
          <button type="button" id="btn-view-all-tx" style="background: transparent; border: none; font-size: 0.78rem; font-weight: 700; color: #4F46E5; cursor: pointer;">
            ${t('dash_view_all')}
          </button>
        </div>

        <div class="transactions-list-glass">
          ${transactions.length === 0 ? `
            <div style="padding: 28px 16px; text-align: center; color: var(--ink-60); font-size: 0.84rem; background: #FFFFFF; border-radius: 16px; border: 1.5px dashed rgba(15, 23, 42, 0.1);">
              <div style="width: 44px; height: 44px; border-radius: 50%; background: #EEF2FF; color: #4F46E5; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px;">
                <i data-lucide="sparkles" style="width: 22px; height: 22px;"></i>
              </div>
              <div style="font-weight: 800; font-size: 0.94rem; color: var(--ink); margin-bottom: 2px;">${t('dash_empty_title')}</div>
              <div style="font-size: 0.76rem; color: var(--ink-60); margin-bottom: 14px;">${t('dash_empty_desc')}</div>
              <button type="button" id="btn-empty-add-tx" class="btn btn-primary" style="padding: 8px 18px; font-size: 0.82rem;">
                ${t('dash_empty_btn')}
              </button>
            </div>
          ` : transactions.map(tx => {
            const categoryId = tx.category || tx.categoryId;
            const cat = categories.find(c => c.id === categoryId) || { name: 'General', color: '#6366F1', icon: 'receipt' };
            const isIncome = tx.type === 'income';

            return `
              <div class="tx-item-card">
                <div class="tx-left">
                  <div class="tx-icon-box" style="background: ${isIncome ? '#ECFDF5' : '#FFF1F2'}; color: ${isIncome ? '#059669' : '#E11D48'};">
                    <i data-lucide="${cat.icon || 'receipt'}" style="width: 18px; height: 18px;"></i>
                  </div>
                  <div class="tx-details">
                    <span class="tx-title">${tx.title || tx.description || cat.name}</span>
                    <div class="tx-meta">
                      <span>${cat.name}</span>
                      <span>•</span>
                      <span>${tx.date ? new Date(tx.date).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }) : 'Hoy'}</span>
                    </div>
                  </div>
                </div>

                <div class="tx-amount ${isIncome ? 'income' : 'expense'}">
                  ${isIncome ? '+' : '-'}${symbol}${Number(tx.amount || 0).toFixed(2)}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  // Bind Quick Actions
  container.querySelector('#btn-quick-expense')?.addEventListener('click', () => onAddTransaction?.('expense'));
  container.querySelector('#btn-quick-income')?.addEventListener('click', () => onAddTransaction?.('income'));
  container.querySelector('#btn-quick-cost')?.addEventListener('click', () => onNavigate?.('costs'));
  container.querySelector('#btn-quick-budget')?.addEventListener('click', () => onNavigate?.('budgets'));
  container.querySelector('#btn-view-all-tx')?.addEventListener('click', () => onNavigate?.('transactions'));
  container.querySelector('#btn-empty-add-tx')?.addEventListener('click', () => onAddTransaction?.('income'));

  container.querySelector('#card-stat-income')?.addEventListener('click', () => onAddTransaction?.('income'));
  container.querySelector('#card-stat-expense')?.addEventListener('click', () => onAddTransaction?.('expense'));
  container.querySelector('#card-stat-savings')?.addEventListener('click', () => onNavigate?.('budgets'));
}
