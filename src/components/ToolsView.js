/* ==========================================================================
   AURORA FINANZIX - QUICK FINANCIAL TOOLS (LUXURY FINTECH EDITION)
   Split Bill, Loan Amortization & Live Currency Converter
   ========================================================================== */

import { storage } from '../services/storage.js';
import { calculateSplitBill, calculateLoanAmortization } from '../services/costCalculator.js';
import { t, formatCurrency } from '../services/i18n.js';
import { createIcons, icons } from 'lucide';

export function renderTools(container) {
  const settings = storage.getSettings() || {};
  const symbol = settings.currencySymbol || 'S/';

  let activeSubTab = 'split';

  function updateView() {
    container.innerHTML = `
      <div class="view-transition-wrap">
        <div>
          <h2 style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; color: var(--ink);">
            ${t('tools_title')}
          </h2>
          <p style="font-size: 0.74rem; color: var(--ink-60);">${t('tools_sub')}</p>
        </div>

        <!-- Segmented Sub Tabs -->
        <div class="segmented-control">
          <button class="segment-btn ${activeSubTab === 'split' ? 'active' : ''}" data-sub="split">
            <i data-lucide="users" style="width: 14px; height: 14px; margin-right: 4px;"></i>
            ${t('tools_tab_split')}
          </button>
          <button class="segment-btn ${activeSubTab === 'loan' ? 'active' : ''}" data-sub="loan">
            <i data-lucide="calculator" style="width: 14px; height: 14px; margin-right: 4px;"></i>
            ${t('tools_tab_loan')}
          </button>
          <button class="segment-btn ${activeSubTab === 'fx' ? 'active' : ''}" data-sub="fx">
            <i data-lucide="arrow-left-right" style="width: 14px; height: 14px; margin-right: 4px;"></i>
            ${t('tools_tab_fx')}
          </button>
        </div>

        <div id="sub-tool-content"></div>
      </div>
    `;

    const subContainer = container.querySelector('#sub-tool-content');
    if (activeSubTab === 'split') {
      renderSplitBillTool(subContainer, symbol);
    } else if (activeSubTab === 'loan') {
      renderLoanTool(subContainer, symbol);
    } else if (activeSubTab === 'fx') {
      renderFxTool(subContainer, symbol);
    }

    container.querySelectorAll('.segment-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeSubTab = btn.getAttribute('data-sub');
        updateView();
      });
    });

    createIcons({ icons });
  }

  updateView();
}

