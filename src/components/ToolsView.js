/* ==========================================================================
   VALO OS - QUICK FINANCIAL TOOLS (LUXURY FINTECH EDITION)
   Split Bill, Loan Amortization & Live Currency Converter
   ========================================================================== */

import { storage } from '../services/storage.js';
import { calculateSplitBill, calculateLoanAmortization } from '../services/costCalculator.js';
import { t, formatCurrency } from '../services/i18n.js';
import { fxService, SUPPORTED_CURRENCIES } from '../services/fxService.js';
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
  let state = { principal: 5000, rate: 18, rateType: 'TEA', term: 12, termUnit: 'months', system: 'french' };

  function render() {
    const res = calculateLoanAmortization(state);
    container.innerHTML = `
      <div class="glass-card" style="background: #FFFFFF; border: 1px solid rgba(15, 23, 42, 0.08); margin-top: 10px; box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03);">
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

function renderFxTool(container, defaultSymbol) {
  let state = { amount: 100, from: 'USD', to: 'PEN' };

  function render() {
    const result = fxService.convert(state.amount, state.from, state.to);
    const unitRate = fxService.getRate(state.from, state.to);
    const toCurr = SUPPORTED_CURRENCIES.find(c => c.code === state.to) || { symbol: state.to };

    container.innerHTML = `
      <div class="glass-card" style="background: #FFFFFF; border: 1px solid rgba(15, 23, 42, 0.08); margin-top: 10px; box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03);">
        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span class="card-title">${t('tools_fx_title')}</span>
          <span style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.68rem; font-weight: 700; color: #059669; background: #ECFDF5; padding: 3px 8px; border-radius: 999px;">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: #10B981; display: inline-block;"></span>
            En vivo (Interbancario)
          </span>
        </div>

        <!-- Result Box -->
        <div style="background: #F8FAFC; border: 1.5px solid rgba(15, 23, 42, 0.08); border-radius: var(--radius-md); padding: 18px; text-align: center; margin-bottom: 14px;">
          <div style="font-size: 0.72rem; color: var(--ink-60); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">${t('tools_fx_result')}</div>
          <div style="font-family: var(--font-display); font-size: 2.3rem; font-weight: 800; color: #0F172A; margin: 4px 0;">
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

            <button type="button" id="btn-swap-fx-tool" style="width: 38px; height: 38px; border-radius: 10px; border: 1.5px solid rgba(15, 23, 42, 0.1); background: #FFFFFF; color: var(--ink); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s; margin-bottom: 2px;" title="Invertir monedas">
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
    container.querySelector('#btn-swap-fx-tool')?.addEventListener('click', () => {
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
