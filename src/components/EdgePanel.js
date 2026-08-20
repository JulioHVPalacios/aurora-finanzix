/* ==========================================================================
   VALO OS - GLOBAL EDGE UTILITY PANEL (LIQUID GLASS DRAWER)
   Accessible from anywhere across the OS: Smart Calculator, Live FX,
   Split Bill, and Bank-Grade Multi-System Loan Simulator.
   ========================================================================== */

import { fxService, SUPPORTED_CURRENCIES } from '../services/fxService.js';
import { calculateLoanAmortization, calculateSplitBill } from '../services/costCalculator.js';
import { storage } from '../services/storage.js';
import { t, formatCurrency } from '../services/i18n.js';
import { createIcons, icons } from 'lucide';

let isEdgePanelOpen = false;
let activeEdgeTab = 'calc'; // 'calc' | 'fx' | 'split' | 'loan'

// Calculator state
let calcDisplay = '0';
let calcExpression = '';
let calcPrevNumber = null;
let calcOperation = null;
let calcNewNumber = true;

export function initEdgePanel({ onAddTransaction = null } = {}) {
  let container = document.getElementById('edge-panel-root');
  if (!container) {
    container = document.createElement('div');
    container.id = 'edge-panel-root';
    document.body.appendChild(container);
  }

  function render() {
    const settings = storage.getSettings() || {};
    const symbol = settings.currencySymbol || 'S/';

    container.innerHTML = `
      <!-- Samsung One UI Liquid Glass Edge Handle -->
      <button id="edge-panel-handle" class="edge-panel-handle samsung-style" title="Panel Edge (Calculadora y Utilidades)" aria-label="Abrir Panel Edge">
        <div class="samsung-edge-bar">
          <div class="samsung-edge-grip"></div>
          <i data-lucide="calculator" class="samsung-edge-icon"></i>
        </div>
      </button>

      <!-- Liquid Glass Backdrop -->
      <div id="edge-panel-backdrop" class="edge-panel-backdrop ${isEdgePanelOpen ? 'active' : ''}"></div>

      <!-- Edge Panel Drawer -->
      <aside id="edge-panel-drawer" class="edge-panel-drawer ${isEdgePanelOpen ? 'open' : ''}">
        <!-- Drawer Header -->
        <div class="edge-drawer-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="edge-drawer-icon-wrap">
              <i data-lucide="sparkles" style="width: 16px; height: 16px;"></i>
            </div>
            <div>
              <div style="font-weight: 800; font-size: 0.95rem; color: #0F172A; font-family: var(--font-display);">Panel Edge</div>
              <div style="font-size: 0.68rem; color: #64748B;">Herramientas Financieras Rápidas</div>
            </div>
          </div>
          <button id="btn-close-edge-panel" class="edge-close-btn" aria-label="Cerrar Panel">
            <i data-lucide="x" style="width: 18px; height: 18px;"></i>
          </button>
        </div>

        <!-- Navigation Sub-Tabs -->
        <div class="edge-nav-tabs">
          <button class="edge-tab-btn ${activeEdgeTab === 'calc' ? 'active' : ''}" data-tab="calc">
            <i data-lucide="calculator" style="width: 14px; height: 14px;"></i>
            <span>Calculadora</span>
          </button>
          <button class="edge-tab-btn ${activeEdgeTab === 'fx' ? 'active' : ''}" data-tab="fx">
            <i data-lucide="arrow-left-right" style="width: 14px; height: 14px;"></i>
            <span>Divisas</span>
          </button>
          <button class="edge-tab-btn ${activeEdgeTab === 'split' ? 'active' : ''}" data-tab="split">
            <i data-lucide="users" style="width: 14px; height: 14px;"></i>
            <span>Dividir</span>
          </button>
          <button class="edge-tab-btn ${activeEdgeTab === 'loan' ? 'active' : ''}" data-tab="loan">
            <i data-lucide="landmark" style="width: 14px; height: 14px;"></i>
            <span>Préstamos</span>
          </button>
        </div>

        <!-- Edge Content Area -->
        <div class="edge-drawer-body">
          ${renderTabContent(symbol, onAddTransaction)}
        </div>
      </aside>
    `;

    attachEvents(symbol, onAddTransaction);
    createIcons({ icons });
  }

  function renderTabContent(symbol, onAddTransaction) {
    if (activeEdgeTab === 'calc') return renderCalculatorMarkup();
    if (activeEdgeTab === 'fx') return renderFxMarkup();
    if (activeEdgeTab === 'split') return renderSplitMarkup();
    if (activeEdgeTab === 'loan') return renderLoanMarkup(symbol);
    return '';
  }

  function renderCalculatorMarkup() {
    return `
      <div class="edge-calc-wrap">
        <!-- Display LCD Screen -->
        <div class="edge-calc-screen">
          <div class="edge-calc-history">${calcExpression || '&nbsp;'}</div>
          <div class="edge-calc-main" id="edge-calc-display">${calcDisplay}</div>
        </div>

        <!-- Action Quick-Bar -->
        <div class="edge-calc-quickbar">
          <button type="button" id="btn-copy-calc" class="edge-quick-btn" title="Copiar resultado">
            <i data-lucide="copy" style="width: 13px; height: 13px;"></i>
            <span>Copiar</span>
          </button>
          ${onAddTransaction ? `
            <button type="button" id="btn-calc-to-expense" class="edge-quick-btn edge-quick-primary" title="Cargar como gasto">
              <i data-lucide="plus-circle" style="width: 13px; height: 13px;"></i>
              <span>Como Gasto</span>
            </button>
          ` : ''}
        </div>

        <!-- Keypad Grid -->
        <div class="edge-calc-keypad">
          <button class="calc-key calc-op" data-key="clear">AC</button>
          <button class="calc-key calc-op" data-key="backspace">⌫</button>
          <button class="calc-key calc-op" data-key="percent">%</button>
          <button class="calc-key calc-accent" data-key="/">÷</button>

          <button class="calc-key" data-key="7">7</button>
          <button class="calc-key" data-key="8">8</button>
          <button class="calc-key" data-key="9">9</button>
          <button class="calc-key calc-accent" data-key="*">×</button>

          <button class="calc-key" data-key="4">4</button>
          <button class="calc-key" data-key="5">5</button>
          <button class="calc-key" data-key="6">6</button>
          <button class="calc-key calc-accent" data-key="-">−</button>

          <button class="calc-key" data-key="1">1</button>
          <button class="calc-key" data-key="2">2</button>
          <button class="calc-key" data-key="3">3</button>
          <button class="calc-key calc-accent" data-key="+">+</button>

          <button class="calc-key calc-op" data-key="plus-minus">±</button>
          <button class="calc-key" data-key="0">0</button>
          <button class="calc-key" data-key=".">.</button>
          <button class="calc-key calc-equals" data-key="=">=</button>
        </div>
      </div>
    `;
  }

  function renderFxMarkup() {
    const result = fxService.convert(100, 'USD', 'PEN');
    const unitRate = fxService.getRate('USD', 'PEN');

    return `
      <div class="edge-tool-box">
        <div class="edge-box-header">
          <span style="font-weight: 700; font-size: 0.82rem; color: #0F172A;">Conversor Oficial en Tiempo Real</span>
          <span class="edge-live-badge">
            <span class="edge-live-dot"></span>
            En vivo
          </span>
        </div>

        <div class="edge-result-card">
          <div style="font-size: 0.65rem; color: #64748B; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">Resultado Calculado</div>
          <div class="edge-result-num" id="edge-fx-result-val">S/ ${result.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div class="edge-result-sub" id="edge-fx-rate-val">1 USD = ${unitRate.toFixed(4)} PEN</div>
        </div>

        <div class="edge-form-wrap">
          <div class="form-group">
            <label class="form-label">Monto a Convertir</label>
            <input type="number" id="edge-fx-amount" class="input-control" value="100" min="0" step="10" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 8px; align-items: flex-end;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">De</label>
              <select id="edge-fx-from" class="input-control">
                ${SUPPORTED_CURRENCIES.map(c => `
                  <option value="${c.code}" ${c.code === 'USD' ? 'selected' : ''}>
                    ${c.flag} ${c.code}
                  </option>
                `).join('')}
              </select>
            </div>

            <button type="button" id="edge-btn-swap-fx" class="edge-swap-btn" title="Invertir">
              ⇄
            </button>

            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">A</label>
              <select id="edge-fx-to" class="input-control">
                ${SUPPORTED_CURRENCIES.map(c => `
                  <option value="${c.code}" ${c.code === 'PEN' ? 'selected' : ''}>
                    ${c.flag} ${c.code}
                  </option>
                `).join('')}
              </select>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderSplitMarkup() {
    const split = calculateSplitBill({ totalAmount: 120, numPeople: 3, tipPercentage: 10 });

    return `
      <div class="edge-tool-box">
        <div class="edge-box-header">
          <span style="font-weight: 700; font-size: 0.82rem; color: #0F172A;">Dividir Cuenta & Propina</span>
          <span style="font-size: 0.70rem; color: #64748B;">Cálculo Exacto</span>
        </div>

        <div class="edge-result-card">
          <div style="font-size: 0.65rem; color: #64748B; text-transform: uppercase; font-weight: 700;">Cuota por Persona</div>
          <div class="edge-result-num" id="edge-split-per-person">S/ ${split.perPerson.toFixed(2)}</div>
          <div class="edge-result-sub" id="edge-split-grand-total">Total con propina: S/ ${split.grandTotal.toFixed(2)}</div>
        </div>

        <div class="edge-form-wrap">
          <div class="form-group">
            <label class="form-label">Total de la Cuenta</label>
            <input type="number" id="edge-split-total" class="input-control" value="120" min="1" step="5" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div class="form-group">
              <label class="form-label">Personas</label>
              <input type="number" id="edge-split-people" class="input-control" value="3" min="1" max="100" />
            </div>
            <div class="form-group">
              <label class="form-label">Propina (%)</label>
              <select id="edge-split-tip" class="input-control">
                <option value="0">0% (Sin propina)</option>
                <option value="5">5%</option>
                <option value="10" selected>10% (Estándar)</option>
                <option value="15">15%</option>
                <option value="20">20% (Excelente)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderLoanMarkup(symbol) {
    const loan = calculateLoanAmortization({
      principal: 5000,
      rate: 18,
      rateType: 'TEA',
      term: 12,
      termUnit: 'months',
      system: 'french'
    });

    return `
      <div class="edge-tool-box">
        <div class="edge-box-header">
          <span style="font-weight: 700; font-size: 0.82rem; color: #0F172A;">Simulador Financiero de Préstamos</span>
          <span class="edge-live-badge" style="background: #EEF2FF; color: #4F46E5;">
            Bancario Real
          </span>
        </div>

        <div class="edge-result-card" style="background: linear-gradient(135deg, #0F172A, #1E293B); color: #FFFFFF;">
          <div style="font-size: 0.65rem; color: #94A3B8; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">Cuota Mensual Estimada</div>
          <div class="edge-result-num" id="edge-loan-monthly" style="color: #FFFFFF;">${symbol} ${loan.monthlyPayment.toFixed(2)}</div>
          <div class="edge-result-sub" id="edge-loan-sub" style="color: #CBD5E1;">
            Interés Total: ${symbol} ${loan.totalInterest.toFixed(2)} · Total: ${symbol} ${loan.totalPaid.toFixed(2)}
          </div>
        </div>

        <div class="edge-form-wrap">
          <div class="form-group">
            <label class="form-label">Monto del Préstamo (${symbol})</label>
            <input type="number" id="edge-loan-amount" class="input-control" value="5000" min="100" step="500" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div class="form-group">
              <label class="form-label">Tasa de Interés (%)</label>
              <input type="number" id="edge-loan-rate" class="input-control" value="18" min="0" step="0.5" />
            </div>
            <div class="form-group">
              <label class="form-label">Tipo de Tasa</label>
              <select id="edge-loan-ratetype" class="input-control">
                <option value="TEA" selected>TEA (Efectiva Anual)</option>
                <option value="TEM">TEM (Mensual)</option>
                <option value="TNA">TNA (Nominal)</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div class="form-group">
              <label class="form-label">Plazo</label>
              <input type="number" id="edge-loan-term" class="input-control" value="12" min="1" />
            </div>
            <div class="form-group">
              <label class="form-label">Unidad</label>
              <select id="edge-loan-termunit" class="input-control">
                <option value="months" selected>Meses</option>
                <option value="years">Años</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Sistema de Amortización</label>
            <select id="edge-loan-system" class="input-control">
              <option value="french" selected>Francés (Cuotas Fijas - Estándar)</option>
              <option value="german">Alemán (Cuotas Decrecientes)</option>
            </select>
          </div>

          <!-- Collapsible Amortization Schedule Table -->
          <details class="edge-schedule-details">
            <summary style="font-size: 0.74rem; font-weight: 700; color: #4F46E5; cursor: pointer; padding: 6px 0;">
              📊 Ver Cronograma Mes a Mes (${loan.schedule.length} cuotas)
            </summary>
            <div class="edge-schedule-table-wrap" id="edge-loan-schedule-box">
              ${renderScheduleTable(loan.schedule, symbol)}
            </div>
          </details>
        </div>
      </div>
    `;
  }

  function renderScheduleTable(schedule, symbol) {
    if (!schedule || schedule.length === 0) return '<div style="padding: 8px; text-align: center; color: #94A3B8;">Sin datos</div>';
    return `
      <table class="edge-table">
        <thead>
          <tr>
            <th>Mes</th>
            <th>Cuota</th>
            <th>Capital</th>
            <th>Interés</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          ${schedule.map(row => `
            <tr>
              <td>#${row.month}</td>
              <td style="font-weight: 700;">${symbol}${row.payment.toFixed(2)}</td>
              <td>${symbol}${row.principal.toFixed(2)}</td>
              <td style="color: #DC2626;">${symbol}${row.interest.toFixed(2)}</td>
              <td style="color: #64748B;">${symbol}${row.remaining.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  function attachEvents(symbol, onAddTransaction) {
    // Open Edge Handle Click
    container.querySelector('#edge-panel-handle')?.addEventListener('click', () => {
      isEdgePanelOpen = true;
      render();
    });

    // Close Button & Backdrop Click
    container.querySelector('#btn-close-edge-panel')?.addEventListener('click', () => {
      isEdgePanelOpen = false;
      render();
    });
    container.querySelector('#edge-panel-backdrop')?.addEventListener('click', () => {
      isEdgePanelOpen = false;
      render();
    });

    // Tab Switchers
    container.querySelectorAll('.edge-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeEdgeTab = btn.dataset.tab;
        render();
      });
    });

    // Calculator Keypad Logic
    if (activeEdgeTab === 'calc') {
      container.querySelectorAll('.calc-key').forEach(btn => {
        btn.addEventListener('click', () => {
          handleCalcInput(btn.dataset.key);
          const screen = container.querySelector('#edge-calc-display');
          const history = container.querySelector('.edge-calc-history');
          if (screen) screen.innerText = calcDisplay;
          if (history) history.innerText = calcExpression || ' ';
        });
      });

      // Copy result button
      container.querySelector('#btn-copy-calc')?.addEventListener('click', () => {
        navigator.clipboard?.writeText(calcDisplay).then(() => {
          const btn = container.querySelector('#btn-copy-calc span');
          if (btn) {
            btn.innerText = '¡Copiado!';
            setTimeout(() => { btn.innerText = 'Copiar'; }, 1500);
          }
        });
      });

      // Send to expense modal
      container.querySelector('#btn-calc-to-expense')?.addEventListener('click', () => {
        const val = parseFloat(calcDisplay) || 0;
        isEdgePanelOpen = false;
        render();
        if (onAddTransaction && val > 0) {
          onAddTransaction('expense', { initialAmount: val });
        }
      });
    }

    // Live FX Event Listeners
    if (activeEdgeTab === 'fx') {
      const updateFx = () => {
        const amt = Number(container.querySelector('#edge-fx-amount')?.value) || 0;
        const from = container.querySelector('#edge-fx-from')?.value || 'USD';
        const to = container.querySelector('#edge-fx-to')?.value || 'PEN';
        const res = fxService.convert(amt, from, to);
        const rate = fxService.getRate(from, to);
        const toCurr = SUPPORTED_CURRENCIES.find(c => c.code === to) || { symbol: to };

        const resultEl = container.querySelector('#edge-fx-result-val');
        const rateEl = container.querySelector('#edge-fx-rate-val');
        if (resultEl) resultEl.innerText = `${toCurr.symbol} ${res.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (rateEl) rateEl.innerText = `1 ${from} = ${rate.toFixed(4)} ${to}`;
      };

      container.querySelector('#edge-fx-amount')?.addEventListener('input', updateFx);
      container.querySelector('#edge-fx-from')?.addEventListener('change', updateFx);
      container.querySelector('#edge-fx-to')?.addEventListener('change', updateFx);

      container.querySelector('#edge-btn-swap-fx')?.addEventListener('click', () => {
        const fromEl = container.querySelector('#edge-fx-from');
        const toEl = container.querySelector('#edge-fx-to');
        if (fromEl && toEl) {
          const temp = fromEl.value;
          fromEl.value = toEl.value;
          toEl.value = temp;
          updateFx();
        }
      });
    }

    // Split Bill Event Listeners
    if (activeEdgeTab === 'split') {
      const updateSplit = () => {
        const total = Number(container.querySelector('#edge-split-total')?.value) || 0;
        const people = Number(container.querySelector('#edge-split-people')?.value) || 1;
        const tip = Number(container.querySelector('#edge-split-tip')?.value) || 0;
        const s = calculateSplitBill({ totalAmount: total, numPeople: people, tipPercentage: tip });

        const perEl = container.querySelector('#edge-split-per-person');
        const grandEl = container.querySelector('#edge-split-grand-total');
        if (perEl) perEl.innerText = `S/ ${s.perPerson.toFixed(2)}`;
        if (grandEl) grandEl.innerText = `Total con propina: S/ ${s.grandTotal.toFixed(2)}`;
      };

      container.querySelector('#edge-split-total')?.addEventListener('input', updateSplit);
      container.querySelector('#edge-split-people')?.addEventListener('input', updateSplit);
      container.querySelector('#edge-split-tip')?.addEventListener('change', updateSplit);
    }

    // Loan Simulator Event Listeners
    if (activeEdgeTab === 'loan') {
      const updateLoan = () => {
        const amt = Number(container.querySelector('#edge-loan-amount')?.value) || 0;
        const rate = Number(container.querySelector('#edge-loan-rate')?.value) || 0;
        const rateType = container.querySelector('#edge-loan-ratetype')?.value || 'TEA';
        const term = Number(container.querySelector('#edge-loan-term')?.value) || 1;
        const termUnit = container.querySelector('#edge-loan-termunit')?.value || 'months';
        const system = container.querySelector('#edge-loan-system')?.value || 'french';

        const loan = calculateLoanAmortization({
          principal: amt,
          rate,
          rateType,
          term,
          termUnit,
          system
        });

        const monthlyEl = container.querySelector('#edge-loan-monthly');
        const subEl = container.querySelector('#edge-loan-sub');
        const scheduleBox = container.querySelector('#edge-loan-schedule-box');

        if (monthlyEl) {
          if (loan.isDecreasing) {
            monthlyEl.innerText = `${symbol} ${loan.firstPayment.toFixed(2)} → ${symbol} ${loan.lastPayment.toFixed(2)}`;
          } else {
            monthlyEl.innerText = `${symbol} ${loan.monthlyPayment.toFixed(2)}`;
          }
        }
        if (subEl) {
          subEl.innerText = `Interés Total: ${symbol} ${loan.totalInterest.toFixed(2)} · Total a Devolver: ${symbol} ${loan.totalPaid.toFixed(2)}`;
        }
        if (scheduleBox) {
          scheduleBox.innerHTML = renderScheduleTable(loan.schedule, symbol);
        }
      };

      container.querySelector('#edge-loan-amount')?.addEventListener('input', updateLoan);
      container.querySelector('#edge-loan-rate')?.addEventListener('input', updateLoan);
      container.querySelector('#edge-loan-ratetype')?.addEventListener('change', updateLoan);
      container.querySelector('#edge-loan-term')?.addEventListener('input', updateLoan);
      container.querySelector('#edge-loan-termunit')?.addEventListener('change', updateLoan);
      container.querySelector('#edge-loan-system')?.addEventListener('change', updateLoan);
    }
  }

  function handleCalcInput(key) {
    if (key >= '0' && key <= '9') {
      if (calcNewNumber) {
        calcDisplay = key;
        calcNewNumber = false;
      } else {
        calcDisplay = calcDisplay === '0' ? key : calcDisplay + key;
      }
      return;
    }

    if (key === '.') {
      if (calcNewNumber) {
        calcDisplay = '0.';
        calcNewNumber = false;
      } else if (!calcDisplay.includes('.')) {
        calcDisplay += '.';
      }
      return;
    }

    if (key === 'clear') {
      calcDisplay = '0';
      calcExpression = '';
      calcPrevNumber = null;
      calcOperation = null;
      calcNewNumber = true;
      return;
    }

    if (key === 'backspace') {
      if (calcDisplay.length > 1) {
        calcDisplay = calcDisplay.slice(0, -1);
      } else {
        calcDisplay = '0';
        calcNewNumber = true;
      }
      return;
    }

    if (key === 'plus-minus') {
      const num = parseFloat(calcDisplay);
      if (num !== 0) {
        calcDisplay = String(-num);
      }
      return;
    }

    if (key === 'percent') {
      const num = parseFloat(calcDisplay);
      calcDisplay = String(num / 100);
      calcNewNumber = true;
      return;
    }

    if (['+', '-', '*', '/'].includes(key)) {
      const current = parseFloat(calcDisplay);
      if (calcPrevNumber !== null && calcOperation && !calcNewNumber) {
        const computed = executeCalc(calcPrevNumber, current, calcOperation);
        calcDisplay = String(computed);
        calcPrevNumber = computed;
      } else {
        calcPrevNumber = current;
      }
      calcOperation = key;
      calcExpression = `${calcPrevNumber} ${key === '*' ? '×' : key === '/' ? '÷' : key}`;
      calcNewNumber = true;
      return;
    }

    if (key === '=') {
      if (calcPrevNumber !== null && calcOperation) {
        const current = parseFloat(calcDisplay);
        calcExpression = `${calcPrevNumber} ${calcOperation === '*' ? '×' : calcOperation === '/' ? '÷' : calcOperation} ${current} =`;
        const computed = executeCalc(calcPrevNumber, current, calcOperation);
        calcDisplay = String(computed);
        calcPrevNumber = null;
        calcOperation = null;
        calcNewNumber = true;
      }
    }
  }

  function executeCalc(a, b, op) {
    let res = 0;
    if (op === '+') res = a + b;
    if (op === '-') res = a - b;
    if (op === '*') res = a * b;
    if (op === '/') res = b !== 0 ? a / b : 0;
    return Number(Math.round(res * 100000000) / 100000000);
  }

  render();
}
