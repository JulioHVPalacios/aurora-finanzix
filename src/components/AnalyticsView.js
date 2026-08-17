/* ==========================================================================
   AURORA LIQUID GLASS - ANALYTICS & STATISTICAL REPORTS
   ========================================================================== */

import { storage } from '../services/storage.js';
import { getFinancialMetrics, getCategoryBreakdown, getMonthlyHistory } from '../services/analytics.js';
import Chart from 'chart.js/auto';

let doughnutChartInstance = null;
let barChartInstance = null;

export function renderAnalytics(container) {
  const metrics = getFinancialMetrics();
  const settings = storage.getSettings();
  const symbol = settings.currencySymbol || 'S/';
  const breakdownData = getCategoryBreakdown('expense');
  const monthlyData = getMonthlyHistory(6);

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <h2 style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 700;">
        📊 Análisis y Estadísticas
      </h2>
    </div>

    <!-- Health Summary Card -->
    <div class="glass-card" style="border-left: 4px solid #10B981;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <div>
          <span style="font-size: 0.72rem; color: var(--ink-60); text-transform: uppercase; font-weight: 600;">Tasa de Ahorro</span>
          <div style="font-family: var(--font-mono); font-size: 1.8rem; font-weight: 800; color: #6EE7B7;">
            ${metrics.savingsRate}%
          </div>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 0.72rem; color: var(--ink-60); text-transform: uppercase; font-weight: 600;">Diagnóstico</span>
          <div style="font-family: var(--font-display); font-weight: 700; font-size: 0.95rem; color: #FFFFFF;">
            ${metrics.savingsRate >= 30 ? '🌟 Excelente' : metrics.savingsRate >= 15 ? '👍 Saludable' : metrics.savingsRate > 0 ? '⚠️ Moderado' : '🚨 En Déficit'}
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding-top: 10px; border-top: 1px solid rgba(255, 255, 255, 0.08); font-size: 0.78rem;">
        <div>
          <span style="color: var(--ink-40);">Gastos Fijos:</span>
          <strong style="font-family: var(--font-mono); display: block; color: #FFFFFF;">${symbol}${metrics.fixedExpense.toFixed(2)}</strong>
        </div>
        <div>
          <span style="color: var(--ink-40);">Gastos Variables:</span>
          <strong style="font-family: var(--font-mono); display: block; color: #FFFFFF;">${symbol}${metrics.variableExpense.toFixed(2)}</strong>
        </div>
      </div>
    </div>

    <!-- 1. Category Breakdown Donut -->
    <div class="glass-card">
      <div class="card-header">
        <span class="card-title">🍩 Distribución de Gastos</span>
      </div>

      ${breakdownData.breakdown.length === 0 ? `
        <div style="text-align: center; padding: 24px; color: var(--ink-40); font-size: 0.85rem;">
          No hay gastos registrados aún.
        </div>
      ` : `
        <div style="position: relative; height: 210px; width: 100%; margin: 8px 0;">
          <canvas id="chart-doughnut-categories"></canvas>
        </div>

        <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 12px;">
          ${breakdownData.breakdown.map(item => `
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem; padding: 4px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.04);">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: ${item.color};"></span>
                <span>${item.icon} ${item.name}</span>
              </div>
              <div style="display: flex; gap: 8px;">
                <span style="color: var(--ink-40); font-size: 0.72rem;">(${item.percentage}%)</span>
                <span style="font-family: var(--font-mono); font-weight: 700;">${symbol}${item.amount.toFixed(2)}</span>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>

    <!-- 2. Monthly Trend Bar Chart -->
    <div class="glass-card">
      <div class="card-header">
        <span class="card-title">📈 Histórico Mensual</span>
      </div>
      <div style="position: relative; height: 210px; width: 100%; margin: 8px 0;">
        <canvas id="chart-bar-monthly"></canvas>
      </div>
    </div>
  `;

  setTimeout(() => {
    const doughnutCanvas = container.querySelector('#chart-doughnut-categories');
    if (doughnutCanvas && breakdownData.breakdown.length > 0) {
      if (doughnutChartInstance) doughnutChartInstance.destroy();

      doughnutChartInstance = new Chart(doughnutCanvas, {
        type: 'doughnut',
        data: {
          labels: breakdownData.breakdown.map(b => `${b.icon} ${b.name}`),
          datasets: [{
            data: breakdownData.breakdown.map(b => b.amount),
            backgroundColor: ['#10B981', '#0EA5E9', '#F59E0B', '#8B5CF6', '#EC4899', '#F43F5E', '#3B82F6', '#14B8A6'],
            borderWidth: 2,
            borderColor: '#040911'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${symbol}${Number(ctx.raw).toFixed(2)}`
              }
            }
          },
          cutout: '72%'
        }
      });
    }

    const barCanvas = container.querySelector('#chart-bar-monthly');
    if (barCanvas) {
      if (barChartInstance) barChartInstance.destroy();

      barChartInstance = new Chart(barCanvas, {
        type: 'bar',
        data: {
          labels: monthlyData.map(m => m.label),
          datasets: [
            {
              label: 'Ingresos',
              data: monthlyData.map(m => m.income),
              backgroundColor: '#10B981',
              borderRadius: 6
            },
            {
              label: 'Gastos',
              data: monthlyData.map(m => m.expense),
              backgroundColor: '#F43F5E',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: { color: '#94A3B8', font: { size: 10 } }
            },
            y: {
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: { color: '#94A3B8', font: { size: 10 } }
            }
          },
          plugins: {
            legend: {
              labels: { color: '#FFFFFF', font: { size: 11, weight: 'bold' } }
            }
          }
        }
      });
    }
  }, 50);
}
