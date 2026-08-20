/* ==========================================================================
   VALO OS - DASHBOARD VIEW (OBSIDIAN & PEARL FINTECH EDITION)
   High-Contrast Luxury Obsidian Hero Card, Clean White Stat Boxes & Minimalist Wave
   ========================================================================== */

import { storage } from '../services/storage.js';
import { getFinancialMetrics, getWeeklyCashflow, getDailySpendingPace } from '../services/analytics.js';
import { t, formatCurrency, getCategoryName } from '../services/i18n.js';
import { renderSponsoredDealsCard, attachSponsoredDealEvents } from './SponsoredDealsCard.js';
import { createIcons, icons } from 'lucide';


export function renderDashboard(container, { onNavigate, onAddTransaction, onShowToast }) {
  const metrics = getFinancialMetrics() || { netBalance: 0, totalIncome: 0, totalExpense: 0, savingsRate: 0 };
  const settings = storage.getSettings() || {};
  const symbol = settings.currencySymbol || 'S/';
  const transactions = (storage.getTransactions() || []).slice(0, 5);
  const categories = storage.getCategories() || [];
  const savingsGoals = storage.getSavingsGoals() || [];
  const activeGoal = savingsGoals[0] || null;

  const monthlyBudget = settings.monthlyBudget || 0;
  const budgetSpentPct = Math.min(100, Math.round(((metrics.totalExpense || 0) / (monthlyBudget || 1)) * 100));
  const paceData = getDailySpendingPace();

  const userName = (!settings.userName || settings.userName === 'Mi Espacio' || settings.userName === 'My Space')
    ? t('nav_my_space')
    : settings.userName;

  container.innerHTML = `
    <div class="view-transition-wrap">
      <!-- Desktop Split Top Section (Hero Card + Stats Grid) -->
      <div class="dashboard-top-section">
        <!-- Hero Balance Card (Obsidian Living Video Card) -->
        <div class="hero-balance-card">
          <video class="hero-bg-video" autoplay loop muted playsinline webkit-playsinline disablePictureInPicture disableremoteplayback preload="auto">
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
          <div class="hero-card-overlay"></div>
          <div class="hero-card-content">
            <div class="hero-user-name">${t('dash_greeting')}, ${userName}</div>
            <div class="hero-balance-amount">${formatCurrency(metrics.netBalance || 0)}</div>
            
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
              <div class="hero-savings-chip">
                <i data-lucide="shield-check" style="width: 14px; height: 14px; color: #34D399;"></i>
                <span>${metrics.savingsRate || 0}% ${t('dash_savings_rate')}</span>
              </div>
              <div style="font-family: var(--font-mono); font-size: 0.76rem; color: rgba(255, 255, 255, 0.9);">
                ${t('dash_budget')}: <strong>${symbol}${monthlyBudget}</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="dashboard-top-right">
          <!-- 3-Column Pure White Stat Box Grid (Non-AI, Crisp High-End Finish) -->
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

          <!-- Quick Action Pill Buttons (Minimalist SVG Icons) -->
          <div class="quick-actions-row">
            <button type="button" class="action-pill-btn" id="btn-quick-expense">
              <div class="action-icon-circle action-icon-expense">
                <i data-lucide="arrow-up-right" style="width: 17px; height: 17px;"></i>
              </div>
              <span>${t('qa_expense')}</span>
            </button>

            <button type="button" class="action-pill-btn" id="btn-quick-income">
              <div class="action-icon-circle action-icon-income">
                <i data-lucide="arrow-down-left" style="width: 17px; height: 17px;"></i>
              </div>
              <span>${t('qa_income')}</span>
            </button>

            <button type="button" class="action-pill-btn" id="btn-quick-cost">
              <div class="action-icon-circle action-icon-cost">
                <i data-lucide="calculator" style="width: 17px; height: 17px;"></i>
              </div>
              <span>${t('qa_costs')}</span>
            </button>

            <button type="button" class="action-pill-btn" id="btn-quick-budget">
              <div class="action-icon-circle action-icon-goals">
                <i data-lucide="target" style="width: 17px; height: 17px;"></i>
              </div>
              <span>${t('qa_goals')}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Daily Safe-to-Spend & Spending Pace Widget (High-Precision Fintech Engine) -->
      <div class="safe-spend-widget" id="card-safe-spend" style="
        background: #FFFFFF;
        border: 1px solid rgba(15, 23, 42, 0.08);
        border-radius: var(--radius-lg);
        padding: 18px 20px;
        box-shadow: 0 4px 20px -4px rgba(15, 23, 42, 0.04);
        cursor: pointer;
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
      ">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 28px; height: 28px; border-radius: 8px; background: #EEF2FF; color: #4F46E5; display: flex; align-items: center; justify-content: center;">
              <i data-lucide="compass" style="width: 15px; height: 15px;"></i>
            </div>
            <div>
              <span style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B;">Disponible para Gastar Hoy</span>
              <div style="font-size: 0.65rem; color: #94A3B8; font-family: var(--font-mono);">${paceData.daysRemaining} días restantes en el mes</div>
            </div>
          </div>

          <div style="
            background: ${!paceData.hasBudget ? '#F1F5F9' : paceData.paceStatus === 'ahead' ? '#ECFDF5' : paceData.paceStatus === 'behind' ? '#FFF1F2' : '#EEF2FF'};
            color: ${!paceData.hasBudget ? '#64748B' : paceData.paceStatus === 'ahead' ? '#059669' : paceData.paceStatus === 'behind' ? '#E11D48' : '#4F46E5'};
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 0.68rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 4px;
          ">
            <i data-lucide="${!paceData.hasBudget ? 'target' : paceData.paceStatus === 'ahead' ? 'trending-down' : paceData.paceStatus === 'behind' ? 'alert-triangle' : 'sparkles'}" style="width: 12px; height: 12px;"></i>
            <span>${!paceData.hasBudget ? 'Definir Presupuesto' : paceData.paceStatus === 'ahead' ? 'Excelente ritmo de ahorro' : paceData.paceStatus === 'behind' ? 'Gasto acelerado este mes' : 'Ritmo óptimo'}</span>
          </div>
        </div>

        <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px;">
          <div>
            <span style="font-family: var(--font-mono); font-size: 1.75rem; font-weight: 900; color: #0F172A; letter-spacing: -0.02em;">
              ${formatCurrency(paceData.dailySafeToSpend)}
            </span>
            <span style="font-size: 0.8rem; font-weight: 600; color: #64748B;"> / por día</span>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.78rem; font-weight: 700; color: #0F172A; font-family: var(--font-mono);">
              ${paceData.hasBudget ? `${formatCurrency(paceData.discretionaryPool)} libre` : 'S/ 0.00 asignado'}
            </div>
            <div style="font-size: 0.62rem; color: #94A3B8;">
              ${paceData.hasBudget ? (paceData.pendingFixedBills > 0 ? `tras fijos (${formatCurrency(paceData.pendingFixedBills)})` : 'para todo el mes') : 'Toca para fijar meta'}
            </div>
          </div>
        </div>

        <!-- Dual Progression Velocity Meter (Time vs Spent) -->
        <div style="position: relative; height: 8px; background: #F1F5F9; border-radius: 999px; overflow: hidden;">
          <!-- Reference Indicator: Time elapsed in the month -->
          <div style="position: absolute; left: 0; top: 0; bottom: 0; width: ${paceData.monthProgressPct}%; background: rgba(15, 23, 42, 0.12); z-index: 1;" title="Días del mes transcurridos: ${paceData.monthProgressPct}%"></div>
          <!-- Actual Spent Bar -->
          <div style="position: absolute; left: 0; top: 0; bottom: 0; width: ${paceData.budgetSpentPct}%; background: ${paceData.paceStatus === 'behind' ? 'linear-gradient(90deg, #F43F5E, #E11D48)' : 'linear-gradient(90deg, #10B981, #059669)'}; border-radius: 999px; z-index: 2; transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);"></div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; font-size: 0.62rem; color: #94A3B8; font-family: var(--font-mono);">
          <span>Presupuesto gastado: <strong>${paceData.budgetSpentPct}%</strong></span>
          <span>Días transcurridos: <strong>${paceData.monthProgressPct}% (${paceData.currentDay}/${paceData.daysInMonth})</strong></span>
        </div>
      </div>

      <!-- Monthly Budget Progress Card -->
      <div class="budget-card-glass">
        <div class="budget-header-row">
          <div class="budget-title">${t('dash_monthly_budget')}</div>
          <div class="budget-values">
            ${symbol}${(metrics.totalExpense || 0).toFixed(0)} / ${symbol}${monthlyBudget} <span style="color: #0F172A; font-weight: 800;">(${budgetSpentPct}%)</span>
          </div>
        </div>
        <div class="budget-progress-track">
          <div class="budget-progress-bar" style="width: ${budgetSpentPct}%;"></div>
        </div>
      </div>

      <!-- Active Savings Goal Card (if any) -->
      ${activeGoal ? `
        <div class="budget-card-glass" style="background: #FFFFFF; border: 1px solid rgba(15, 23, 42, 0.08);">
          <div class="budget-header-row">
            <div style="display: flex; align-items: center; gap: 8px;">
              <i data-lucide="target" style="width: 16px; height: 16px; color: #4F46E5;"></i>
              <span class="budget-title">${activeGoal.title || activeGoal.name || 'Meta'}</span>
            </div>
            <div class="budget-values" style="color: #0F172A;">
              ${symbol}${(activeGoal.currentAmount || activeGoal.current || 0).toFixed(0)} / ${symbol}${(activeGoal.targetAmount || activeGoal.target || 0).toFixed(0)}
            </div>
          </div>
          <div class="budget-progress-track" style="background: rgba(15, 23, 42, 0.06);">
            <div class="budget-progress-bar" style="width: ${Math.min(100, Math.round(((activeGoal.currentAmount || activeGoal.current || 0) / (activeGoal.targetAmount || activeGoal.target || 1)) * 100))}%; background: linear-gradient(90deg, #0F172A, #334155);"></div>
          </div>
        </div>
      ` : ''}

      <!-- Elegant Sponsored Deals & Savings Opportunities Card -->
      ${renderSponsoredDealsCard()}

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
              <div style="font-weight: 800; color: var(--ink); margin-bottom: 4px;">${t('dash_empty_title')}</div>
              <p style="font-size: 0.78rem; margin-bottom: 14px;">${t('dash_empty_desc')}</p>
              <button type="button" id="btn-empty-add-tx" class="btn btn-primary" style="padding: 8px 16px; font-size: 0.8rem;">
                ${t('dash_empty_btn')}
              </button>
            </div>
          ` : transactions.map(tx => {
            const categoryId = tx.category || tx.categoryId;
            const cat = categories.find(c => c.id === categoryId) || { name: 'General', icon: 'receipt' };
            const catDisplayName = getCategoryName(categoryId || cat);
            const isIncome = tx.type === 'income';

            return `
              <div class="tx-item">
                <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1;">
                  <div class="tx-icon-badge" style="background: ${isIncome ? '#F0FDF4' : '#FEF2F2'}; color: ${isIncome ? '#059669' : '#DC2626'}; border: 1px solid ${isIncome ? 'rgba(5,150,105,0.15)' : 'rgba(220,38,38,0.15)'};">
                    <i data-lucide="${cat.icon || (isIncome ? 'arrow-down-left' : 'arrow-up-right')}" style="width: 17px; height: 17px;"></i>
                  </div>
                  <div class="tx-details">
                    <span class="tx-title">${tx.title || tx.description || catDisplayName}</span>
                    <span class="tx-meta-info">${catDisplayName} • ${tx.date || t('tx_today')}</span>
                  </div>
                </div>
                <div class="tx-amount ${isIncome ? 'income' : 'expense'}" style="color: ${isIncome ? '#059669' : '#DC2626'}; font-weight: 800; font-family: var(--font-mono);">
                  ${isIncome ? '+' : '-'}${formatCurrency(tx.amount || 0)}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  // Attach event listeners
  container.querySelector('#btn-quick-expense')?.addEventListener('click', () => onAddTransaction('expense'));
  container.querySelector('#btn-quick-income')?.addEventListener('click', () => onAddTransaction('income'));
  container.querySelector('#btn-quick-cost')?.addEventListener('click', () => onNavigate('tools'));
  container.querySelector('#btn-quick-budget')?.addEventListener('click', () => onNavigate('budgets'));
  container.querySelector('#btn-view-all-tx')?.addEventListener('click', () => onNavigate('transactions'));
  container.querySelector('#btn-empty-add-tx')?.addEventListener('click', () => onAddTransaction('expense'));
  container.querySelector('#card-stat-income')?.addEventListener('click', () => onAddTransaction('income'));
  container.querySelector('#card-stat-expense')?.addEventListener('click', () => onAddTransaction('expense'));
  container.querySelector('#card-stat-savings')?.addEventListener('click', () => onNavigate('budgets'));
  container.querySelector('#card-safe-spend')?.addEventListener('click', () => onNavigate('budgets'));

  // Attach sponsored deals dismiss handler
  attachSponsoredDealEvents(container);

  // Play local background video smoothly with muted setting
  const videoEl = container.querySelector('.hero-bg-video');
  if (videoEl) {
    videoEl.muted = true;
    videoEl.defaultMuted = true;
    videoEl.play().catch(() => {});
  }

  createIcons({ icons });
}
