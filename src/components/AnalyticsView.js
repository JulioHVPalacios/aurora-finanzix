/* ==========================================================================
   AURORA FINANZIX - REPORTS & FINANCIAL INTELLIGENCE (LUXURY FINTECH HUB)
   Integrated Reports, Savings Goals, Budgets & Financial Utilities Hub
   ========================================================================== */

import { storage } from '../services/storage.js';
import { getFinancialMetrics, getCategoryBreakdown } from '../services/analytics.js';
import { t, formatCurrency } from '../services/i18n.js';
import { renderBudgets } from './BudgetsView.js';
import { renderTools } from './ToolsView.js';
import { createIcons, icons } from 'lucide';
import Chart from 'chart.js/auto';

let doughnutChartInstance = null;

export function renderAnalytics(container) {
  let activeSubTab = 'charts'; // 'charts' | 'budgets' | 'tools'

  function update() {
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
        <div class="segmented-control">
          <button class="segment-btn ${activeSubTab === 'charts' ? 'active' : ''}" data-tab="charts">
            <i data-lucide="bar-chart-3" style="width: 14px; height: 14px; margin-right: 4px;"></i>
            ${t('reports_tab_charts')}
          </button>
          <button class="segment-btn ${activeSubTab === 'budgets' ? 'active' : ''}" data-tab="budgets">
            <i data-lucide="target" style="width: 14px; height: 14px; margin-right: 4px;"></i>
            ${t('reports_tab_budgets')}
          </button>
          <button class="segment-btn ${activeSubTab === 'tools' ? 'active' : ''}" data-tab="tools">
            <i data-lucide="wrench" style="width: 14px; height: 14px; margin-right: 4px;"></i>
            ${t('reports_tab_tools')}
          </button>
        </div>

        <!-- Dynamic Sub-view Container -->
        <div id="reports-subview-content"></div>
      </div>
    `;

    const subContainer = container.querySelector('#reports-subview-content');

    if (activeSubTab === 'charts') {
      renderChartsSection(subContainer);
    } else if (activeSubTab === 'budgets') {
      renderBudgets(subContainer, {
        onShowToast: (msg, type) => {
          const toast = document.createElement('div');
          toast.className = `toast ${type}`;
          toast.innerHTML = `<span>✓</span><span>${msg}</span>`;
          document.getElementById('toast-container')?.appendChild(toast);
          setTimeout(() => toast.remove(), 2500);
        }
      });
    } else if (activeSubTab === 'tools') {
      renderTools(subContainer);
    }

    // Attach Sub-tab Listeners
    container.querySelectorAll('.segment-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeSubTab = btn.getAttribute('data-tab');
        update();
      });
    });

    createIcons({ icons });
  }

  update();
}

function renderChartsSection(container) {
  const metrics = getFinancialMetrics() || { netBalance: 0, totalIncome: 0, totalExpense: 0, savingsRate: 0, fixedExpense: 0, variableExpense: 0 };
  const settings = storage.getSettings() || {};
  const symbol = settings.currencySymbol || 'S/';
  const breakdownData = getCategoryBreakdown('expense');

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
    <!-- Financial Health Diagnostic Card -->
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

      <div style="position: relative; height: 200px; width: 100%; display: flex; align-items: center; justify-content: center;">
        ${breakdownData.labels.length > 0 ? `
          <canvas id="categoryDonutChart"></canvas>
        ` : `
          <div style="color: var(--ink-40); font-size: 0.82rem; text-align: center;">
            <i data-lucide="pie-chart" style="width: 32px; height: 32px; color: var(--ink-40); margin-bottom: 6px;"></i>
            <div>${t('reports_no_expense_data')}</div>
          </div>
        `}
      </div>

      <!-- Legend List -->
      ${breakdownData.labels.length > 0 ? `
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 14px; border-top: 1px solid rgba(15, 23, 42, 0.06); padding-top: 10px;">
          ${breakdownData.labels.map((label, idx) => `
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="display: inline-block; width: 9px; height: 9px; border-radius: 50%; background: ${breakdownData.colors[idx] || '#6366F1'};"></span>
                <span style="color: var(--ink); font-weight: 600;">${label}</span>
              </div>
              <span style="font-family: var(--font-mono); font-weight: 700; color: var(--ink-75);">${formatCurrency(breakdownData.data[idx])}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;

  createIcons({ icons });

  // Initialize Chart.js
  if (breakdownData.labels.length > 0) {
    const canvas = container.querySelector('#categoryDonutChart');
    if (canvas) {
      if (doughnutChartInstance) {
        doughnutChartInstance.destroy();
      }

      doughnutChartInstance = new Chart(canvas, {
        type: 'doughnut',
        data: {
          labels: breakdownData.labels,
          datasets: [{
            data: breakdownData.data,
            backgroundColor: breakdownData.colors,
            borderWidth: 2,
            borderColor: '#FFFFFF'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          cutout: '72%'
        }
      });
    }
  }
}
