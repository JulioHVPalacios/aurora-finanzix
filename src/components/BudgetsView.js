/* ==========================================================================
   VALO OS - BUDGETS & SAVINGS GOALS (LUXURY FINTECH EDITION)
   Clear Progress Meters & Motivating Visual Goals
   ========================================================================== */

import { storage } from '../services/storage.js';
import { getFinancialMetrics } from '../services/analytics.js';
import { t, formatCurrency, getCategoryName } from '../services/i18n.js';
import { showBudgetLimitModal } from './BudgetLimitModal.js';
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
  let totalExpenseThisMonth = 0;
  transactions.forEach(tx => {
    if (tx.type === 'expense' && tx.date && tx.date.startsWith(currentMonthKey)) {
      const catId = tx.category || tx.categoryId;
      const amt = Number(tx.amount || 0);
      spentPerCategory[catId] = (spentPerCategory[catId] || 0) + amt;
      totalExpenseThisMonth += amt;
    }
  });

  function updateView() {
    const currentSettings = storage.getSettings() || {};
    const monthlyBudget = currentSettings.monthlyBudget || 0;
    const budgetSpentPct = monthlyBudget > 0 ? Math.min(100, Math.round((totalExpenseThisMonth / monthlyBudget) * 100)) : 0;

    container.innerHTML = `
      <div class="view-transition-wrap">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <div>
            <h2 style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; color: var(--ink); margin: 0 0 2px;">
              ${t('goals_title')}
            </h2>
            <p style="font-size: 0.74rem; color: var(--ink-60); margin: 0;">${t('goals_sub')}</p>
          </div>
          <button id="btn-add-goal" class="btn btn-primary" style="padding: 8px 14px; font-size: 0.8rem;">
            ${t('goals_new_btn')}
          </button>
        </div>

        <!-- Section 0: Presupuesto Mensual Global -->
        <div class="glass-card" id="card-global-budget-box" style="background: #FFFFFF; border: 1px solid rgba(15, 23, 42, 0.08); box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03); margin-bottom: 16px; padding: 16px; border-radius: var(--radius-md);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div>
              <span style="font-family: var(--font-display); font-weight: 800; font-size: 0.95rem; color: #0F172A;">Presupuesto Mensual Global</span>
              <div style="font-size: 0.72rem; color: var(--ink-60);">Tope de gastos general del mes</div>
            </div>
            <button type="button" id="btn-edit-global-budget" class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.76rem; font-weight: 800; color: #4F46E5;">
              ${monthlyBudget > 0 ? `${symbol}${monthlyBudget.toLocaleString()}` : 'Fijar Límite'}
            </button>
          </div>

          ${monthlyBudget > 0 ? `
            <div class="budget-progress-track" style="margin-top: 10px; margin-bottom: 8px;">
              <div class="budget-progress-bar" style="width: ${budgetSpentPct}%; background: ${budgetSpentPct > 100 ? '#DC2626' : budgetSpentPct > 80 ? '#D97706' : '#0F172A'};"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.74rem; color: var(--ink-60);">
              <span>Gastado: <strong>${symbol}${totalExpenseThisMonth.toFixed(0)}</strong> (${budgetSpentPct}%)</span>
              <span style="color: ${monthlyBudget - totalExpenseThisMonth >= 0 ? '#059669' : '#DC2626'}; font-weight: 700;">
                ${monthlyBudget - totalExpenseThisMonth >= 0 ? `Disponible: ${symbol}${(monthlyBudget - totalExpenseThisMonth).toFixed(0)}` : `Excedido: ${symbol}${Math.abs(monthlyBudget - totalExpenseThisMonth).toFixed(0)}`}
              </span>
            </div>
          ` : `
            <div style="padding: 8px 0 2px; font-size: 0.78rem; color: #64748B;">
              No has definido un tope mensual. Toca <strong style="color: #4F46E5; cursor: pointer;">Fijar Límite</strong> para activar el control y cálculo de ritmo diario.
            </div>
          `}
        </div>

        <!-- Section 1: Savings Goals (Huchas de Ahorro) -->
        <div class="glass-card" style="background: #FFFFFF; border: 1px solid rgba(15, 23, 42, 0.08); box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03);">
          <div class="card-header">
            <span class="card-title">${t('goals_active_title')}</span>
            <span style="font-size: 0.72rem; color: #0F172A; font-weight: 700;">${savingsGoals.length} ${t('goals_active_count')}</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${savingsGoals.length === 0 ? `
              <div style="text-align: center; padding: 24px; color: var(--ink-60); font-size: 0.84rem; background: #F8FAFC; border-radius: 16px; border: 1px solid rgba(15, 23, 42, 0.06);">
                ${t('goals_empty')}
              </div>
            ` : savingsGoals.map(goal => {
              const current = Number(goal.currentAmount || goal.current || 0);
              const target = Number(goal.targetAmount || goal.target || 1);
              const pct = Math.min(100, Math.round((current / target) * 100));
              const isCompleted = current >= target;

              return `
                <div style="background: #FFFFFF; border: 1.5px solid ${isCompleted ? '#059669' : 'rgba(15, 23, 42, 0.08)'}; border-radius: var(--radius-md); padding: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <div>
                      <div style="font-family: var(--font-display); font-weight: 800; font-size: 0.94rem; color: var(--ink); display: flex; align-items: center; gap: 6px;">
                        <i data-lucide="${isCompleted ? 'check-circle' : 'target'}" style="width: 16px; height: 16px; color: ${isCompleted ? '#059669' : '#0F172A'};"></i>
                        <span>${goal.title || goal.name}</span>
                      </div>
                      <div style="font-size: 0.74rem; color: var(--ink-60); margin-top: 2px;">
                        ${formatCurrency(current)} ${t('goals_of')} <strong>${formatCurrency(target)}</strong> ${goal.deadline ? `• ${t('goals_deadline')} ${goal.deadline}` : ''}
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
                    <button type="button" class="btn btn-secondary btn-add-savings" data-id="${goal.id}" style="padding: 6px 12px; font-size: 0.76rem;">
                      <i data-lucide="plus-circle" style="width: 14px; height: 14px; margin-right: 4px;"></i>
                      ${t('goals_add_funds')}
                    </button>
                    <button type="button" class="btn btn-danger btn-delete-goal" data-id="${goal.id}" style="padding: 6px 10px; font-size: 0.76rem;" title="${t('goals_delete')}">
                      <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
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

          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${categories.map(cat => {
              const spent = spentPerCategory[cat.id] || 0;
              const limit = budgets[cat.id] || 0;
              const pct = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
              const isOver = limit > 0 && spent > limit;

              return `
                <div style="border-bottom: 1px solid rgba(15, 23, 42, 0.06); padding-bottom: 12px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div style="width: 28px; height: 28px; border-radius: 8px; background: #F1F5F9; color: var(--ink); display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="${cat.icon || 'receipt'}" style="width: 15px; height: 15px;"></i>
                      </div>
                      <span style="font-weight: 700; font-size: 0.88rem; color: var(--ink);">${getCategoryName(cat)}</span>
                    </div>
                    
                    <button type="button" class="btn btn-secondary btn-set-cat-budget" data-id="${cat.id}" data-name="${cat.name}" data-current="${limit}" style="padding: 4px 10px; font-size: 0.72rem;">
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
      </div>
    `;

    // Bind Global Budget Modal
    container.querySelector('#btn-edit-global-budget')?.addEventListener('click', () => {
      showBudgetLimitModal({
        onSave: (val) => {
          onShowToast?.(val > 0 ? `Presupuesto mensual fijado en ${formatCurrency(val)}` : 'Límite eliminado', 'success');
          updateView();
        }
      });
    });

    // Bind Goal events
    container.querySelector('#btn-add-goal')?.addEventListener('click', () => {
      const title = prompt(t('goals_new_btn') + ':');
      if (!title) return;
      const targetStr = prompt('Meta de ahorro (' + symbol + '):', '500');
      const target = Number(targetStr);
      if (!target || isNaN(target)) return;

      const newGoal = {
        id: 'goal_' + Date.now(),
        title,
        targetAmount: target,
        currentAmount: 0
      };
      savingsGoals.push(newGoal);
      storage.saveSavingsGoals(savingsGoals);
      updateView();
      onShowToast?.('Meta creada con éxito', 'success');
    });

    container.querySelectorAll('.btn-add-savings').forEach(btn => {
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
          onShowToast?.('¡Felicidades! ¡Meta de ahorro completada!', 'success');
        } else {
          onShowToast?.(`Abono de ${formatCurrency(amount)} registrado`, 'success');
        }
        updateView();
      });
    });

    container.querySelectorAll('.btn-delete-goal').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('¿Eliminar esta meta de ahorro?')) {
          savingsGoals = savingsGoals.filter(g => g.id !== id);
          storage.saveSavingsGoals(savingsGoals);
          updateView();
          onShowToast?.('Meta eliminada', 'success');
        }
      });
    });

    container.querySelectorAll('.btn-set-cat-budget').forEach(btn => {
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
        updateView();
        onShowToast?.(`Presupuesto para ${name} actualizado`, 'success');
      });
    });

    createIcons({ icons });
  }

  updateView();
}
