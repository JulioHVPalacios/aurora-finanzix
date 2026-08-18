/* ==========================================================================
   VALO OS - USER PROFILE MODAL
   Full city/country dropdowns with dynamic city list per country
   ========================================================================== */

import { storage } from '../services/storage.js';
import { t } from '../services/i18n.js';
import { createIcons, icons } from 'lucide';
import { ALL_COUNTRIES, getCitiesForCountry } from '../services/citiesData.js';

export function showUserProfileModal({ onSave }) {
  const portal = document.getElementById('modal-portal');
  if (!portal) return;

  const settings = storage.getSettings() || {};
  const currentFirst   = settings.userFirstName || '';
  const currentLast    = settings.userLastName  || '';
  const currentCity    = settings.userCity    || 'Lima';
  const currentCountry = settings.userCountry || 'Perú';
  const currentEmail   = settings.userEmail   || '';

  const firstI = currentFirst ? currentFirst.trim()[0] : '';
  const lastParts = currentLast ? currentLast.trim().split(/\s+/) : [];
  const lastI  = lastParts.length > 1 ? lastParts[lastParts.length-1][0] : (lastParts[0] ? lastParts[0][0] : '');
  const previewInitials = (firstI + lastI).toUpperCase() || '?';

  const countryOptions = ALL_COUNTRIES.map(c =>
    `<option value="${c}"${c === currentCountry ? ' selected' : ''}>${c}</option>`
  ).join('');

  function buildCityOpts(country, selected) {
    return getCitiesForCountry(country)
      .map(c => `<option value="${c}"${c === selected ? ' selected' : ''}>${c}</option>`)
      .join('');
  }

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  overlay.innerHTML = `
    <div class="bottom-sheet" style="max-width:440px;overflow-y:auto;max-height:92vh;">
      <div class="sheet-handle"></div>
      <div class="sheet-header">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:34px;height:34px;border-radius:10px;background:#0F172A;color:#FFFFFF;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:0.88rem;letter-spacing:0.5px;flex-shrink:0;">
            ${previewInitials}
          </div>
          <h3 class="sheet-title">Editar Perfil</h3>
        </div>
        <button type="button" class="sheet-close-btn" id="btn-profile-close">
          <i data-lucide="x" style="width:18px;height:18px;"></i>
        </button>
      </div>

      <form id="form-user-profile" style="display:flex;flex-direction:column;gap:12px;">
        <div class="form-group">
          <label class="form-label">Primer Nombre</label>
          <input type="text" id="prof-first-name" class="input-control" value="${currentFirst}" placeholder="Ej: Julio" />
        </div>
        <div class="form-group">
          <label class="form-label">Apellidos</label>
          <input type="text" id="prof-last-name" class="input-control" value="${currentLast}" placeholder="Ej: Hidalgo Palacios" />
          <span style="font-size:0.67rem;color:var(--ink-40);margin-top:2px;">Inicial 1° nombre + inicial 2° apellido = iniciales del avatar</span>
        </div>

        <!-- Country first so cities update accordingly -->
        <div class="form-group">
          <label class="form-label">País</label>
          <select id="prof-country" class="input-control" style="-webkit-appearance:none;appearance:none;background-image:url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%2394A3B8%27 stroke-width=%272.5%27%3E%3Cpolyline points=%276 9 12 15 18 9%27/%3E%3C/svg%3E');background-repeat:no-repeat;background-position:right 14px center;padding-right:40px;">
            ${countryOptions}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Ciudad</label>
          <select id="prof-city" class="input-control" style="-webkit-appearance:none;appearance:none;background-image:url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%2394A3B8%27 stroke-width=%272.5%27%3E%3Cpolyline points=%276 9 12 15 18 9%27/%3E%3C/svg%3E');background-repeat:no-repeat;background-position:right 14px center;padding-right:40px;">
            ${buildCityOpts(currentCountry, currentCity)}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Correo Electrónico (Opcional)</label>
          <input type="email" id="prof-email" class="input-control" value="${currentEmail}" placeholder="nombre@correo.com" />
        </div>

        <button type="submit" class="btn btn-primary btn-block" style="padding:12px;font-size:0.92rem;font-weight:700;margin-top:4px;">
          Guardar Perfil
        </button>
      </form>
    </div>
  `;

  createIcons({ icons, nameAttr: 'data-lucide', root: overlay });

  // Dynamic city update when country changes
  overlay.querySelector('#prof-country')?.addEventListener('change', (e) => {
    const citySelect = overlay.querySelector('#prof-city');
    if (citySelect) {
      citySelect.innerHTML = buildCityOpts(e.target.value, '');
    }
  });

  function close() {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 280);
  }

  overlay.querySelector('#btn-profile-close')?.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  overlay.querySelector('#form-user-profile')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const first   = overlay.querySelector('#prof-first-name').value.trim();
    const last    = overlay.querySelector('#prof-last-name').value.trim();
    const country = overlay.querySelector('#prof-country').value;
    const city    = overlay.querySelector('#prof-city').value;
    const email   = overlay.querySelector('#prof-email').value.trim();

    const fullName = [first, last].filter(Boolean).join(' ') || 'Mi Espacio';
    storage.updateSettings({
      userName: fullName, userFirstName: first, userLastName: last,
      userCity: city, userCountry: country, userEmail: email
    });

    onSave?.();
    close();
  });

  portal.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('active'));
}
