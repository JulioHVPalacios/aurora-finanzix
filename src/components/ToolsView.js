/* ==========================================================================
   AURORA FINANZIX - QUICK FINANCIAL TOOLS (LIQUID GLASS EDITION)
   Split Bill, Loan Amortization & Live Currency Converter
   ========================================================================== */

import { storage } from '../services/storage.js';
import { calculateSplitBill, calculateLoanAmortization } from '../services/costCalculator.js';

export function renderTools(container) {
  const settings = storage.getSettings() || {};
  const symbol = settings.currencySymbol || 'S/';

  let activeSubTab = 'split';

  function updateView() {
    container.innerHTML = `
      <div class="view-transition-wrap">
        <div>
          <h2 style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; color: var(--ink);">
            🛠️ Utilidades & Calculadoras Rápidas
          </h2>
          <p style="font-size: 0.74rem; color: var(--ink-60);">Herramientas prácticas para tus finanzas del día a día</p>
        </div>

        <!-- Segmented Sub Tabs -->
        <div class="segmented-control">
          <button class="segment-btn ${activeSubTab === 'split' ? 'active' : ''}" data-sub="split">
            🍕 Dividir Cuenta
          </button>
          <button class="segment-btn ${activeSubTab === 'loan' ? 'active' : ''}" data-sub="loan">
            🏦 Cuotas / Préstamo
          </button>
          <button class="segment-btn ${activeSubTab === 'fx' ? 'active' : ''}" data-sub="fx">
            💱 Conversor Monedas
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
  }

  updateView();
}

function renderSplitBillTool(container, symbol) {
  let state = { totalAmount: 160, numPeople: 4, tipPercentage: 10 };

  function render() {
    const res = calculateSplitBill(state);
    container.innerHTML = `
      <div class="glass-card" style="margin-top: 10px;">
        <div class="card-header">
          <span class="card-title">🍕 Dividir Cuenta entre Amigos</span>
        </div>

        <!-- Result Box -->
        <div style="background: linear-gradient(135deg, rgba(238, 242, 255, 0.95), rgba(245, 243, 255, 0.9)); border: 1.5px solid rgba(79, 70, 229, 0.2); border-radius: var(--radius-md); padding: 18px; text-align: center; margin-bottom: 14px;">
          <div style="font-size: 0.74rem; color: var(--ink-60); text-transform: uppercase; font-weight: 700;">Cada persona paga</div>
          <div style="font-family: var(--font-display); font-size: 2.3rem; font-weight: 800; color: #4F46E5; margin: 4px 0;">
            ${symbol}${res.perPerson.toFixed(2)}
          </div>
          <div style="font-size: 0.78rem; color: var(--ink-75);">
            Total con propina: <strong>${symbol}${res.grandTotal.toFixed(2)}</strong> (Propina: ${symbol}${res.tipAmount.toFixed(2)})
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Total de la Cuenta (${symbol})</label>
          <input type="number" min="1" step="0.5" id="inp-split-total" class="input-control" value="${state.totalAmount}" style="font-size: 1.1rem; font-weight: 700;" />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="form-group">
            <label class="form-label">N° de Personas</label>
            <input type="number" min="1" max="50" id="inp-split-people" class="input-control" value="${state.numPeople}" style="font-weight: 700;" />
          </div>

          <div class="form-group">
            <label class="form-label">Propina (%)</label>
            <select id="inp-split-tip" class="input-control" style="font-weight: 700;">
              <option value="0" ${state.tipPercentage === 0 ? 'selected' : ''}>0% (Sin propina)</option>
              <option value="5" ${state.tipPercentage === 5 ? 'selected' : ''}>5%</option>
              <option value="10" ${state.tipPercentage === 10 ? 'selected' : ''}>10% (Recomendado)</option>
              <option value="15" ${state.tipPercentage === 15 ? 'selected' : ''}>15% (Excelente servicio)</option>
            </select>
          </div>
        </div>
      </div>
    `;

    container.querySelector('#inp-split-total')?.addEventListener('input', (e) => {
      state.totalAmount = Number(e.target.value) || 0;
      render();
    });

    container.querySelector('#inp-split-people')?.addEventListener('input', (e) => {
      state.numPeople = Number(e.target.value) || 1;
      render();
    });

    container.querySelector('#inp-split-tip')?.addEventListener('change', (e) => {
      state.tipPercentage = Number(e.target.value) || 0;
      render();
    });
  }

  render();
}

function renderLoanTool(container, symbol) {
  let state = { principal: 5000, annualRate: 18, months: 12 };

  function render() {
    const res = calculateLoanAmortization(state);
    container.innerHTML = `
      <div class="glass-card" style="margin-top: 10px;">
        <div class="card-header">
          <span class="card-title">🏦 Simulador de Préstamos y Cuotas</span>
        </div>

        <div style="background: linear-gradient(135deg, rgba(254, 243, 199, 0.9), rgba(255, 251, 235, 0.95)); border: 1.5px solid rgba(245, 158, 11, 0.3); border-radius: var(--radius-md); padding: 18px; text-align: center; margin-bottom: 14px;">
          <div style="font-size: 0.74rem; color: #92400E; text-transform: uppercase; font-weight: 700;">Cuota Mensual Estimada</div>
          <div style="font-family: var(--font-display); font-size: 2.3rem; font-weight: 800; color: #B45309; margin: 4px 0;">
            ${symbol}${res.monthlyPayment.toFixed(2)}
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px; font-size: 0.78rem; border-top: 1px solid rgba(245, 158, 11, 0.2); padding-top: 8px;">
            <div>Intereses: <strong style="color: #DC2626;">${symbol}${res.totalInterest.toFixed(2)}</strong></div>
            <div>Total a Devolver: <strong style="color: var(--ink);">${symbol}${res.totalPaid.toFixed(2)}</strong></div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Monto del Préstamo (${symbol})</label>
          <input type="number" min="100" step="100" id="inp-loan-principal" class="input-control" value="${state.principal}" style="font-weight: 700; font-size: 1.05rem;" />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="form-group">
            <label class="form-label">Tasa Anual - TEA (%)</label>
            <input type="number" min="0.1" step="0.5" id="inp-loan-rate" class="input-control" value="${state.annualRate}" style="font-weight: 700;" />
          </div>
          <div class="form-group">
            <label class="form-label">Plazo (Meses)</label>
            <input type="number" min="1" max="120" id="inp-loan-months" class="input-control" value="${state.months}" style="font-weight: 700;" />
          </div>
        </div>
      </div>
    `;

    container.querySelector('#inp-loan-principal')?.addEventListener('input', (e) => {
      state.principal = Number(e.target.value) || 0;
      render();
    });
    container.querySelector('#inp-loan-rate')?.addEventListener('input', (e) => {
      state.annualRate = Number(e.target.value) || 0;
      render();
    });
    container.querySelector('#inp-loan-months')?.addEventListener('input', (e) => {
      state.months = Number(e.target.value) || 1;
      render();
    });
  }

  render();
}

function renderFxTool(container, currentSymbol) {
  let amount = 100;
  let fromCurrency = 'USD';
  let toCurrency = 'PEN';
  let fxRate = 3.75;

  function render() {
    const converted = amount * fxRate;
    container.innerHTML = `
      <div class="glass-card" style="margin-top: 10px;">
        <div class="card-header">
          <span class="card-title">💱 Conversor Rápido de Moneda</span>
        </div>

        <div style="background: linear-gradient(135deg, rgba(209, 250, 229, 0.95), rgba(236, 253, 245, 0.9)); border: 1.5px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-md); padding: 18px; text-align: center; margin-bottom: 14px;">
          <div style="font-size: 0.74rem; color: #065F46; text-transform: uppercase; font-weight: 700;">Resultado Convertido</div>
          <div style="font-family: var(--font-display); font-size: 2.3rem; font-weight: 800; color: #047857; margin: 4px 0;">
            ${toCurrency === 'PEN' ? 'S/' : toCurrency === 'USD' ? '$' : '€'}${converted.toFixed(2)}
          </div>
          <div style="font-size: 0.74rem; color: #065F46;">
            1 ${fromCurrency} = ${fxRate} ${toCurrency}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Monto a Convertir</label>
          <input type="number" min="1" step="any" id="inp-fx-amount" class="input-control" value="${amount}" style="font-weight: 700; font-size: 1.05rem;" />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="form-group">
            <label class="form-label">De Moneda</label>
            <select id="sel-fx-from" class="input-control" style="font-weight: 700;">
              <option value="USD" ${fromCurrency === 'USD' ? 'selected' : ''}>USD ($ Dólar)</option>
              <option value="PEN" ${fromCurrency === 'PEN' ? 'selected' : ''}>PEN (S/ Sol)</option>
              <option value="EUR" ${fromCurrency === 'EUR' ? 'selected' : ''}>EUR (€ Euro)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">A Moneda</label>
            <select id="sel-fx-to" class="input-control" style="font-weight: 700;">
              <option value="PEN" ${toCurrency === 'PEN' ? 'selected' : ''}>PEN (S/ Sol)</option>
              <option value="USD" ${toCurrency === 'USD' ? 'selected' : ''}>USD ($ Dólar)</option>
              <option value="EUR" ${toCurrency === 'EUR' ? 'selected' : ''}>EUR (€ Euro)</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Tipo de Cambio (Editable)</label>
          <input type="number" min="0.01" step="0.001" id="inp-fx-rate" class="input-control" value="${fxRate}" style="font-weight: 700;" />
        </div>
      </div>
    `;

    container.querySelector('#inp-fx-amount')?.addEventListener('input', (e) => {
      amount = Number(e.target.value) || 0;
      render();
    });

    container.querySelector('#inp-fx-rate')?.addEventListener('input', (e) => {
      fxRate = Number(e.target.value) || 1;
      render();
    });

    container.querySelector('#sel-fx-from')?.addEventListener('change', (e) => {
      fromCurrency = e.target.value;
      if (fromCurrency === 'USD' && toCurrency === 'PEN') fxRate = 3.75;
      else if (fromCurrency === 'PEN' && toCurrency === 'USD') fxRate = 0.27;
      else fxRate = 1.0;
      render();
    });

    container.querySelector('#sel-fx-to')?.addEventListener('change', (e) => {
      toCurrency = e.target.value;
      if (fromCurrency === 'USD' && toCurrency === 'PEN') fxRate = 3.75;
      else if (fromCurrency === 'PEN' && toCurrency === 'USD') fxRate = 0.27;
      else fxRate = 1.0;
      render();
    });
  }

  render();
}
