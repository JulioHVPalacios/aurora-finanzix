/* ==========================================================================
   AURORA FINANZIX - REPORTS & FINANCIAL INTELLIGENCE (LIQUID GLASS EDITION)
   Integrated Reports, Savings Goals, Budgets & Financial Utilities Hub
   ========================================================================== */

import { storage } from '../services/storage.js';
import { getFinancialMetrics, getCategoryBreakdown } from '../services/analytics.js';
import { renderBudgets } from './BudgetsView.js';
import { renderTools } from './ToolsView.js';
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
            📊 Centro Financiero & Reportes
          </h2>
          <p style="font-size: 0.74rem; color: var(--ink-60);">Estadísticas, presupuestos, metas de ahorro y utilidades</p>
        </div>

        <!-- Segmented Navigation Pills -->
        <div class="segmented-control">
          <button class="segment-btn ${activeSubTab === 'charts' ? 'active' : ''}" data-tab="charts">
            📊 Gráficos
          </button>
          <button class="segment-btn ${activeSubTab === 'budgets' ? 'active' : ''}" data-tab="budgets">
            🎯 Metas & Límites
          </button>
          <button class="segment-btn ${activeSubTab === 'tools' ? 'active' : ''}" data-tab="tools">
            🛠️ Utilidades
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
  }

  update();
}

function renderChartsSection(container) {
  const metrics = getFinancialMetrics() || { netBalance: 0, totalIncome: 0, totalExpense: 0, savingsRate: 0, fixedExpense: 0, variableExpense: 0 };
  const settings = storage.getSettings() || {};
  const symbol = settings.currencySymbol || 'S/';
  const breakdownData = getCategoryBreakdown('expense');

  container.innerHTML = `
    <!-- Financial Health Diagnostic Card -->
    <div class="glass-card" style="background: linear-gradient(135deg, rgba(238, 242, 255, 0.95), rgba(245, 243, 255, 0.9)); border: 1.5px solid rgba(79, 70, 229, 0.2); margin-top: 10px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <div>
          <span style="font-size: 0.72rem; color: var(--ink-60); text-transform: uppercase; font-weight: 700;">Tasa de Ahorro</span>
          <div style="font-family: var(--font-display); font-size: 2rem; font-weight: 800; color: #4F46E5;">
            ${metrics.savingsRate || 0}%
          </div>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 0.72rem; color: var(--ink-60); text-transform: uppercase; font-weight: 700;">Diagnóstico</span>
          <div style="font-family: var(--font-display); font-weight: 800; font-size: 0.96rem; color: ${metrics.savingsRate >= 30 ? '#059669' : metrics.savingsRate >= 15 ? '#2563EB' : '#D97706'};">
            ${metrics.savingsRate >= 30 ? '🌟 Excelente Ahorro' : metrics.savingsRate >= 15 ? '👍 Flujo Saludable' : metrics.savingsRate > 0 ? '⚠️ Ahorro Moderado' : '🚨 En Déficit'}
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding-top: 10px; border-top: 1px solid rgba(79, 70, 229, 0.12); font-size: 0.8rem;">
        <div>
          <span style="color: var(--ink-60);">Gastos Fijos (Renta/Luz):</span>
          <strong style="font-family: var(--font-mono); display: block; color: var(--ink); margin-top: 2px;">${symbol}${(metrics.fixedExpense || 0).toFixed(2)}</strong>
        </div>
        <div>
          <span style="color: var(--ink-60);">Gastos Variables (Ocio/Compras):</span>
          <strong style="font-family: var(--font-mono); display: block; color: var(--ink); margin-top: 2px;">${symbol}${(metrics.variableExpense || 0).toFixed(2)}</strong>
        </div>
      </div>
    </div>

    <!-- Expense Distribution Doughnut Chart -->
    <div class="glass-card" style="margin-top: 12px;">
      <div class="card-header">
        <span class="card-title">🍩 ¿En qué se va tu dinero?</span>
      </div>

      ${(!breakdownData.breakdown || breakdownData.breakdown.length === 0) ? `
        <div style="text-align: center; padding: 24px; color: var(--ink-60); font-size: 0.84rem; background: #F8FAFC; border-radius: 16px;">
          No hay gastos registrados para analizar este mes.
        </div>
      ` : `
        <div style="position: relative; height: 210px; width: 100%; margin: 8px 0;">
          <canvas id="chart-doughnut-categories"></canvas>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 14px;">
          ${breakdownData.breakdown.slice(0, 5).map(item => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: #F8FAFC; border-radius: 10px; font-size: 0.82rem;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: ${item.color || '#4F46E5'};"></span>
                <span style="font-weight: 700; color: var(--ink);">${item.name}</span>
              </div>
              <div>
                <strong style="font-family: var(--font-mono); color: var(--ink);">${symbol}${item.amount.toFixed(2)}</strong>
                <span style="color: var(--ink-60); font-size: 0.74rem; margin-left: 4px;">(${item.percentage}%)</span>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;

  // Initialize Chart.js
  if (breakdownData.breakdown && breakdownData.breakdown.length > 0) {
    const ctx = container.querySelector('#chart-doughnut-categories')?.getContext('2d');
    if (ctx) {
      if (doughnutChartInstance) doughnutChartInstance.destroy();

      doughnutChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: breakdownData.breakdown.map(b => b.name),
          datasets: [{
            data: breakdownData.breakdown.map(b => b.amount),
            backgroundColor: [
              '#4F46E5', '#10B981', '#F43F5E', '#F59E0B', '#06B6D4', '#8B5CF6', '#EC4899', '#64748B'
            ],
            borderWidth: 3,
            borderColor: '#FFFFFF'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          cutout: '70%'
        }
      });
    }
  }
}
