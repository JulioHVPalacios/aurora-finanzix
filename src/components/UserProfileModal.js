/* ==========================================================================
   VALO OS - USER PROFILE & PERSONALIZATION MODAL
   Frictionless Local-First Identity & Custom Initials
   ========================================================================== */

import { storage } from '../services/storage.js';
import { t } from '../services/i18n.js';
import { createIcons, icons } from 'lucide';

export function showUserProfileModal({ onSave }) {
  const portal = document.getElementById('modal-portal');
  if (!portal) return;

  const settings = storage.getSettings() || {};
  const currentFirst = settings.userFirstName || (settings.userName !== 'Mi Espacio' && settings.userName !== 'My Space' ? settings.userName.split(' ')[0] : '');
  const currentLast = settings.userLastName || (settings.userName !== 'Mi Espacio' && settings.userName !== 'My Space' ? settings.userName.split(' ').slice(1).join(' ') : '');
  const currentCity = settings.userCity || 'Lima';
  const currentCountry = settings.userCountry || 'Perú';
  const currentEmail = settings.userEmail || '';
  const currentAge = settings.userAge || '';

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  overlay.innerHTML = `
    <div class="bottom-sheet" style="max-width: 440px;">
      <div class="sheet-handle"></div>
      <div class="sheet-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 32px; height: 32px; border-radius: 10px; background: #0F172A; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem;">
            ${(currentFirst[0] || 'V') + (currentLast[0] || 'O')}
          </div>
          <h3 class="sheet-title">Perfil Financiero Personal</h3>
        </div>
        <button type="button" class="sheet-close-btn" id="btn-profile-close">
          <i data-lucide="x" style="width: 18px; height: 18px;"></i>
        </button>
      </div>

      <p style="font-size: 0.76rem; color: var(--ink-60); margin-bottom: 14px;">
        Personaliza tu experiencia. Tus datos son 100% privados y se almacenan únicamente en tu dispositivo.
      </p>

      <form id="form-user-profile" style="display: flex; flex-direction: column; gap: 12px;">
        <!-- First Name -->
        <div class="form-group">
          <label class="form-label">Primer Nombre</label>
          <input type="text" id="prof-first-name" class="input-control" value="${currentFirst}" placeholder="Ej: Julio" required autofocus />
        </div>

        <!-- Last Name / Surnames -->
        <div class="form-group">
          <label class="form-label">Apellidos (Segundo Apellido)</label>
          <input type="text" id="prof-last-name" class="input-control" value="${currentLast}" placeholder="Ej: Hidalgo Palacios" />
          <span style="font-size: 0.68rem; color: var(--ink-40); margin-top: 2px;">Se usará tu 1° nombre y 2° apellido para tus iniciales (ej: JP)</span>
        </div>

        <!-- City and Country -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="form-group">
            <label class="form-label">Ciudad</label>
            <input type="text" id="prof-city" class="input-control" value="${currentCity}" placeholder="Ej: Lima" />
          </div>
          <div class="form-group">
            <label class="form-label">País</label>
            <input type="text" id="prof-country" class="input-control" value="${currentCountry}" placeholder="Ej: Perú" />
          </div>
        </div>

        <!-- Email (Optional) -->
        <div class="form-group">
          <label class="form-label">Correo Electrónico (Opcional)</label>
          <input type="email" id="prof-email" class="input-control" value="${currentEmail}" placeholder="nombre@correo.com" />
        </div>

        <button type="submit" class="btn btn-primary btn-block" style="padding: 12px; font-size: 0.92rem; font-weight: 700; margin-top: 4px;">
          Guardar y Actualizar Perfil
        </button>
      </form>
    </div>
  `;

  createIcons({ icons, nameAttr: 'data-lucide', root: overlay });

  function close() {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 280);
  }

  overlay.querySelector('#btn-profile-close')?.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  overlay.querySelector('#form-user-profile')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const first = overlay.querySelector('#prof-first-name').value.trim();
    const last = overlay.querySelector('#prof-last-name').value.trim();
    const city = overlay.querySelector('#prof-city').value.trim();
    const country = overlay.querySelector('#prof-country').value.trim();
    const email = overlay.querySelector('#prof-email').value.trim();

    const fullName = [first, last].filter(Boolean).join(' ') || 'Mi Espacio';

    storage.updateSettings({
      userName: fullName,
      userFirstName: first,
      userLastName: last,
      userCity: city,
      userCountry: country,
      userEmail: email
    });

    onSave?.();
    close();
  });

  portal.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('active'));
}
