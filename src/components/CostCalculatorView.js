/* ==========================================================================
   AURORA LIQUID GLASS - COST & PRODUCT PRICING CALCULATOR
   ========================================================================== */

import { storage } from '../services/storage.js';
import { calculateCostProject } from '../services/costCalculator.js';

export function renderCostCalculator(container, { onShowToast }) {
  const settings = storage.getSettings();
  const symbol = settings.currencySymbol || 'S/';
  let projects = storage.getCostProjects();

  let activeProject = projects[0] || {
    id: 'proj_' + Date.now(),
    name: 'Producto / Receta Especial',
    batchSize: 1,
    targetMargin: 35,
    taxRate: 0,
    materials: [
      { id: 'm1', name: 'Materia prima base', qty: 1, unitCost: 8.50 },
      { id: 'm2', name: 'Empaque y presentación', qty: 1, unitCost: 2.00 }
    ],
    labor: { hours: 1, ratePerHour: 10.00 },
    overheads: [
      { id: 'o1', name: 'Energía / Servicios / Envíos', amount: 3.50 }
    ]
  };

  function updateView() {
    const calc = calculateCostProject(activeProject);

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2 style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 700;">
          🧮 Inteligencia de Costos & Precios
        </h2>
        <button id="btn-save-project" class="btn btn-primary" style="padding: 6px 14px; font-size: 0.8rem;">
          💾 Guardar
        </button>
      </div>

      <!-- Project Selector Row -->
      <div style="display: flex; gap: 8px; align-items: center;">
        <select id="cost-project-selector" class="input-control" style="font-size: 0.85rem; font-weight: 600;">
          ${projects.map(p => `
            <option value="${p.id}" ${p.id === activeProject.id ? 'selected' : ''}>
              📦 ${p.name}
            </option>
          `).join('')}
        </select>
        <button id="btn-new-project" class="btn btn-secondary" style="padding: 8px 12px; font-size: 0.8rem; white-space: nowrap;">
          + Nuevo
        </button>
        <button id="btn-delete-project" class="btn btn-danger" style="padding: 8px 10px; font-size: 0.8rem;">
          🗑️
        </button>
      </div>

      <!-- Realtime Liquid Pricing Card -->
      <div class="glass-card" style="border-left: 4px solid #10B981;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
          <div>
            <div style="font-size: 0.72rem; color: var(--ink-60); text-transform: uppercase; font-weight: 600;">Costo Unitario</div>
            <div style="font-family: var(--font-mono); font-size: 1.65rem; font-weight: 800; color: #FDE68A;">
              ${symbol}${calc.unitCost.toFixed(2)}
            </div>
          </div>
          <div>
            <div style="font-size: 0.72rem; color: var(--ink-60); text-transform: uppercase; font-weight: 600;">Precio de Venta Sugerido</div>
            <div style="font-family: var(--font-mono); font-size: 1.65rem; font-weight: 800; color: #6EE7B7;">
              ${symbol}${calc.unitSalePrice.toFixed(2)}
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 0.78rem;">
          <div>
            <span style="color: var(--ink-40); display: block;">Ganancia Neta</span>
            <span style="font-family: var(--font-mono); font-weight: 700; color: #6EE7B7;">+${symbol}${calc.unitProfit.toFixed(2)}</span>
          </div>
          <div>
            <span style="color: var(--ink-40); display: block;">Margen Real</span>
            <span style="font-family: var(--font-mono); font-weight: 700; color: #FDE68A;">${calc.targetMargin}%</span>
          </div>
          <div>
            <span style="color: var(--ink-40); display: block;">Pto. Equilibrio</span>
            <span style="font-family: var(--font-mono); font-weight: 700; color: #BAE6FD;">${calc.breakEvenUnits} unid.</span>
          </div>
        </div>
      </div>

      <!-- Basic Setup -->
      <div class="glass-card">
        <div class="card-header">
          <span class="card-title">⚙️ Configuración del Producto / Lote</span>
        </div>
        <div class="form-group">
          <label class="form-label">Nombre del Producto / Servicio</label>
          <input type="text" id="inp-proj-name" class="input-control" value="${activeProject.name}" />
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Unidades por Lote</label>
            <input type="number" min="1" id="inp-batch-size" class="input-control input-control-mono" value="${activeProject.batchSize}" />
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Margen Deseado (%)</label>
            <input type="number" min="1" max="99" id="inp-target-margin" class="input-control input-control-mono" value="${activeProject.targetMargin}" />
          </div>
        </div>
      </div>

      <!-- Materials List -->
      <div class="glass-card">
        <div class="card-header">
          <span class="card-title">📦 Insumos & Materia Prima</span>
          <span style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: #FDE68A;">
            Total: ${symbol}${calc.totalMaterials.toFixed(2)}
          </span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${(activeProject.materials || []).map((m, idx) => `
            <div style="display: flex; gap: 6px; align-items: center; background: rgba(255,255,255,0.05); padding: 8px; border-radius: var(--radius-element); border: 1px solid rgba(255,255,255,0.08);">
              <input type="text" class="input-control mat-name" data-idx="${idx}" value="${m.name}" placeholder="Insumo" style="flex: 2; padding: 6px 8px; font-size: 0.82rem;" />
              <input type="number" min="0.01" step="any" class="input-control input-control-mono mat-qty" data-idx="${idx}" value="${m.qty}" placeholder="Cant." style="flex: 1; padding: 6px 6px; font-size: 0.82rem;" title="Cantidad" />
              <input type="number" min="0" step="any" class="input-control input-control-mono mat-cost" data-idx="${idx}" value="${m.unitCost}" placeholder="Costo" style="flex: 1.2; padding: 6px 6px; font-size: 0.82rem;" title="Costo unitario" />
              <button type="button" class="btn-del-mat" data-idx="${idx}" style="background: none; border: none; color: #FDA4AF; cursor: pointer; padding: 4px;" title="Eliminar">✕</button>
            </div>
          `).join('')}
        </div>

        <button type="button" id="btn-add-material" class="btn btn-secondary btn-block" style="padding: 8px; font-size: 0.8rem; margin-top: 10px;">
          + Agregar Insumo
        </button>
      </div>

      <!-- Labor and Indirect Costs -->
      <div class="glass-card">
        <div class="card-header">
          <span class="card-title">⏱️ Mano de Obra & Gastos Indirectos</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Horas Empleadas</label>
            <input type="number" min="0" step="0.5" id="inp-labor-hours" class="input-control input-control-mono" value="${activeProject.labor?.hours || 0}" />
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Tarifa / Hora (${symbol})</label>
            <input type="number" min="0" step="0.5" id="inp-labor-rate" class="input-control input-control-mono" value="${activeProject.labor?.ratePerHour || 0}" />
          </div>
        </div>

        <div style="padding-top: 10px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
          <div class="card-header" style="margin-bottom: 6px;">
            <span style="font-size: 0.8rem; font-weight: 600; color: var(--ink-60);">Costos Indirectos (Luz, gas, empaque, etc.)</span>
            <span style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; color: #BAE6FD;">${symbol}${calc.totalOverheads.toFixed(2)}</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${(activeProject.overheads || []).map((o, idx) => `
              <div style="display: flex; gap: 6px; align-items: center;">
                <input type="text" class="input-control ovh-name" data-idx="${idx}" value="${o.name}" placeholder="Concepto" style="flex: 2; padding: 6px 8px; font-size: 0.82rem;" />
                <input type="number" min="0" step="0.5" class="input-control input-control-mono ovh-amount" data-idx="${idx}" value="${o.amount}" placeholder="Monto" style="flex: 1; padding: 6px 8px; font-size: 0.82rem;" />
                <button type="button" class="btn-del-ovh" data-idx="${idx}" style="background: none; border: none; color: #FDA4AF; cursor: pointer; padding: 4px;">✕</button>
              </div>
            `).join('')}
          </div>

          <button type="button" id="btn-add-overhead" class="btn btn-secondary btn-block" style="padding: 6px; font-size: 0.75rem; margin-top: 8px;">
            + Agregar Costo Indirecto
          </button>
        </div>
      </div>
    `;

    // Live update listeners
    container.querySelector('#inp-proj-name')?.addEventListener('input', (e) => {
      activeProject.name = e.target.value;
    });

    container.querySelector('#inp-batch-size')?.addEventListener('input', (e) => {
      activeProject.batchSize = Number(e.target.value) || 1;
      updateView();
    });

    container.querySelector('#inp-target-margin')?.addEventListener('input', (e) => {
      activeProject.targetMargin = Number(e.target.value) || 0;
      updateView();
    });

    container.querySelector('#inp-labor-hours')?.addEventListener('input', (e) => {
      activeProject.labor.hours = Number(e.target.value) || 0;
      updateView();
    });

    container.querySelector('#inp-labor-rate')?.addEventListener('input', (e) => {
      activeProject.labor.ratePerHour = Number(e.target.value) || 0;
      updateView();
    });

    container.querySelectorAll('.mat-name').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const idx = Number(inp.getAttribute('data-idx'));
        activeProject.materials[idx].name = e.target.value;
      });
    });

    container.querySelectorAll('.mat-qty').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const idx = Number(inp.getAttribute('data-idx'));
        activeProject.materials[idx].qty = Number(e.target.value) || 0;
        updateView();
      });
    });

    container.querySelectorAll('.mat-cost').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const idx = Number(inp.getAttribute('data-idx'));
        activeProject.materials[idx].unitCost = Number(e.target.value) || 0;
        updateView();
      });
    });

    container.querySelectorAll('.btn-del-mat').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-idx'));
        activeProject.materials.splice(idx, 1);
        updateView();
      });
    });

    container.querySelector('#btn-add-material')?.addEventListener('click', () => {
      activeProject.materials.push({
        id: 'm_' + Date.now(),
        name: 'Nuevo Insumo',
        qty: 1,
        unitCost: 1.00
      });
      updateView();
    });

    container.querySelectorAll('.ovh-name').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const idx = Number(inp.getAttribute('data-idx'));
        activeProject.overheads[idx].name = e.target.value;
      });
    });

    container.querySelectorAll('.ovh-amount').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const idx = Number(inp.getAttribute('data-idx'));
        activeProject.overheads[idx].amount = Number(e.target.value) || 0;
        updateView();
      });
    });

    container.querySelectorAll('.btn-del-ovh').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-idx'));
        activeProject.overheads.splice(idx, 1);
        updateView();
      });
    });

    container.querySelector('#btn-add-overhead')?.addEventListener('click', () => {
      activeProject.overheads.push({
        id: 'o_' + Date.now(),
        name: 'Gasto Indirecto',
        amount: 2.00
      });
      updateView();
    });

    container.querySelector('#btn-save-project')?.addEventListener('click', () => {
      storage.saveCostProject(activeProject);
      projects = storage.getCostProjects();
      onShowToast?.(`"${activeProject.name}" guardado con éxito`, 'success');
      updateView();
    });

    container.querySelector('#cost-project-selector')?.addEventListener('change', (e) => {
      const selected = projects.find(p => p.id === e.target.value);
      if (selected) {
        activeProject = JSON.parse(JSON.stringify(selected));
        updateView();
      }
    });

    container.querySelector('#btn-new-project')?.addEventListener('click', () => {
      activeProject = {
        id: 'proj_' + Date.now(),
        name: 'Nuevo Producto ' + (projects.length + 1),
        batchSize: 1,
        targetMargin: 35,
        taxRate: 0,
        materials: [{ id: 'm1', name: 'Insumo base', qty: 1, unitCost: 5.00 }],
        labor: { hours: 1, ratePerHour: 10.00 },
        overheads: [{ id: 'o1', name: 'Empaque y otros', amount: 2.00 }]
      };
      updateView();
    });

    container.querySelector('#btn-delete-project')?.addEventListener('click', () => {
      if (projects.length <= 1) {
        onShowToast?.('Debes mantener al menos un producto.', 'error');
        return;
      }
      if (confirm(`¿Eliminar "${activeProject.name}"?`)) {
        storage.deleteCostProject(activeProject.id);
        projects = storage.getCostProjects();
        activeProject = projects[0];
        updateView();
        onShowToast?.('Producto eliminado', 'success');
      }
    });
  }

  updateView();
}
