/* ==========================================================================
   FINANZIX PRO - FINANCIAL ANALYTICS & INSIGHTS SERVICE
   ========================================================================== */

import { storage } from './storage.js';

export function getFinancialMetrics(transactions = null) {
  const txs = transactions || storage.getTransactions();
  
  let totalIncome = 0;
  let totalExpense = 0;
  let fixedExpense = 0;
  let variableExpense = 0;

  txs.forEach(t => {
    const amount = Number(t.amount) || 0;
    if (t.type === 'income') {
      totalIncome += amount;
    } else {
      totalExpense += amount;
      if (t.isFixed) {
        fixedExpense += amount;
      } else {
        variableExpense += amount;
      }
    }
  });

  const netBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;

  return {
    totalIncome: Number(totalIncome.toFixed(2)),
    totalExpense: Number(totalExpense.toFixed(2)),
    fixedExpense: Number(fixedExpense.toFixed(2)),
    variableExpense: Number(variableExpense.toFixed(2)),
    netBalance: Number(netBalance.toFixed(2)),
    savingsRate,
    transactionCount: txs.length
  };
}

export function getCategoryBreakdown(type = 'expense') {
  const txs = storage.getTransactions().filter(t => t.type === type);
  const categories = storage.getCategories();
  
  const map = {};
  txs.forEach(t => {
    const catId = t.category || 'other';
    const amount = Number(t.amount) || 0;
    map[catId] = (map[catId] || 0) + amount;
  });

  const total = Object.values(map).reduce((sum, v) => sum + v, 0);

  const result = Object.entries(map).map(([catId, amount]) => {
    const cat = categories.find(c => c.id === catId) || { name: 'Otro', icon: '💸', color: '#94A3B8' };
    return {
      categoryId: catId,
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      amount: Number(amount.toFixed(2)),
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0
    };
  }).sort((a, b) => b.amount - a.amount);

  return {
    total: Number(total.toFixed(2)),
    breakdown: result
  };
}

export function getMonthlyHistory(monthCount = 6) {
  const txs = storage.getTransactions();
  const monthsMap = {};
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];

  // Initialize past N months
  const now = new Date();
  for (let i = monthCount - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().substr(2)}`;
    monthsMap[key] = { key, label, income: 0, expense: 0 };
  }

  txs.forEach(t => {
    if (!t.date) return;
    const key = t.date.substring(0, 7); // YYYY-MM
    if (monthsMap[key]) {
      const amount = Number(t.amount) || 0;
      if (t.type === 'income') {
        monthsMap[key].income += amount;
      } else {
        monthsMap[key].expense += amount;
      }
    }
  });

  return Object.values(monthsMap);
}

export function getWeeklyCashflow() {
  const txs = storage.getTransactions() || [];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const weeks = [
    { id: 1, label: 'Sem 1', range: '1 - 7', income: 0, expense: 0, net: 0, count: 0 },
    { id: 2, label: 'Sem 2', range: '8 - 14', income: 0, expense: 0, net: 0, count: 0 },
    { id: 3, label: 'Sem 3', range: '15 - 21', income: 0, expense: 0, net: 0, count: 0 },
    { id: 4, label: 'Sem 4', range: '22 - fin', income: 0, expense: 0, net: 0, count: 0 },
  ];

  txs.forEach(t => {
    const d = new Date(t.date || t.timestamp || Date.now());
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      const day = d.getDate();
      let idx = 0;
      if (day <= 7) idx = 0;
      else if (day <= 14) idx = 1;
      else if (day <= 21) idx = 2;
      else idx = 3;

      const amt = Number(t.amount) || 0;
      if (t.type === 'income') {
        weeks[idx].income += amt;
      } else {
        weeks[idx].expense += amt;
      }
      weeks[idx].count += 1;
    }
  });

  weeks.forEach(w => {
    w.net = w.income - w.expense;
  });

  return weeks;
}

export function getDailySpendingPace() {
  const transactions = storage.getTransactions() || [];
  const settings = storage.getSettings() || {};
  const subscriptions = storage.getSubscriptions() || [];
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysRemaining = Math.max(1, daysInMonth - currentDay + 1);
  const monthProgressPct = Math.round((currentDay / daysInMonth) * 100);

  // 1. Filtrar gastos del mes actual
  let currentMonthExpenses = 0;
  transactions.forEach(tx => {
    const d = new Date(tx.date || tx.timestamp || Date.now());
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear && tx.type === 'expense') {
      currentMonthExpenses += (Number(tx.amount) || 0);
    }
  });

  // 2. Calcular compromisos fijos pendientes en lo que queda del mes
  let pendingFixedBills = 0;
  subscriptions.forEach(sub => {
    const renewalDay = sub.renewalDay || 1;
    if (renewalDay >= currentDay) {
      pendingFixedBills += (Number(sub.amount) || 0);
    }
  });

  // 3. Presupuesto disponible base
  const monthlyBudget = Number(settings.monthlyBudget) || (currentMonthExpenses > 0 ? currentMonthExpenses * 1.25 : 1500);
  const discretionaryPool = Math.max(0, monthlyBudget - currentMonthExpenses - pendingFixedBills);
  const dailySafeToSpend = Number((discretionaryPool / daysRemaining).toFixed(2));

  // 4. Ritmo de gasto (Pace)
  const idealExpectedSpend = (monthlyBudget * (currentDay / daysInMonth));
  const paceDelta = Number((idealExpectedSpend - currentMonthExpenses).toFixed(2));
  const budgetSpentPct = Math.min(100, Math.round((currentMonthExpenses / (monthlyBudget || 1)) * 100));

  let paceStatus = 'on_track'; // 'ahead' | 'on_track' | 'behind'
  if (paceDelta > (monthlyBudget * 0.04)) {
    paceStatus = 'ahead';
  } else if (paceDelta < -(monthlyBudget * 0.04)) {
    paceStatus = 'behind';
  }

  return {
    dailySafeToSpend,
    discretionaryPool: Number(discretionaryPool.toFixed(2)),
    daysRemaining,
    currentDay,
    daysInMonth,
    monthProgressPct,
    budgetSpentPct,
    currentMonthExpenses: Number(currentMonthExpenses.toFixed(2)),
    monthlyBudget: Number(monthlyBudget.toFixed(2)),
    pendingFixedBills: Number(pendingFixedBills.toFixed(2)),
    paceDelta,
    paceStatus
  };
}
