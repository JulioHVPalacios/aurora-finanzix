/* ==========================================================================
   VALO OS - FINANCIAL INTELLIGENCE & REPORTS HUB
   Seamless Sub-Tab Switcher (Charts, Goals & Limits, Quick Tools)
   ========================================================================== */

import { storage } from '../services/storage.js';
import { getFinancialMetrics, getCategoryBreakdown } from '../services/analytics.js';
import { calculateSplitBill, calculateLoanAmortization } from '../services/costCalculator.js';
import { t, formatCurrency, getCategoryName } from '../services/i18n.js';
import { fxService, SUPPORTED_CURRENCIES } from '../services/fxService.js';
import { createIcons, icons } from 'lucide';
import confetti from 'canvas-confetti';
import Chart from 'chart.js/auto';

let doughnutChartInstance = null;

export function renderAnalytics(container) {
  let activeSubTab = 'charts'; // 'charts' | 'budgets' | 'tools'

  function renderShell() {
    container.innerHTML = `
      <div class="view-transition-wrap">
        <!-- Header -->
        <div>
          <h2 style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; color: var(--ink);">
            ${t('reports_title')}
          </h2>
          <p style="font-size: 0.74rem; color: var(--ink-60);">${t('reports_sub')}</p>
        </div>

        <!-- Segmented Navigation Pills -->
        <div class="segmented-control" id="analytics-segmented-control" style="margin-top: 10px;">
          <button type="button" class="segment-btn ${activeSubTab === 'charts' ? 'active' : ''}" data-tab="charts">
            <i data-lucide="bar-chart-3" style="width: 14px; height: 14px; margin-right: 4px;"></i>
            <span>${t('reports_tab_charts')}</span>
          </button>
          <button type="button" class="segment-btn ${activeSubTab === 'budgets' ? 'active' : ''}" data-tab="budgets">
            <i data-lucide="target" style="width: 14px; height: 14px; margin-right: 4px;"></i>
            <span>${t('reports_tab_budgets')}</span>
          </button>
          <button type="button" class="segment-btn ${activeSubTab === 'tools' ? 'active' : ''}" data-tab="tools">
            <i data-lucide="wrench" style="width: 14px; height: 14px; margin-right: 4px;"></i>
            <span>${t('reports_tab_tools')}</span>
          </button>
        </div>

        <!-- Dynamic Sub-view Content Container -->
        <div id="reports-subview-content"></div>
      </div>
    `;

    // Attach Tab listeners
    container.querySelectorAll('#analytics-segmented-control .segment-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (tab && tab !== activeSubTab) {
          activeSubTab = tab;
          container.querySelectorAll('#analytics-segmented-control .segment-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          renderActiveSubView();
        }
      });
    });

    renderActiveSubView();
    createIcons({ icons, nameAttr: 'data-lucide', root: container });
  }

  function renderActiveSubView() {
    const subContainer = container.querySelector('#reports-subview-content');
    if (!subContainer) return;

    if (activeSubTab === 'charts') {
      renderChartsTab(subContainer);
    } else if (activeSubTab === 'budgets') {
      renderBudgetsTab(subContainer);
    } else if (activeSubTab === 'tools') {
      renderToolsTab(subContainer);
    }
  }

  renderShell();
}

