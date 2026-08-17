/* ==========================================================================
   AURORA FINANZIX - COST & PRODUCT PRICING CALCULATOR (LIQUID GLASS EDITION)
   Intuitive Step-by-Step for Businesses, Freelancers & Personal Projects
   ========================================================================== */

import { storage } from '../services/storage.js';
import { calculateCostProject } from '../services/costCalculator.js';

export function renderCostCalculator(container, { onShowToast }) {
  const settings = storage.getSettings() || {};
  const symbol = settings.currencySymbol || 'S/';
  let projects = storage.getCostProjects();

  let activeProject = projects[0] || {
    id: 'proj_' + Date.now(),
    name: 'Torta Artesanal de Chocolate',
    batchSize: 1,
    targetMargin: 40,
    taxRate: 0,
    materials: [
      { id: 'm1', name: 'Harina y Cacao Especial', qty: 1, unitCost: 12.50 },
      { id: 'm2', name: 'Caja y Empaque de Lujo', qty: 1, unitCost: 4.50 }
    ],
    labor: { hours: 2, ratePerHour: 10.00 },
    overheads: [
      { id: 'o1', name: 'Gas / Horno / Luz', amount: 6.00 }
    ]
  };

  function updateView() {
    const calc = calculateCostProject(activeProject);

    container.innerHTML = `
      <div class="view-transition-wrap">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; color: var(--ink);">
              🧮 Calculadora de Costos & Precios
            </h2>
            <p style="font-size: 0.74rem; color: var(--ink-60);">Calcula tu ganancia real y precio de venta sugerido</p>
          </div>
          <button id="btn-save-project" class="btn btn-primary" style="padding: 8px 16px; font-size: 0.82rem;">
            💾 Guardar
          </button>
        </div>

        <!-- Project Selector Bar -->
        <div style="display: flex; gap: 8px; align-items: center;">
          <select id="cost-project-selector" class="input-control" style="font-size: 0.85rem; font-weight: 700; flex: 1;">
            ${projects.map(p => `
              <option value="${p.id}" ${p.id === activeProject.id ? 'selected' : ''}>
                📦 ${p.name}
              </option>
            `).join('')}
          </select>
          <button id="btn-new-project" class="btn btn-secondary" style="padding: 10px 14px; font-size: 0.8rem; white-space: nowrap;">
            + Nuevo
          </button>
          <button id="btn-delete-project" class="btn btn-danger" style="padding: 10px 12px; font-size: 0.85rem;" title="Eliminar proyecto">
            <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
          </button>
        </div>

        <!-- Result Hero Card (Realtime Liquid Pricing) -->
        <div class="glass-card" style="background: linear-gradient(135deg, rgba(238, 242, 255, 0.95), rgba(245, 243, 255, 0.9)); border: 1.5px solid rgba(79, 70, 229, 0.25);">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 12px;">
            <div>
              <div style="font-size: 0.72rem; color: var(--ink-60); text-transform: uppercase; font-weight: 700;">Costo por Unidad</div>
              <div style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; color: #4338CA;">
                ${symbol}${calc.unitCost.toFixed(2)}
              </div>
            </div>
            <div>
              <div style="font-size: 0.72rem; color: var(--ink-60); text-transform: uppercase; font-weight: 700;">Precio de Venta Sugerido</div>
              <div style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; color: #059669;">
                ${symbol}${calc.suggestedPrice.toFixed(2)}
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid rgba(79, 70, 229, 0.15); font-size: 0.8rem;">
            <span>Ganancia Neta por Venta:</span>
            <strong style="color: #059669; font-family: var(--font-mono); font-size: 0.95rem;">+${symbol}${calc.netProfitPerUnit.toFixed(2)} (${activeProject.targetMargin || 40}%)</strong>
          </div>
        </div>

        <!-- Section 1: Materials & Ingredients -->
        <div class="glass-card">
          <div class="card-header">
            <span class="card-title">📦 1. Insumos & Materiales</span>
            <button id="btn-add-material" class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem;">
              + Añadir Insumo
            </button>
          </div>

          <div id="materials-container" style="display: flex; flex-direction: column; gap: 8px;">
            ${(activeProject.materials || []).map((m, idx) => `
              <div style="display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 6px; align-items: center;">
                <input type="text" class="input-control inp-mat-name" data-idx="${idx}" value="${m.name}" placeholder="Nombre del insumo" style="font-size: 0.8rem; padding: 8px 10px;" />
                <input type="number" min="0.1" step="any" class="input-control inp-mat-qty" data-idx="${idx}" value="${m.qty}" placeholder="Cant." style="font-size: 0.8rem; padding: 8px 6px; text-align: center;" />
                <input type="number" min="0" step="any" class="input-control inp-mat-cost" data-idx="${idx}" value="${m.unitCost}" placeholder="Costo" style="font-size: 0.8rem; padding: 8px 6px; text-align: right;" />
                <button type="button" class="btn-remove-material btn-danger" data-idx="${idx}" style="padding: 8px; border-radius: 8px; cursor: pointer; border: none;">✕</button>
              </div>
            `).join('')}
          </div>

          <div style="text-align: right; margin-top: 10px; font-size: 0.78rem; color: var(--ink-75); font-weight: 700;">
            Subtotal Insumos: <span style="font-family: var(--font-mono); color: var(--ink);">${symbol}${calc.materialCost.toFixed(2)}</span>
          </div>
        </div>

        <!-- Section 2: Labor & Overheads -->
        <div class="glass-card">
          <span class="card-title" style="margin-bottom: 12px; display: block;">⏱️ 2. Mano de Obra y Costos Operativos</span>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label">Horas de Trabajo</label>
              <input type="number" min="0" step="0.5" id="inp-labor-hours" class="input-control" value="${activeProject.labor?.hours || 0}" style="font-size: 0.88rem; font-weight: 700;" />
            </div>
            <div class="form-group">
              <label class="form-label">Pago por Hora (${symbol})</label>
              <input type="number" min="0" step="1" id="inp-labor-rate" class="input-control" value="${activeProject.labor?.ratePerHour || 0}" style="font-size: 0.88rem; font-weight: 700;" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="form-group">
              <label class="form-label">Margen de Ganancia (%)</label>
              <input type="number" min="1" max="500" step="5" id="inp-margin" class="input-control" value="${activeProject.targetMargin || 40}" style="font-size: 0.88rem; font-weight: 700;" />
            </div>
            <div class="form-group">
              <label class="form-label">Unidades por Lote</label>
              <input type="number" min="1" step="1" id="inp-batch-size" class="input-control" value="${activeProject.batchSize || 1}" style="font-size: 0.88rem; font-weight: 700;" />
            </div>
          </div>
        </div>
      </div>
    `;

    // Event Binders
    container.querySelector('#btn-save-project')?.addEventListener('click', () => {
      storage.saveCostProject(activeProject);
      projects = storage.getCostProjects();
      onShowToast?.('¡Proyecto guardado con éxito!', 'success');
      updateView();
    });

    container.querySelector('#btn-new-project')?.addEventListener('click', () => {
      const name = prompt('Nombre del nuevo producto o proyecto:');
      if (name) {
        const newProj = {
          id: 'proj_' + Date.now(),
          name,
          batchSize: 1,
          targetMargin: 40,
          taxRate: 0,
          materials: [{ id: 'm1', name: 'Material principal', qty: 1, unitCost: 10 }],
          labor: { hours: 1, ratePerHour: 10 },
          overheads: [{ id: 'o1', name: 'Servicios/Empaque', amount: 3 }]
        };
        storage.saveCostProject(newProj);
        projects = storage.getCostProjects();
        activeProject = newProj;
        updateView();
      }
    });

    container.querySelector('#btn-delete-project')?.addEventListener('click', () => {
      if (projects.length <= 1) {
        alert('Debes mantener al menos un proyecto.');
        return;
      }
      if (confirm(`¿Eliminar el proyecto "${activeProject.name}"?`)) {
        storage.deleteCostProject(activeProject.id);
        projects = storage.getCostProjects();
        activeProject = projects[0];
        updateView();
      }
    });

    container.querySelector('#cost-project-selector')?.addEventListener('change', (e) => {
      const found = projects.find(p => p.id === e.target.value);
      if (found) {
        activeProject = found;
        updateView();
      }
    });

    // Material Inputs
    container.querySelectorAll('.inp-mat-name').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = Number(e.target.getAttribute('data-idx'));
        activeProject.materials[idx].name = e.target.value;
      });
    });

    container.querySelectorAll('.inp-mat-qty').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = Number(e.target.getAttribute('data-idx'));
        activeProject.materials[idx].qty = Number(e.target.value) || 0;
        updateView();
      });
    });

    container.querySelectorAll('.inp-mat-cost').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = Number(e.target.getAttribute('data-idx'));
        activeProject.materials[idx].unitCost = Number(e.target.value) || 0;
        updateView();
      });
    });

    container.querySelectorAll('.btn-remove-material').forEach(btn => {
      btn.addEventListener('click', (e) => {
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
        unitCost: 5.0
      });
      updateView();
    });

    // Labor & Margin
    container.querySelector('#inp-labor-hours')?.addEventListener('input', (e) => {
      activeProject.labor.hours = Number(e.target.value) || 0;
      updateView();
    });

    container.querySelector('#inp-labor-rate')?.addEventListener('input', (e) => {
      activeProject.labor.ratePerHour = Number(e.target.value) || 0;
      updateView();
    });

    container.querySelector('#inp-margin')?.addEventListener('input', (e) => {
      activeProject.targetMargin = Number(e.target.value) || 0;
      updateView();
    });

    container.querySelector('#inp-batch-size')?.addEventListener('input', (e) => {
      activeProject.batchSize = Number(e.target.value) || 1;
      updateView();
    });
  }

  updateView();
}
