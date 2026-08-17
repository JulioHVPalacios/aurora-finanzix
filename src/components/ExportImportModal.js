/* ==========================================================================
   VALO OS - BACKUP, EXPORT & RESTORE MODAL
   100% Bilingual (ES / EN) with Vector Lucide Icons
   ========================================================================== */

import { storage } from '../services/storage.js';
import { t } from '../services/i18n.js';
import { createIcons, icons } from 'lucide';

export function showExportImportModal({ onDataReload, onShowToast }) {
  const portal = document.getElementById('modal-portal');
  if (!portal) return;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  overlay.innerHTML = `
    <div class="bottom-sheet">
      <div class="sheet-handle"></div>
      <div class="sheet-header">
        <h3 class="sheet-title">${t('modal_export_title')}</h3>
        <button type="button" class="sheet-close-btn" id="btn-export-close">
          <i data-lucide="x" style="width: 18px; height: 18px;"></i>
        </button>
      </div>

      <p style="font-size: 0.78rem; color: var(--ink-60); margin-bottom: 16px;">
        ${t('modal_export_desc')}
      </p>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        <!-- Export to CSV / Excel -->
        <button type="button" id="btn-download-csv" class="btn btn-secondary btn-block" style="justify-content: flex-start; padding: 12px 16px; gap: 12px;">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: #ECFDF5; color: #059669; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <i data-lucide="file-spreadsheet" style="width: 18px; height: 18px;"></i>
          </div>
          <div style="text-align: left;">
            <div style="font-size: 0.85rem; font-weight: 800; color: var(--ink);">${t('modal_export_csv_title')}</div>
            <div style="font-size: 0.7rem; color: var(--ink-60);">${t('modal_export_csv_desc')}</div>
          </div>
        </button>

        <!-- Export JSON Backup -->
        <button type="button" id="btn-download-json" class="btn btn-secondary btn-block" style="justify-content: flex-start; padding: 12px 16px; gap: 12px;">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: #EEF2FF; color: #4F46E5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <i data-lucide="save" style="width: 18px; height: 18px;"></i>
          </div>
          <div style="text-align: left;">
            <div style="font-size: 0.85rem; font-weight: 800; color: var(--ink);">${t('modal_export_json_title')}</div>
            <div style="font-size: 0.7rem; color: var(--ink-60);">${t('modal_export_json_desc')}</div>
          </div>
        </button>

        <!-- Import JSON Backup -->
        <div style="position: relative;">
          <input type="file" id="inp-import-file" accept=".json" style="display: none;" />
          <button type="button" id="btn-trigger-import" class="btn btn-secondary btn-block" style="justify-content: flex-start; padding: 12px 16px; gap: 12px;">
            <div style="width: 36px; height: 36px; border-radius: 10px; background: #FFFBEB; color: #D97706; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <i data-lucide="folder-open" style="width: 18px; height: 18px;"></i>
            </div>
            <div style="text-align: left;">
              <div style="font-size: 0.85rem; font-weight: 800; color: var(--ink);">${t('modal_import_json_title')}</div>
              <div style="font-size: 0.7rem; color: var(--ink-60);">${t('modal_import_json_desc')}</div>
            </div>
          </button>
        </div>

        <!-- Print / PDF Summary -->
        <button type="button" id="btn-print-summary" class="btn btn-secondary btn-block" style="justify-content: flex-start; padding: 12px 16px; gap: 12px;">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: #F8FAFC; color: #0F172A; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <i data-lucide="printer" style="width: 18px; height: 18px;"></i>
          </div>
          <div style="text-align: left;">
            <div style="font-size: 0.85rem; font-weight: 800; color: var(--ink);">${t('modal_print_title')}</div>
            <div style="font-size: 0.7rem; color: var(--ink-60);">${t('modal_print_desc')}</div>
          </div>
        </button>
      </div>
    </div>
  `;

  createIcons({ icons, nameAttr: 'data-lucide', root: overlay });

  function close() {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 280);
  }

  overlay.querySelector('#btn-export-close')?.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  // CSV Export
  overlay.querySelector('#btn-download-csv')?.addEventListener('click', () => {
    const txs = storage.getTransactions() || [];
    if (txs.length === 0) {
      onShowToast?.('No hay transacciones registradas para exportar');
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Fecha,Tipo,Concepto,Categoria,Monto,Metodo,Fijo,Nota\n';

    txs.forEach(t => {
      const row = [
        t.date || '',
        t.type || 'expense',
        `"${(t.title || '').replace(/"/g, '""')}"`,
        t.category || '',
        t.amount || 0,
        t.paymentMethod || 'cash',
        t.isFixed ? 'SI' : 'NO',
        `"${(t.note || '').replace(/"/g, '""')}"`
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VALO_Reporte_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast?.('Reporte CSV descargado con éxito');
    close();
  });

  // JSON Export
  overlay.querySelector('#btn-download-json')?.addEventListener('click', () => {
    const backupData = storage.exportAllData();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `VALO_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast?.('Respaldo JSON descargado con éxito');
    close();
  });

  // JSON Import
  const fileInput = overlay.querySelector('#inp-import-file');
  overlay.querySelector('#btn-trigger-import')?.addEventListener('click', () => {
    fileInput?.click();
  });

  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const success = storage.importAllData(parsed);
        if (success) {
          onShowToast?.('Respaldo restaurado con éxito');
          onDataReload?.();
          close();
        } else {
          onShowToast?.('Error al validar el archivo de respaldo');
        }
      } catch (err) {
        onShowToast?.('Formato de archivo inválido');
      }
    };
    reader.readAsText(file);
  });

  // Print Summary
  overlay.querySelector('#btn-print-summary')?.addEventListener('click', () => {
    window.print();
    close();
  });

  portal.appendChild(overlay);
  requestAnimationFrame(() => {
    overlay.classList.add('active');
  });
}