// --------------------------------------------------------------------------
// Sub-Tab 1: Charts & Diagnostic
// --------------------------------------------------------------------------
function renderChartsTab(container) {
  const metrics = getFinancialMetrics() || { netBalance: 0, totalIncome: 0, totalExpense: 0, savingsRate: 0, fixedExpense: 0, variableExpense: 0 };
  
  // Safely extract category breakdown data
  const breakdownObj = getCategoryBreakdown('expense') || { total: 0, breakdown: [] };
  const breakdownItems = Array.isArray(breakdownObj.breakdown) ? breakdownObj.breakdown : [];
  
  const labels = breakdownItems.map(item => item.name || 'General');
  const data = breakdownItems.map(item => Number(item.amount || 0));
  const colors = breakdownItems.map(item => item.color || '#4F46E5');

  let diagText = t('reports_diag_deficit');
  let diagColor = '#DC2626';
  if (metrics.savingsRate >= 30) {
    diagText = t('reports_diag_excellent');
    diagColor = '#059669';
  } else if (metrics.savingsRate >= 15) {
    diagText = t('reports_diag_healthy');
    diagColor = '#0F172A';
  } else if (metrics.savingsRate > 0) {
    diagText = t('reports_diag_moderate');
    diagColor = '#D97706';
  }

  container.innerHTML = `
    <!-- Diagnostic Card -->
    <div class="glass-card" style="background: #FFFFFF; border: 1px solid rgba(15, 23, 42, 0.08); margin-top: 10px; box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <div>
          <span style="font-size: 0.68rem; color: var(--ink-60); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">${t('reports_savings_rate')}</span>
          <div style="font-family: var(--font-display); font-size: 2rem; font-weight: 800; color: #0F172A;">
            ${metrics.savingsRate || 0}%
          </div>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 0.68rem; color: var(--ink-60); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">${t('reports_diagnostic')}</span>
          <div style="font-family: var(--font-display); font-weight: 800; font-size: 0.96rem; color: ${diagColor};">
            ${diagText}
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding-top: 10px; border-top: 1px solid rgba(15, 23, 42, 0.08); font-size: 0.8rem;">
        <div>
          <span style="color: var(--ink-60); font-size: 0.72rem;">${t('reports_fixed_expenses')}</span>
          <div style="font-family: var(--font-mono); font-weight: 800; color: #0F172A; margin-top: 2px;">
            ${formatCurrency(metrics.fixedExpense || 0)}
          </div>
        </div>
        <div style="text-align: right;">
          <span style="color: var(--ink-60); font-size: 0.72rem;">${t('reports_variable_expenses')}</span>
          <div style="font-family: var(--font-mono); font-weight: 800; color: #0F172A; margin-top: 2px;">
            ${formatCurrency(metrics.variableExpense || 0)}
          </div>
        </div>
      </div>
    </div>

    <!-- Category Expense Breakdown Donut Chart -->
    <div class="glass-card" style="background: #FFFFFF; border: 1px solid rgba(15, 23, 42, 0.08); box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03);">
      <div class="card-header">
        <span class="card-title">${t('reports_expense_breakdown')}</span>
      </div>

      <div style="position: relative; height: 190px; width: 100%; display: flex; align-items: center; justify-content: center;">
        ${breakdownItems.length > 0 ? `
          <canvas id="categoryDonutChart"></canvas>
        ` : `
          <div style="color: var(--ink-40); font-size: 0.82rem; text-align: center;">
            <i data-lucide="pie-chart" style="width: 32px; height: 32px; color: var(--ink-40); margin-bottom: 6px;"></i>
            <div>${t('reports_no_expense_data')}</div>
          </div>
        `}
      </div>

      <!-- Legend List -->
      ${breakdownItems.length > 0 ? `
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 14px; border-top: 1px solid rgba(15, 23, 42, 0.06); padding-top: 10px;">
          ${breakdownItems.map((item, idx) => `
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="display: inline-block; width: 9px; height: 9px; border-radius: 50%; background: ${colors[idx] || '#6366F1'};"></span>
                <span style="color: var(--ink); font-weight: 600;">${item.name}</span>
              </div>
              <span style="font-family: var(--font-mono); font-weight: 700; color: var(--ink-75);">${formatCurrency(item.amount)}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;

  createIcons({ icons, nameAttr: 'data-lucide', root: container });

  if (breakdownItems.length > 0) {
    const canvas = container.querySelector('#categoryDonutChart');
    if (canvas) {
      if (doughnutChartInstance) {
        try { doughnutChartInstance.destroy(); } catch (e) {}
      }

      doughnutChartInstance = new Chart(canvas, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: colors,
            borderWidth: 2,
            borderColor: '#FFFFFF'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          cutout: '72%'
        }
      });
    }
  }
}

// --------------------------------------------------------------------------
// Sub-Tab 2: Goals & Budgets
// --------------------------------------------------------------------------
function renderBudgetsTab(container) {
  const settings = storage.getSettings() || {};
  const symbol = settings.currencySymbol || 'S/';
  const categories = (storage.getCategories() || []).filter(c => c.type === 'expense');
  const transactions = storage.getTransactions() || [];
  let budgets = storage.getBudgets() || {};
  let savingsGoals = storage.getSavingsGoals() || [];

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const spentPerCategory = {};
  transactions.forEach(tx => {
    if (tx.type === 'expense' && tx.date && tx.date.startsWith(currentMonthKey)) {
      const catId = tx.category || tx.categoryId;
      spentPerCategory[catId] = (spentPerCategory[catId] || 0) + Number(tx.amount || 0);
    }
  });

  container.innerHTML = `
    <!-- Section 1: Savings Goals (Huchas de Ahorro) -->
    <div class="glass-card" style="background: #FFFFFF; border: 1px solid rgba(15, 23, 42, 0.08); margin-top: 10px; box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03);">
      <div class="card-header">
        <span class="card-title">${t('goals_active_title')}</span>
        <button type="button" id="btn-add-goal-sub" class="btn btn-primary" style="padding: 6px 12px; font-size: 0.76rem;">
          ${t('goals_new_btn')}
        </button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${savingsGoals.length === 0 ? `
          <div style="text-align: center; padding: 22px; color: var(--ink-60); font-size: 0.82rem; background: #F8FAFC; border-radius: 14px; border: 1px solid rgba(15, 23, 42, 0.06);">
            ${t('goals_empty')}
          </div>
        ` : savingsGoals.map(goal => {
          const current = Number(goal.currentAmount || goal.current || 0);
          const target = Number(goal.targetAmount || goal.target || 1);
          const pct = Math.min(100, Math.round((current / target) * 100));
          const isCompleted = current >= target;

          return `
            <div style="background: #FFFFFF; border: 1.5px solid ${isCompleted ? '#059669' : 'rgba(15, 23, 42, 0.08)'}; border-radius: var(--radius-md); padding: 12px 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <div>
                  <div style="font-family: var(--font-display); font-weight: 800; font-size: 0.94rem; color: var(--ink); display: flex; align-items: center; gap: 6px;">
                    <i data-lucide="${isCompleted ? 'check-circle' : 'target'}" style="width: 16px; height: 16px; color: ${isCompleted ? '#059669' : '#0F172A'};"></i>
                    <span>${goal.title || goal.name}</span>
                  </div>
                  <div style="font-size: 0.74rem; color: var(--ink-60); margin-top: 2px;">
                    ${formatCurrency(current)} ${t('goals_of')} <strong>${formatCurrency(target)}</strong>
                  </div>
                </div>
                <span style="font-family: var(--font-mono); font-weight: 800; font-size: 0.85rem; color: ${isCompleted ? '#059669' : '#0F172A'};">
                  ${pct}%
                </span>
              </div>

              <div class="budget-progress-track" style="margin-bottom: 10px;">
                <div class="budget-progress-bar" style="width: ${pct}%; background: ${isCompleted ? '#059669' : '#0F172A'};"></div>
              </div>

              <div style="display: flex; gap: 8px; justify-content: flex-end;">
                <button type="button" class="btn btn-secondary btn-add-savings-sub" data-id="${goal.id}" style="padding: 5px 12px; font-size: 0.74rem;">
                  <i data-lucide="plus-circle" style="width: 13px; height: 13px; margin-right: 4px;"></i>
                  ${t('goals_add_funds')}
                </button>
                <button type="button" class="btn btn-danger btn-delete-goal-sub" data-id="${goal.id}" style="padding: 5px 10px; font-size: 0.74rem;" title="${t('goals_delete')}">
                  <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Section 2: Category Budgets -->
    <div class="glass-card" style="background: #FFFFFF; border: 1px solid rgba(15, 23, 42, 0.08); box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03);">
      <div class="card-header">
        <span class="card-title">${t('goals_cat_budgets')}</span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${categories.map(cat => {
          const spent = spentPerCategory[cat.id] || 0;
          const limit = budgets[cat.id] || 0;
          const pct = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
          const isOver = limit > 0 && spent > limit;

          return `
            <div style="border-bottom: 1px solid rgba(15, 23, 42, 0.06); padding-bottom: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div style="width: 26px; height: 26px; border-radius: 8px; background: #F1F5F9; color: var(--ink); display: flex; align-items: center; justify-content: center;">
                    <i data-lucide="${cat.icon || 'receipt'}" style="width: 14px; height: 14px;"></i>
                  </div>
                  <span style="font-weight: 700; font-size: 0.85rem; color: var(--ink);">${getCategoryName(cat)}</span>
                </div>
                
                <button type="button" class="btn btn-secondary btn-set-cat-budget-sub" data-id="${cat.id}" data-name="${getCategoryName(cat)}" data-current="${limit}" style="padding: 4px 10px; font-size: 0.72rem;">
                  ${limit > 0 ? formatCurrency(limit) : t('goals_set_limit')}
                </button>
              </div>

              ${limit > 0 ? `
                <div class="budget-progress-track" style="margin-bottom: 4px;">
                  <div class="budget-progress-bar" style="width: ${pct}%; background: ${isOver ? '#DC2626' : pct > 80 ? '#D97706' : '#059669'};"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--ink-60);">
                  <span>${t('goals_spent')} <strong>${formatCurrency(spent)}</strong></span>
                  <span style="color: ${isOver ? '#DC2626' : '#059669'}; font-weight: 700;">
                    ${isOver ? t('goals_exceeded') : `${t('goals_available')} ${formatCurrency(limit - spent)}`}
                  </span>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Bind Listeners
  container.querySelector('#btn-add-goal-sub')?.addEventListener('click', () => {
    const title = prompt(t('goals_new_btn') + ':');
    if (!title) return;
    const targetStr = prompt('Meta de ahorro (' + symbol + '):', '500');
    const target = Number(targetStr);
    if (!target || isNaN(target)) return;

    savingsGoals.push({
      id: 'goal_' + Date.now(),
      title,
      targetAmount: target,
      currentAmount: 0
    });
    storage.saveSavingsGoals(savingsGoals);
    renderBudgetsTab(container);
  });

  container.querySelectorAll('.btn-add-savings-sub').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const goal = savingsGoals.find(g => g.id === id);
      if (!goal) return;

      const amountStr = prompt(`Abonar fondos a "${goal.title}":`, '50');
      const amount = Number(amountStr);
      if (!amount || isNaN(amount)) return;

      goal.currentAmount = (goal.currentAmount || 0) + amount;
      storage.saveSavingsGoals(savingsGoals);

      if (goal.currentAmount >= goal.targetAmount) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
      renderBudgetsTab(container);
    });
  });

  container.querySelectorAll('.btn-delete-goal-sub').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (confirm('¿Eliminar esta meta de ahorro?')) {
        savingsGoals = savingsGoals.filter(g => g.id !== id);
        storage.saveSavingsGoals(savingsGoals);
        renderBudgetsTab(container);
      }
    });
  });

  container.querySelectorAll('.btn-set-cat-budget-sub').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const current = btn.getAttribute('data-current');

      const limitStr = prompt(`Fijar presupuesto mensual para "${name}" (${symbol}):`, current || '300');
      if (limitStr === null) return;
      const limit = Number(limitStr);
      if (isNaN(limit)) return;

      budgets[id] = limit;
      storage.saveBudgets(budgets);
      renderBudgetsTab(container);
    });
  });

  createIcons({ icons, nameAttr: 'data-lucide', root: container });
}

// --------------------------------------------------------------------------
// Sub-Tab 3: Quick Utilities
// --------------------------------------------------------------------------
function renderToolsTab(container) {
  const settings = storage.getSettings() || {};
  const symbol = settings.currencySymbol || 'S/';

  let toolMode = 'split';

  function updateToolsView() {
    container.innerHTML = `
      <div style="margin-top: 10px;">
        <!-- Inner tool selector -->
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 12px;">
          <button type="button" class="btn ${toolMode === 'split' ? 'btn-primary' : 'btn-secondary'} btn-tool-switch" data-mode="split" style="font-size: 0.75rem; padding: 8px 4px;">
            ${t('tools_tab_split')}
          </button>
          <button type="button" class="btn ${toolMode === 'loan' ? 'btn-primary' : 'btn-secondary'} btn-tool-switch" data-mode="loan" style="font-size: 0.75rem; padding: 8px 4px;">
            ${t('tools_tab_loan')}
          </button>
          <button type="button" class="btn ${toolMode === 'fx' ? 'btn-primary' : 'btn-secondary'} btn-tool-switch" data-mode="fx" style="font-size: 0.75rem; padding: 8px 4px;">
            ${t('tools_tab_fx')}
          </button>
        </div>

        <div id="inner-tool-active-area"></div>
      </div>
    `;

    const activeArea = container.querySelector('#inner-tool-active-area');

    if (toolMode === 'split') {
      renderInnerSplitBill(activeArea, symbol);
    } else if (toolMode === 'loan') {
      renderInnerLoan(activeArea, symbol);
    } else if (toolMode === 'fx') {
      renderInnerFx(activeArea, symbol);
    }

    container.querySelectorAll('.btn-tool-switch').forEach(btn => {
      btn.addEventListener('click', () => {
        toolMode = btn.getAttribute('data-mode');
        updateToolsView();
      });
    });

    createIcons({ icons, nameAttr: 'data-lucide', root: container });
  }

  updateToolsView();
}

function renderInnerSplitBill(container, symbol) {
  let state = { totalAmount: 160, numPeople: 4, tipPercentage: 10 };

  function render() {
    const res = calculateSplitBill(state);
    container.innerHTML = `
      <div class="glass-card" style="background: #FFFFFF; border: 1px solid rgba(15, 23, 42, 0.08); box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03);">
        <div class="card-header">
          <span class="card-title">${t('tools_split_title')}</span>
        </div>

        <!-- Result Box -->
        <div style="background: #F8FAFC; border: 1.5px solid rgba(15, 23, 42, 0.08); border-radius: var(--radius-md); padding: 16px; text-align: center; margin-bottom: 14px;">
          <div style="font-size: 0.70rem; color: var(--ink-60); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">${t('tools_split_each_pays')}</div>
          <div style="font-family: var(--font-display); font-size: 2.2rem; font-weight: 800; color: #0F172A; margin: 4px 0;">
            ${formatCurrency(res.perPerson)}
          </div>
          <div style="font-size: 0.76rem; color: var(--ink-75);">
            ${t('tools_split_total_with_tip')} <strong>${formatCurrency(res.grandTotal)}</strong> (${t('tools_split_tip_label')} ${formatCurrency(res.tipAmount)})
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div class="form-group">
            <label class="form-label">${t('tools_split_bill_amount')} (${symbol})</label>
            <input type="number" id="split-bill-amount" class="input-control" value="${state.totalAmount}" min="1" step="0.5" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="form-group">
              <label class="form-label">${t('tools_split_people_count')}</label>
              <input type="number" id="split-people" class="input-control" value="${state.numPeople}" min="1" max="50" />
            </div>
            <div class="form-group">
              <label class="form-label">${t('tools_split_tip_percent')}</label>
              <select id="split-tip" class="input-control">
                <option value="0" ${state.tipPercentage === 0 ? 'selected' : ''}>0%</option>
                <option value="5" ${state.tipPercentage === 5 ? 'selected' : ''}>5%</option>
                <option value="10" ${state.tipPercentage === 10 ? 'selected' : ''}>10%</option>
                <option value="15" ${state.tipPercentage === 15 ? 'selected' : ''}>15%</option>
                <option value="20" ${state.tipPercentage === 20 ? 'selected' : ''}>20%</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    `;

    container.querySelector('#split-bill-amount')?.addEventListener('input', (e) => {
      state.totalAmount = Number(e.target.value) || 0;
      render();
    });
    container.querySelector('#split-people')?.addEventListener('input', (e) => {
      state.numPeople = Number(e.target.value) || 1;
      render();
    });
    container.querySelector('#split-tip')?.addEventListener('change', (e) => {
      state.tipPercentage = Number(e.target.value) || 0;
      render();
    });
  }

  render();
}

function renderInnerLoan(container, symbol) {
  let state = { principal: 5000, rate: 18, rateType: 'TEA', term: 12, termUnit: 'months', system: 'french' };

  function render() {
    const res = calculateLoanAmortization(state);
    container.innerHTML = `
      <div class="glass-card" style="background: #FFFFFF; border: 1px solid rgba(15, 23, 42, 0.08); box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03);">
        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span class="card-title">${t('tools_loan_title')}</span>
          <span class="edge-live-badge" style="background: #EEF2FF; color: #4F46E5;">
            Bancario Real
          </span>
        </div>

        <!-- Result Box -->
        <div style="background: linear-gradient(135deg, #0F172A, #1E293B); color: #FFFFFF; border-radius: var(--radius-md); padding: 18px; text-align: center; margin-bottom: 14px;">
          <div style="font-size: 0.68rem; color: #94A3B8; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">${t('tools_loan_monthly_payment')}</div>
          <div style="font-family: var(--font-display); font-size: 2.2rem; font-weight: 800; color: #FFFFFF; margin: 4px 0;">
            ${res.isDecreasing ? `${formatCurrency(res.firstPayment)} → ${formatCurrency(res.lastPayment)}` : formatCurrency(res.monthlyPayment)}
          </div>
          <div style="font-size: 0.74rem; color: #CBD5E1; display: flex; justify-content: center; gap: 14px; margin-top: 6px;">
            <span>${t('tools_loan_total_interest')} <strong>${formatCurrency(res.totalInterest)}</strong></span>
            <span>Total: <strong>${formatCurrency(res.totalPaid)}</strong></span>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div class="form-group">
            <label class="form-label">${t('tools_loan_amount')} (${symbol})</label>
            <input type="number" id="loan-principal" class="input-control" value="${state.principal}" step="500" min="100" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="form-group">
              <label class="form-label">${t('tools_loan_interest_rate')} (%)</label>
              <input type="number" id="loan-rate" class="input-control" value="${state.rate}" step="0.5" min="0" />
            </div>
            <div class="form-group">
              <label class="form-label">Tipo de Tasa</label>
              <select id="loan-ratetype" class="input-control">
                <option value="TEA" ${state.rateType === 'TEA' ? 'selected' : ''}>TEA (Efectiva Anual)</option>
                <option value="TEM" ${state.rateType === 'TEM' ? 'selected' : ''}>TEM (Mensual)</option>
                <option value="TNA" ${state.rateType === 'TNA' ? 'selected' : ''}>TNA (Nominal)</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="form-group">
              <label class="form-label">${t('tools_loan_months')}</label>
              <input type="number" id="loan-term" class="input-control" value="${state.term}" min="1" max="360" />
            </div>
            <div class="form-group">
              <label class="form-label">Sistema</label>
              <select id="loan-system" class="input-control">
                <option value="french" ${state.system === 'french' ? 'selected' : ''}>Francés (Fija)</option>
                <option value="german" ${state.system === 'german' ? 'selected' : ''}>Alemán (Decreciente)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    `;

    container.querySelector('#loan-principal')?.addEventListener('input', (e) => {
      state.principal = Number(e.target.value) || 0;
      render();
    });
    container.querySelector('#loan-rate')?.addEventListener('input', (e) => {
      state.rate = Number(e.target.value) || 0;
      render();
    });
    container.querySelector('#loan-ratetype')?.addEventListener('change', (e) => {
      state.rateType = e.target.value;
      render();
    });
    container.querySelector('#loan-term')?.addEventListener('input', (e) => {
      state.term = Number(e.target.value) || 1;
      render();
    });
    container.querySelector('#loan-system')?.addEventListener('change', (e) => {
      state.system = e.target.value;
      render();
    });
  }

  render();
}

function renderInnerFx(container, defaultSymbol) {
  let state = { amount: 100, from: 'USD', to: 'PEN' };

  function render() {
    const result = fxService.convert(state.amount, state.from, state.to);
    const unitRate = fxService.getRate(state.from, state.to);
    const fxStatus = fxService.getStatus();
    const toCurr = SUPPORTED_CURRENCIES.find(c => c.code === state.to) || { symbol: state.to };

    container.innerHTML = `
      <div class="glass-card" style="background: #FFFFFF; border: 1px solid rgba(15, 23, 42, 0.08); box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03);">
        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span class="card-title">${t('tools_fx_title')}</span>
          <span style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.68rem; font-weight: 700; color: #059669; background: #ECFDF5; padding: 3px 8px; border-radius: 999px;">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: #10B981; display: inline-block;"></span>
            En vivo (Interbancario)
          </span>
        </div>

        <!-- Result Box -->
        <div style="background: #F8FAFC; border: 1.5px solid rgba(15, 23, 42, 0.08); border-radius: var(--radius-md); padding: 18px; text-align: center; margin-bottom: 14px;">
          <div style="font-size: 0.70rem; color: var(--ink-60); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">${t('tools_fx_result')}</div>
          <div style="font-family: var(--font-display); font-size: 2.2rem; font-weight: 800; color: #0F172A; margin: 4px 0;">
            ${toCurr.symbol} ${result.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style="font-size: 0.76rem; color: #64748B; font-family: var(--font-mono); margin-top: 4px;">
            1 ${state.from} = ${unitRate.toFixed(4)} ${state.to}
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div class="form-group">
            <label class="form-label">${t('tools_fx_amount')}</label>
            <input type="number" id="fx-amount" class="input-control" value="${state.amount}" step="10" min="0" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 8px; align-items: flex-end;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">${t('tools_fx_from')}</label>
              <select id="fx-from" class="input-control">
                ${SUPPORTED_CURRENCIES.map(c => `
                  <option value="${c.code}" ${state.from === c.code ? 'selected' : ''}>
                    ${c.flag} ${c.code} (${c.name})
                  </option>
                `).join('')}
              </select>
            </div>

            <button type="button" id="btn-swap-fx" style="width: 38px; height: 38px; border-radius: 10px; border: 1.5px solid rgba(15, 23, 42, 0.1); background: #FFFFFF; color: var(--ink); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s; margin-bottom: 2px;" title="Invertir monedas">
              ⇄
            </button>

            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">${t('tools_fx_to')}</label>
              <select id="fx-to" class="input-control">
                ${SUPPORTED_CURRENCIES.map(c => `
                  <option value="${c.code}" ${state.to === c.code ? 'selected' : ''}>
                    ${c.flag} ${c.code} (${c.name})
                  </option>
                `).join('')}
              </select>
            </div>
          </div>
        </div>
      </div>
    `;

    container.querySelector('#fx-amount')?.addEventListener('input', (e) => {
      state.amount = Number(e.target.value) || 0;
      render();
    });
    container.querySelector('#fx-from')?.addEventListener('change', (e) => {
      state.from = e.target.value;
      if (state.from === state.to) {
        state.to = state.from === 'USD' ? 'PEN' : 'USD';
      }
      render();
    });
    container.querySelector('#fx-to')?.addEventListener('change', (e) => {
      state.to = e.target.value;
      if (state.to === state.from) {
        state.from = state.to === 'USD' ? 'PEN' : 'USD';
      }
      render();
    });
    container.querySelector('#btn-swap-fx')?.addEventListener('click', () => {
      const temp = state.from;
      state.from = state.to;
      state.to = temp;
      render();
    });
  }

  window.addEventListener('valo:fx-updated', () => {
    render();
  }, { once: true });

  render();
}
