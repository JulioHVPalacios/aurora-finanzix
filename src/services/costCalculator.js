/* ==========================================================================
   FINANZIX PRO - COST & PRODUCT PRICING ENGINE
   Formulas for Unit Cost, Profit Margins, Sale Price, Break-even point
   ========================================================================== */

export function calculateCostProject(project) {
  const batchSize = Math.max(1, Number(project.batchSize) || 1);
  const targetMargin = Number(project.targetMargin) || 30; // e.g. 30%
  const taxRate = Number(project.taxRate) || 0; // e.g. 18% IGV

  // 1. Total Raw Materials (Materia Prima Directa)
  const totalMaterials = (project.materials || []).reduce((sum, item) => {
    const qty = Number(item.qty) || 0;
    const unitCost = Number(item.unitCost) || 0;
    return sum + (qty * unitCost);
  }, 0);

  // 2. Direct Labor (Mano de Obra Directa)
  const laborHours = Number(project.labor?.hours) || 0;
  const ratePerHour = Number(project.labor?.ratePerHour) || 0;
  const totalLabor = laborHours * ratePerHour;

  // 3. Indirect Overheads (Costos Indirectos de Fabricación - Luz, gas, depreciación, empaques)
  const totalOverheads = (project.overheads || []).reduce((sum, item) => {
    return sum + (Number(item.amount) || 0);
  }, 0);

  // Total Batch Cost
  const totalBatchCost = totalMaterials + totalLabor + totalOverheads;

  // Cost per Unit
  const unitCost = totalBatchCost / batchSize;

  // Suggested Sale Price based on Desired Margin
  // Formula: SalePrice = UnitCost / (1 - (targetMargin / 100))
  let unitSalePrice = 0;
  if (targetMargin >= 100) {
    unitSalePrice = unitCost * 2;
  } else {
    unitSalePrice = unitCost / (1 - (targetMargin / 100));
  }

  // Final Price with Tax (e.g. IGV / VAT)
  const unitSalePriceWithTax = unitSalePrice * (1 + (taxRate / 100));

  // Profit per Unit
  const unitProfit = unitSalePrice - unitCost;
  const totalBatchProfit = unitProfit * batchSize;

  // Markup percentage (Sobre el costo)
  const markupPercentage = unitCost > 0 ? (unitProfit / unitCost) * 100 : 0;

  // Break-even Units for Fixed Overheads (Punto de Equilibrio simple)
  // How many units needed to cover fixed overheads at current margin
  const breakEvenUnits = unitProfit > 0 ? Math.ceil(totalOverheads / unitProfit) : 0;

  return {
    batchSize,
    totalMaterials: Number(totalMaterials.toFixed(2)),
    totalLabor: Number(totalLabor.toFixed(2)),
    totalOverheads: Number(totalOverheads.toFixed(2)),
    totalBatchCost: Number(totalBatchCost.toFixed(2)),
    unitCost: Number(unitCost.toFixed(2)),
    targetMargin,
    unitSalePrice: Number(unitSalePrice.toFixed(2)),
    unitSalePriceWithTax: Number(unitSalePriceWithTax.toFixed(2)),
    unitProfit: Number(unitProfit.toFixed(2)),
    totalBatchProfit: Number(totalBatchProfit.toFixed(2)),
    markupPercentage: Number(markupPercentage.toFixed(1)),
    breakEvenUnits
  };
}

export function calculateLoanAmortization({ principal, annualRate, months }) {
  const p = Number(principal) || 0;
  const r = (Number(annualRate) || 0) / 100 / 12; // Monthly rate
  const n = Number(months) || 1;

  if (p <= 0 || n <= 0) return { monthlyPayment: 0, totalInterest: 0, totalPaid: 0, schedule: [] };

  let monthlyPayment = 0;
  if (r === 0) {
    monthlyPayment = p / n;
  } else {
    // French Amortization Formula: P * (r * (1+r)^n) / ((1+r)^n - 1)
    monthlyPayment = (p * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
  }

  const schedule = [];
  let remaining = p;
  let totalInterest = 0;

  for (let i = 1; i <= n; i++) {
    const interest = remaining * r;
    const principalPaid = monthlyPayment - interest;
    remaining = Math.max(0, remaining - principalPaid);
    totalInterest += interest;

    schedule.push({
      month: i,
      payment: Number(monthlyPayment.toFixed(2)),
      principal: Number(principalPaid.toFixed(2)),
      interest: Number(interest.toFixed(2)),
      remaining: Number(remaining.toFixed(2))
    });
  }

  return {
    monthlyPayment: Number(monthlyPayment.toFixed(2)),
    totalInterest: Number(totalInterest.toFixed(2)),
    totalPaid: Number((p + totalInterest).toFixed(2)),
    schedule
  };
}

export function calculateSplitBill({ totalAmount, numPeople, tipPercentage = 0 }) {
  const total = Number(totalAmount) || 0;
  const people = Math.max(1, Number(numPeople) || 1);
  const tipRate = Number(tipPercentage) || 0;

  const tipAmount = total * (tipRate / 100);
  const grandTotal = total + tipAmount;
  const perPerson = grandTotal / people;

  return {
    total: Number(total.toFixed(2)),
    tipAmount: Number(tipAmount.toFixed(2)),
    grandTotal: Number(grandTotal.toFixed(2)),
    perPerson: Number(perPerson.toFixed(2)),
    people
  };
}
