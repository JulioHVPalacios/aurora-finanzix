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

  // Calculate Real Dynamic Spline Curve Coordinates for Liquidity Chart
  const weeks = getWeeklyCashflow() || [];
  const currentDay = new Date().getDate();
  const currentWeekIdx = currentDay <= 7 ? 0 : currentDay <= 14 ? 1 : currentDay <= 21 ? 2 : 3;

  const values = weeks.map(w => w.net);
  const hasData = weeks.some(w => w.count > 0);

  const maxVal = Math.max(...values, 100);
  const minVal = Math.min(...values, -50);
  const range = (maxVal - minVal) || 1;

  const xCoords = [25, 140, 260, 375];
  const points = weeks.map((w, idx) => {
    const x = xCoords[idx];
    let y = 50;
    if (hasData) {
      const normalized = (w.net - minVal) / range;
      y = 65 - (normalized * 45); // between 20 (high) and 65 (low)
    }
    return { x, y: Number(y.toFixed(1)), week: w, idx };
  });

  let splineD = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    splineD += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }

  const areaD = `${splineD} L ${points[points.length - 1].x},90 L ${points[0].x},90 Z`;

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

      <!-- Real Dynamic Interactive Liquidity Flow Chart (Smooth Spline Wave) -->
      <div class="chart-card-glass" style="background: #FFFFFF; border: 1px solid rgba(15, 23, 42, 0.08); border-radius: var(--radius-lg); padding: 18px 20px; box-shadow: 0 4px 20px -4px rgba(15, 23, 42, 0.04);">
        <div class="chart-card-header" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <div class="chart-title-left" style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 28px; height: 28px; border-radius: 8px; background: #EEF2FF; color: #4F46E5; display: flex; align-items: center; justify-content: center;">
              <i data-lucide="activity" style="width: 16px; height: 16px;"></i>
            </div>
            <div>
              <div style="font-weight: 800; font-size: 0.92rem; color: #0F172A;">${t('dash_liquidity_trend')}</div>
              <div style="font-size: 0.65rem; color: #64748B; font-family: var(--font-mono);">${hasData ? `${formatCurrency(metrics.netBalance || 0)} ${t('dash_monthly_flow')}` : 'Curva en tiempo real según tus gastos'}</div>
            </div>
          </div>

          <div style="
            background: ${hasData ? (metrics.netBalance >= 0 ? '#ECFDF5' : '#FFF1F2') : '#F1F5F9'};
            color: ${hasData ? (metrics.netBalance >= 0 ? '#059669' : '#E11D48') : '#64748B'};
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 0.68rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 4px;
          ">
            <i data-lucide="${hasData ? (metrics.netBalance >= 0 ? 'trending-up' : 'trending-down') : 'sparkles'}" style="width: 12px; height: 12px;"></i>
            <span>${hasData ? (metrics.netBalance >= 0 ? `+${formatCurrency(metrics.netBalance)}` : formatCurrency(metrics.netBalance)) : 'En espera de datos'}</span>
          </div>
        </div>

        <!-- Dynamic Smooth Spline SVG -->
        <div style="width: 100%; height: 95px; position: relative;" id="interactive-chart-container">
          <div id="chart-floating-tooltip" style="
            position: absolute;
            top: 2px;
            left: 50%;
            transform: translateX(-50%);
            background: #090D16;
            color: #FFFFFF;
            padding: 5px 12px;
            border-radius: 999px;
            font-size: 0.68rem;
            font-family: var(--font-mono);
            font-weight: 700;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease, transform 0.2s ease;
            z-index: 10;
            white-space: nowrap;
          "></div>

          <svg viewBox="0 0 400 95" preserveAspectRatio="none" style="width: 100%; height: 100%; overflow: visible;">
            <defs>
              <linearGradient id="realFlowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#4F46E5" stop-opacity="0.18"/>
                <stop offset="100%" stop-color="#4F46E5" stop-opacity="0.0"/>
              </linearGradient>
            </defs>
            
            <!-- Shaded Area Under Spline Curve -->
            <path d="${areaD}" fill="url(#realFlowGradient)" />
            
            <!-- Main Dynamic Spline Line -->
            <path d="${splineD}" fill="none" stroke="#4F46E5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

            <!-- Interactive Week Node Dots -->
            ${points.map(p => `
              <circle 
                class="chart-node-dot"
                cx="${p.x}" 
                cy="${p.y}" 
                r="4.5" 
                fill="#FFFFFF" 
                stroke="#4F46E5" 
                stroke-width="2.5"
                data-week-name="${p.week.label}"
                data-week-range="días ${p.week.range}"
                data-income="${formatCurrency(p.week.income)}"
                data-expense="${formatCurrency(p.week.expense)}"
                data-net="${p.week.net >= 0 ? `+${formatCurrency(p.week.net)}` : formatCurrency(p.week.net)}"
                style="cursor: pointer; transition: all 0.2s ease;"
              />
            `).join('')}
          </svg>
        </div>

        <!-- Interactive Legend Row -->
        <div class="chart-legend-row" style="display: flex; justify-content: space-between; margin-top: 10px; font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700; color: #64748B;">
          ${weeks.map((w, idx) => `
            <div class="chart-legend-chip" data-week-idx="${idx}" style="
              cursor: pointer;
              padding: 3px 8px;
              border-radius: 6px;
              background: ${idx === currentWeekIdx ? '#EEF2FF' : 'transparent'};
              color: ${idx === currentWeekIdx ? '#4F46E5' : '#64748B'};
              transition: all 0.2s ease;
            ">
              ${w.label} ${idx === currentWeekIdx ? '(Actual)' : ''}
            </div>
          `).join('')}
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
  container.querySelector('#card-stat-savings')?.addEventListener('click', () => onNavigate('budgets'));
  container.querySelector('.chart-card-glass')?.addEventListener('click', () => onNavigate('analytics'));

  // Interactive Chart Tooltip & Dot Events
  const chartTooltip = container.querySelector('#chart-floating-tooltip');
  const dots = container.querySelectorAll('.chart-node-dot');
  const chips = container.querySelectorAll('.chart-legend-chip');

  const showTooltipForWeek = (name, range, inc, exp, net) => {
    if (!chartTooltip) return;
    chartTooltip.innerHTML = `<strong>${name}</strong> (${range}): <span style="color: #34D399;">+${inc}</span> | <span style="color: #F87171;">-${exp}</span> (${net})`;
    chartTooltip.style.opacity = '1';
  };

  dots.forEach(dot => {
    dot.addEventListener('mouseenter', () => {
      dot.setAttribute('r', '7');
      dot.setAttribute('fill', '#4F46E5');
      showTooltipForWeek(
        dot.dataset.weekName,
        dot.dataset.weekRange,
        dot.dataset.income,
        dot.dataset.expense,
        dot.dataset.net
      );
    });
    dot.addEventListener('mouseleave', () => {
      dot.setAttribute('r', '4.5');
      dot.setAttribute('fill', '#FFFFFF');
      if (chartTooltip) chartTooltip.style.opacity = '0';
    });
  });

  chips.forEach(chip => {
    chip.addEventListener('mouseenter', () => {
      const idx = Number(chip.dataset.weekIdx);
      const dot = dots[idx];
      if (dot) {
        dot.setAttribute('r', '7');
        dot.setAttribute('fill', '#4F46E5');
        showTooltipForWeek(
          dot.dataset.weekName,
          dot.dataset.weekRange,
          dot.dataset.income,
          dot.dataset.expense,
          dot.dataset.net
        );
      }
    });
    chip.addEventListener('mouseleave', () => {
      dots.forEach(d => {
        d.setAttribute('r', '4.5');
        d.setAttribute('fill', '#FFFFFF');
      });
      if (chartTooltip) chartTooltip.style.opacity = '0';
    });
  });

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
