/* ==========================================================================
   AURORA LIQUID GLASS - BUDGETS & SAVINGS GOALS VIEW
   ========================================================================== */

import { storage } from '../services/storage.js';
import confetti from 'canvas-confetti';

export function renderBudgets(container, { onShowToast }) {
  const settings = storage.getSettings();
  const symbol = settings.currencySymbol || 'S/';
  const categories = storage.getCategories().filter(c => c.type === 'expense');
  const transactions = storage.getTransactions();
  let budgets = storage.getBudgets();
  let savingsGoals = storage.getSavingsGoals();

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const spentPerCategory = {};
  transactions.forEach(t => {
    if (t.type === 'expense' && t.date && t.date.startsWith(currentMonthKey)) {
      spentPerCategory[t.category] = (spentPerCategory[t.category] || 0) + Number(t.amount);
    }
  });

  function updateView() {
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2 style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 700;">
          🎯 Metas de Ahorro & Presupuestos
        </h2>
      </div>

      <!-- Savings Goals Section -->
      <div class="glass-card">
        <div class="card-header">
          <span class="card-title">🏆 Hucha de Metas de Ahorro</span>
          <button id="btn-add-goal" class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem;">
            + Nueva Meta
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${savingsGoals.length === 0 ? `
            <div style="text-align: center; padding: 16px; color: var(--ink-40); font-size: 0.8rem;">
              No tienes metas de ahorro aún. ¡Crea una para motivarte!
            </div>
          ` : savingsGoals.map(goal => {
            const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            const isCompleted = goal.currentAmount >= goal.targetAmount;

            return `
              <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid ${isCompleted ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255, 255, 255, 0.1)'}; border-radius: var(--radius-element); padding: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.4rem;">${goal.icon || '🎯'}</span>
                    <div>
                      <div style="font-family: var(--font-display); font-weight: 700; font-size: 0.9rem; color: #FFFFFF;">${goal.title}</div>
                      <div style="font-size: 0.7rem; color: var(--ink-40);">
                        ${symbol}${goal.currentAmount.toFixed(2)} de ${symbol}${goal.targetAmount.toFixed(2)} • ${goal.deadline ? `Límite: ${goal.deadline}` : 'Sin plazo'}
                      </div>
                    </div>
                  </div>
                  <span style="font-family: var(--font-mono); font-weight: 800; font-size: 0.95rem; color: ${isCompleted ? '#6EE7B7' : '#BAE6FD'};">
                    ${pct}%
                  </span>
                </div>

                <div style="width: 100%; height: 6px; background: rgba(255, 255, 255, 0.08); border-radius: 99px; overflow: hidden; margin: 8px 0;">
                  <div style="width: ${pct}%; height: 100%; background: ${isCompleted ? 'var(--emerald-gradient)' : 'var(--cyan-gradient)'}; border-radius: 99px; transition: width 0.5s var(--e-out);"></div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
                  <button type="button" class="btn-deposit-goal btn btn-secondary" data-id="${goal.id}" style="padding: 4px 10px; font-size: 0.72rem;">
                    💰 + Aportar Fondos
                  </button>
                  <button type="button" class="btn-del-goal" data-id="${goal.id}" style="background: none; border: none; color: #FDA4AF; cursor: pointer; font-size: 0.75rem;">
                    Eliminar
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Category Budgets Section -->
      <div class="glass-card">
        <div class="card-header">
          <span class="card-title">📊 Presupuestos Mensuales por Rubro</span>
        </div>
        <p style="font-size: 0.75rem; color: var(--ink-60); margin-bottom: 12px;">
          Define un tope mensual para cada categoría y mantén tus gastos bajo control.
        </p>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${categories.map(cat => {
            const budgetLimit = Number(budgets[cat.id]) || 0;
            const spent = Number(spentPerCategory[cat.id]) || 0;
            const pct = budgetLimit > 0 ? Math.min(100, Math.round((spent / budgetLimit) * 100)) : 0;
            const isOver = budgetLimit > 0 && spent > budgetLimit;

            return `
              <div style="background: rgba(255, 255, 255, 0.05); padding: 10px 12px; border-radius: var(--radius-element); border: 1px solid rgba(255, 255, 255, 0.08);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <div style="display: flex; align-items: center; gap: 6px; font-weight: 600; font-size: 0.85rem;">
                    <span>${cat.icon}</span>
                    <span>${cat.name}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 0.72rem; color: var(--ink-40);">Tope:</span>
                    <input type="number" min="0" step="10" class="input-control input-control-mono inp-cat-budget" data-cat-id="${cat.id}" value="${budgetLimit}" style="width: 80px; padding: 4px 6px; font-size: 0.8rem; text-align: right;" />
                  </div>
                </div>

                <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--ink-60); margin-bottom: 4px;">
                  <span>Gastado: <strong style="color: ${isOver ? '#FDA4AF' : '#FFFFFF'};">${symbol}${spent.toFixed(2)}</strong></span>
                  <span>${pct}% utilizado</span>
                </div>

                <div style="width: 100%; height: 6px; background: rgba(255, 255, 255, 0.08); border-radius: 99px; overflow: hidden;">
                  <div style="width: ${pct}%; height: 100%; background: ${isOver ? 'var(--rose-gradient)' : pct > 75 ? 'var(--amber-gradient)' : 'var(--emerald-gradient)'}; transition: width 0.3s ease;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('.inp-cat-budget').forEach(inp => {
      inp.addEventListener('change', (e) => {
        const catId = inp.getAttribute('data-cat-id');
        const amount = Number(e.target.value) || 0;
        storage.saveBudget(catId, amount);
        budgets = storage.getBudgets();
        onShowToast?.('Presupuesto actualizado', 'success');
        updateView();
      });
    });

    container.querySelectorAll('.btn-deposit-goal').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const goal = savingsGoals.find(g => g.id === id);
        if (!goal) return;

        const addStr = prompt(`¿Cuánto dinero deseas aportar a "${goal.title}"? (${symbol})`, '50');
        const addAmount = Number(addStr);
        if (addAmount && addAmount > 0) {
          goal.currentAmount += addAmount;
          storage.saveSavingsGoal(goal);
          savingsGoals = storage.getSavingsGoals();

          if (goal.currentAmount >= goal.targetAmount) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
            onShowToast?.(`🎉 ¡FELICITACIONES! Has completado tu meta "${goal.title}"`, 'success');
          } else {
            onShowToast?.(`Aporte de ${symbol}${addAmount} registrado`, 'success');
          }
          updateView();
        }
      });
    });

    container.querySelectorAll('.btn-del-goal').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('¿Eliminar esta meta de ahorro?')) {
          storage.deleteSavingsGoal(id);
          savingsGoals = storage.getSavingsGoals();
          updateView();
          onShowToast?.('Meta eliminada', 'success');
        }
      });
    });

    container.querySelector('#btn-add-goal')?.addEventListener('click', () => {
      const title = prompt('Nombre de tu meta (Ej. Fondo de Emergencia):');
      if (!title) return;
      const targetStr = prompt(`Monto objetivo (${symbol}):`, '1000');
      const targetAmount = Number(targetStr) || 500;
      const deadline = prompt('Fecha límite (YYYY-MM-DD) opcional:', '2026-12-31');

      storage.saveSavingsGoal({
        title,
        targetAmount,
        currentAmount: 0,
        deadline: deadline || '',
        icon: '🎯'
      });
      savingsGoals = storage.getSavingsGoals();
      updateView();
      onShowToast?.('Nueva meta creada', 'success');
    });
  }

  updateView();
}
