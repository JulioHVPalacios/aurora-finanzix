/* ==========================================================================
   FINANZIX PRO - BACKUP, EXPORT & RESTORE MODAL
   ========================================================================== */

import { storage } from '../services/storage.js';

export function showExportImportModal({ onDataReload, onShowToast }) {
  const portal = document.getElementById('modal-portal');
  if (!portal) return;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  overlay.innerHTML = `
    <div class="bottom-sheet">
      <div class="sheet-handle"></div>
      <div class="sheet-header">
        <h3 class="sheet-title">📦 Respaldos y Exportación</h3>
        <button type="button" class="sheet-close-btn" id="btn-export-close">✕</button>
      </div>

      <p style="font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 16px;">
        Tus datos son 100% privados y se guardan en tu dispositivo. Puedes descargarlos o exportarlos a Excel cuando quieras.
      </p>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        <!-- Export to CSV / Excel -->
        <button type="button" id="btn-download-csv" class="btn btn-secondary btn-block" style="justify-content: flex-start; padding: 12px 16px;">
          <span style="font-size: 1.3rem;">📊</span>
          <div style="text-align: left;">
            <div style="font-size: 0.85rem; font-weight: 700;">Descargar reporte en Excel (.CSV)</div>
            <div style="font-size: 0.7rem; color: var(--text-muted);">Tabla de todos tus movimientos y gastos</div>
          </div>
        </button>

        <!-- Export JSON Backup -->
        <button type="button" id="btn-download-json" class="btn btn-secondary btn-block" style="justify-content: flex-start; padding: 12px 16px;">
          <span style="font-size: 1.3rem;">💾</span>
          <div style="text-align: left;">
            <div style="font-size: 0.85rem; font-weight: 700;">Crear Respaldo Completo (.JSON)</div>
            <div style="font-size: 0.7rem; color: var(--text-muted);">Copia de seguridad de gastos, costos y presupuestos</div>
          </div>
        </button>

        <!-- Import JSON Backup -->
        <div style="position: relative;">
          <input type="file" id="inp-import-file" accept=".json" style="display: none;" />
          <button type="button" id="btn-trigger-import" class="btn btn-secondary btn-block" style="justify-content: flex-start; padding: 12px 16px;">
            <span style="font-size: 1.3rem;">📂</span>
            <div style="text-align: left;">
              <div style="font-size: 0.85rem; font-weight: 700;">Restaurar Respaldo (.JSON)</div>
              <div style="font-size: 0.7rem; color: var(--text-muted);">Cargar datos guardados previamente</div>
            </div>
          </button>
        </div>

        <!-- Print / PDF Summary -->
        <button type="button" id="btn-print-summary" class="btn btn-secondary btn-block" style="justify-content: flex-start; padding: 12px 16px;">
          <span style="font-size: 1.3rem;">🖨️</span>
          <div style="text-align: left;">
            <div style="font-size: 0.85rem; font-weight: 700;">Imprimir / Guardar en PDF</div>
            <div style="font-size: 0.7rem; color: var(--text-muted);">Vista lista para imprimir o guardar reporte PDF</div>
          </div>
        </button>
      </div>

      <button type="button" class="btn btn-primary btn-block" id="btn-close-export-bottom" style="margin-top: 18px;">
        Cerrar
      </button>
    </div>
  `;

  function close() {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 280);
  }

  portal.appendChild(overlay);

  // Download CSV
  overlay.querySelector('#btn-download-csv')?.addEventListener('click', () => {
    const csvContent = storage.exportCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finanzix_reporte_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast?.('Reporte CSV descargado con éxito', 'success');
  });

  // Download JSON Backup
  overlay.querySelector('#btn-download-json')?.addEventListener('click', () => {
    const jsonContent = storage.exportBackupJSON();
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finanzix_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast?.('Copia de respaldo JSON descargada', 'success');
  });

  // Import JSON File
  const fileInput = overlay.querySelector('#inp-import-file');
  overlay.querySelector('#btn-trigger-import')?.addEventListener('click', () => {
    fileInput?.click();
  });

  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      const res = storage.importBackupJSON(content);
      if (res.success) {
        onShowToast?.(res.message, 'success');
        close();
        onDataReload?.();
      } else {
        onShowToast?.(res.message, 'error');
      }
    };
    reader.readAsText(file);
  });

  // Print summary
  overlay.querySelector('#btn-print-summary')?.addEventListener('click', () => {
    window.print();
  });

  overlay.querySelector('#btn-export-close')?.addEventListener('click', close);
  overlay.querySelector('#btn-close-export-bottom')?.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  requestAnimationFrame(() => overlay.classList.add('active'));
}
