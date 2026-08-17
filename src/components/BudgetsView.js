/* ==========================================================================
   AURORA FINANZIX - BUDGETS & SAVINGS GOALS (LIQUID GLASS EDITION)
   Clear Progress Meters & Motivating Visual Goals
   ========================================================================== */

import { storage } from '../services/storage.js';
import { getFinancialMetrics } from '../services/analytics.js';
import { t, formatCurrency } from '../services/i18n.js';
import { createIcons, icons } from 'lucide';
import confetti from 'canvas-confetti';

export function renderBudgets(container, { onShowToast }) {
  const settings = storage.getSettings() || {};
  const symbol = settings.currencySymbol || 'S/';
  const categories = (storage.getCategories() || []).filter(c => c.type === 'expense');
  const transactions = storage.getTransactions() || [];
  let budgets = storage.getBudgets() || {};
  let savingsGoals = storage.getSavingsGoals() || [];

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const spentPerCategory = {};
  transactions.forEach(t => {
    if (t.type === 'expense' && t.date && t.date.startsWith(currentMonthKey)) {
      const catId = t.category || t.categoryId;
      spentPerCategory[catId] = (spentPerCategory[catId] || 0) + Number(t.amount || 0);
    }
  });

  function updateView() {
    container.innerHTML = `
      <div class="view-transition-wrap">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; color: var(--ink);">
              🎯 Metas de Ahorro & Presupuestos
            </h2>
            <p style="font-size: 0.74rem; color: var(--ink-60);">Controla tus límites por categoría y alcanza tus sueños</p>
          </div>
          <button id="btn-add-goal" class="btn btn-primary" style="padding: 8px 14px; font-size: 0.8rem;">
            + Nueva Meta
          </button>
        </div>

        <!-- Section 1: Savings Goals (Huchas de Ahorro) -->
        <div class="glass-card">
          <div class="card-header">
            <span class="card-title">🏆 Tus Metas de Ahorro</span>
            <span style="font-size: 0.72rem; color: #4F46E5; font-weight: 700;">${savingsGoals.length} activas</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${savingsGoals.length === 0 ? `
              <div style="text-align: center; padding: 20px; color: var(--ink-60); font-size: 0.84rem; background: #F8FAFC; border-radius: 16px;">
                No tienes metas de ahorro aún. ¡Crea una para motivarte!
              </div>
            ` : savingsGoals.map(goal => {
              const current = Number(goal.currentAmount || goal.current || 0);
              const target = Number(goal.targetAmount || goal.target || 1);
              const pct = Math.min(100, Math.round((current / target) * 100));
              const isCompleted = current >= target;

              return `
                <div style="background: #FFFFFF; border: 1.5px solid ${isCompleted ? '#10B981' : 'rgba(15, 23, 42, 0.08)'}; border-radius: var(--radius-md); padding: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <div>
                      <div style="font-family: var(--font-display); font-weight: 800; font-size: 0.94rem; color: var(--ink);">
                        ${isCompleted ? '🎉 ' : '🎯 '}${goal.title || goal.name}
                      </div>
                      <div style="font-size: 0.74rem; color: var(--ink-60); margin-top: 2px;">
                        ${symbol}${current.toFixed(2)} de <strong>${symbol}${target.toFixed(2)}</strong> ${goal.deadline ? `• Límite: ${goal.deadline}` : ''}
                      </div>
                    </div>
                    <span style="font-family: var(--font-mono); font-weight: 800; font-size: 0.85rem; color: ${isCompleted ? '#059669' : '#4F46E5'};">
                      ${pct}%
                    </span>
                  </div>

                  <div class="budget-progress-track" style="margin-bottom: 10px;">
                    <div class="budget-progress-bar" style="width: ${pct}%; background: ${isCompleted ? '#10B981' : 'linear-gradient(90deg, #4F46E5, #7C3AED)'};"></div>
                  </div>

                  <div style="display: flex; gap: 8px; justify-content: flex-end;">
                    <button type="button" class="btn btn-secondary btn-add-savings" data-id="${goal.id}" style="padding: 6px 12px; font-size: 0.76rem;">
                      💰 Abonar Dinero
                    </button>
                    <button type="button" class="btn btn-danger btn-delete-goal" data-id="${goal.id}" style="padding: 6px 10px; font-size: 0.76rem;">
                      ✕
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Section 2: Category Budgets -->
        <div class="glass-card">
          <div class="card-header">
            <span class="card-title">📊 Presupuesto por Categoría (Este Mes)</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${categories.map(cat => {
              const limit = budgets[cat.id] || 0;
              const spent = spentPerCategory[cat.id] || 0;
              const pct = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
              const isOver = limit > 0 && spent > limit;

              return `
                <div style="background: #FFFFFF; border: 1px solid rgba(15, 23, 42, 0.06); border-radius: var(--radius-md); padding: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div style="width: 28px; height: 28px; border-radius: 8px; background: #EEF2FF; color: #4F46E5; display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="${cat.icon || 'receipt'}" style="width: 15px; height: 15px;"></i>
                      </div>
                      <span style="font-weight: 700; font-size: 0.86rem; color: var(--ink);">${cat.name}</span>
                    </div>

                    <div style="text-align: right;">
                      <span style="font-family: var(--font-mono); font-weight: 800; font-size: 0.84rem; color: ${isOver ? '#DC2626' : 'var(--ink)'};">
                        ${symbol}${spent.toFixed(0)}
                      </span>
                      <span style="font-size: 0.72rem; color: var(--ink-60);"> / ${limit > 0 ? symbol + limit : 'Sin límite'}</span>
                    </div>
                  </div>

                  ${limit > 0 ? `
                    <div class="budget-progress-track">
                      <div class="budget-progress-bar" style="width: ${pct}%; background: ${isOver ? '#DC2626' : pct > 75 ? '#F59E0B' : '#10B981'};"></div>
                    </div>
                  ` : ''}

                  <div style="display: flex; justify-content: flex-end; margin-top: 8px;">
                    <button type="button" class="btn-set-budget" data-id="${cat.id}" data-current="${limit}" style="background: transparent; border: none; font-size: 0.72rem; color: #4F46E5; font-weight: 700; cursor: pointer;">
                      ${limit > 0 ? '✏️ Ajustar Límite' : '+ Asignar Presupuesto'}
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    // Bind Savings Events
    container.querySelector('#btn-add-goal')?.addEventListener('click', () => {
      const title = prompt('Nombre de la meta (ej. Vacaciones, Auto, Emergencia):');
      if (!title) return;
      const target = Number(prompt(`¿Cuánto dinero necesitas ahorrar en total (${symbol})?`)) || 1000;
      const current = Number(prompt(`¿Con cuánto inicias (${symbol})?`)) || 0;

      storage.saveSavingsGoal({
        id: 'goal_' + Date.now(),
        title,
        targetAmount: target,
        currentAmount: current,
        deadline: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0]
      });
      savingsGoals = storage.getSavingsGoals();
      onShowToast?.('¡Nueva meta creada!', 'success');
      updateView();
    });

    container.querySelectorAll('.btn-add-savings').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const goal = savingsGoals.find(g => g.id === id);
        if (!goal) return;
        const addAmount = Number(prompt(`¿Cuánto deseas abonar a "${goal.title || goal.name}" (${symbol})?`));
        if (addAmount && addAmount > 0) {
          goal.currentAmount = (goal.currentAmount || goal.current || 0) + addAmount;
          storage.saveSavingsGoal(goal);
          if (goal.currentAmount >= goal.targetAmount) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            onShowToast?.('🏆 ¡FELICITACIONES! Meta completada con éxito', 'success');
          } else {
            onShowToast?.(`Abonaste ${symbol}${addAmount.toFixed(2)} a tu meta`, 'success');
          }
          updateView();
        }
      });
    });

    container.querySelectorAll('.btn-delete-goal').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('¿Eliminar esta meta?')) {
          storage.deleteSavingsGoal(id);
          savingsGoals = storage.getSavingsGoals();
          onShowToast?.('Meta eliminada', 'success');
          updateView();
        }
      });
    });

    // Budget Limit Buttons
    container.querySelectorAll('.btn-set-budget').forEach(btn => {
      btn.addEventListener('click', () => {
        const catId = btn.getAttribute('data-id');
        const current = Number(btn.getAttribute('data-current')) || 0;
        const newLimit = prompt(`Presupuesto límite mensual para esta categoría (${symbol}):`, current > 0 ? current : 500);
        if (newLimit !== null) {
          storage.saveBudget(catId, Number(newLimit) || 0);
          budgets = storage.getBudgets();
          onShowToast?.('Presupuesto actualizado', 'success');
          updateView();
        }
      });
    });
  }

  updateView();
}