function renderSplitBillTool(container, symbol) {
  let state = { totalAmount: 160, numPeople: 4, tipPercentage: 10 };

  function render() {
    const res = calculateSplitBill(state);
    container.innerHTML = `
      <div class="glass-card" style="background: #FFFFFF; border: 1px solid rgba(15, 23, 42, 0.08); margin-top: 10px; box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03);">
        <div class="card-header">
          <span class="card-title">${t('tools_split_title')}</span>
        </div>

        <!-- Result Box -->
        <div style="background: #F8FAFC; border: 1.5px solid rgba(15, 23, 42, 0.08); border-radius: var(--radius-md); padding: 18px; text-align: center; margin-bottom: 14px;">
          <div style="font-size: 0.72rem; color: var(--ink-60); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">${t('tools_split_each_pays')}</div>
          <div style="font-family: var(--font-display); font-size: 2.3rem; font-weight: 800; color: #0F172A; margin: 4px 0;">
            ${formatCurrency(res.perPerson)}
          </div>
          <div style="font-size: 0.78rem; color: var(--ink-75);">
            ${t('tools_split_total_with_tip')} <strong>${formatCurrency(res.grandTotal)}</strong> (${t('tools_split_tip_label')} ${formatCurrency(res.tipAmount)})
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
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
                <option value="10" ${state.tipPercentage === 10 ? 'selected' : ''}>10% (Sugerido)</option>
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

function renderLoanTool(container, symbol) {
  let state = { principal: 5000, annualRate: 14.5, months: 12 };

  function render() {
    const res = calculateLoanAmortization(state);
    container.innerHTML = `
      <div class="glass-card" style="background: #FFFFFF; border: 1px solid rgba(15, 23, 42, 0.08); margin-top: 10px; box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03);">
        <div class="card-header">
          <span class="card-title">${t('tools_loan_title')}</span>
        </div>

        <!-- Result Box -->
        <div style="background: #F8FAFC; border: 1.5px solid rgba(15, 23, 42, 0.08); border-radius: var(--radius-md); padding: 18px; text-align: center; margin-bottom: 14px;">
          <div style="font-size: 0.72rem; color: var(--ink-60); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">${t('tools_loan_monthly_payment')}</div>
          <div style="font-family: var(--font-display); font-size: 2.3rem; font-weight: 800; color: #0F172A; margin: 4px 0;">
            ${formatCurrency(res.monthlyPayment)}
          </div>
          <div style="font-size: 0.78rem; color: var(--ink-75); display: flex; justify-content: center; gap: 16px; margin-top: 6px;">
            <span>${t('tools_loan_total_interest')} <strong>${formatCurrency(res.totalInterest)}</strong></span>
            <span>${t('tools_loan_total_to_pay')} <strong>${formatCurrency(res.totalPayment)}</strong></span>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div class="form-group">
            <label class="form-label">${t('tools_loan_amount')} (${symbol})</label>
            <input type="number" id="loan-principal" class="input-control" value="${state.principal}" step="100" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="form-group">
              <label class="form-label">${t('tools_loan_interest_rate')}</label>
              <input type="number" id="loan-rate" class="input-control" value="${state.annualRate}" step="0.1" />
            </div>
            <div class="form-group">
              <label class="form-label">${t('tools_loan_months')}</label>
              <input type="number" id="loan-months" class="input-control" value="${state.months}" min="1" max="120" />
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
      state.annualRate = Number(e.target.value) || 0;
      render();
    });
    container.querySelector('#loan-months')?.addEventListener('input', (e) => {
      state.months = Number(e.target.value) || 1;
      render();
    });
  }

  render();
}

function renderFxTool(container, symbol) {
  let state = { amount: 100, from: 'USD', to: 'PEN', rate: 3.75 };

  function render() {
    const result = state.from === 'USD' ? state.amount * state.rate : state.amount / state.rate;
    container.innerHTML = `
      <div class="glass-card" style="background: #FFFFFF; border: 1px solid rgba(15, 23, 42, 0.08); margin-top: 10px; box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03);">
        <div class="card-header">
          <span class="card-title">${t('tools_fx_title')}</span>
        </div>

        <!-- Result Box -->
        <div style="background: #F8FAFC; border: 1.5px solid rgba(15, 23, 42, 0.08); border-radius: var(--radius-md); padding: 18px; text-align: center; margin-bottom: 14px;">
          <div style="font-size: 0.72rem; color: var(--ink-60); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">${t('tools_fx_result')}</div>
          <div style="font-family: var(--font-display); font-size: 2.3rem; font-weight: 800; color: #0F172A; margin: 4px 0;">
            ${state.to === 'PEN' ? 'S/' : '$'}${result.toFixed(2)}
          </div>
          <div style="font-size: 0.76rem; color: var(--ink-60);">
            1 USD = 3.75 PEN
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div class="form-group">
            <label class="form-label">${t('tools_fx_amount')}</label>
            <input type="number" id="fx-amount" class="input-control" value="${state.amount}" step="5" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="form-group">
              <label class="form-label">${t('tools_fx_from')}</label>
              <select id="fx-from" class="input-control">
                <option value="USD" ${state.from === 'USD' ? 'selected' : ''}>USD ($ Dólar)</option>
                <option value="PEN" ${state.from === 'PEN' ? 'selected' : ''}>PEN (S/ Sol)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">${t('tools_fx_to')}</label>
              <select id="fx-to" class="input-control">
                <option value="PEN" ${state.to === 'PEN' ? 'selected' : ''}>PEN (S/ Sol)</option>
                <option value="USD" ${state.to === 'USD' ? 'selected' : ''}>USD ($ Dólar)</option>
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
      state.to = state.from === 'USD' ? 'PEN' : 'USD';
      render();
    });
    container.querySelector('#fx-to')?.addEventListener('change', (e) => {
      state.to = e.target.value;
      state.from = state.to === 'USD' ? 'PEN' : 'USD';
      render();
    });
  }

  render();
}
