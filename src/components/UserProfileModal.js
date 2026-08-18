/* ==========================================================================
   VALO OS - USER PROFILE & PERSONALIZATION MODAL
   Full city/country dropdowns, custom initials, local-first data
   ========================================================================== */

import { storage } from '../services/storage.js';
import { t } from '../services/i18n.js';
import { createIcons, icons } from 'lucide';

const PERU_CITIES = [
  'Lima','Arequipa','Trujillo','Chiclayo','Piura','Iquitos','Cusco','Chimbote',
  'Huancayo','Tacna','Cajamarca','Puno','Juliaca','Ica','Sullana','Ayacucho',
  'Huánuco','Chincha Alta','Tarapoto','Pucallpa','Tumbes','Moquegua','Huaraz',
  'Puerto Maldonado','Pisco','Abancay','Moyobamba','Andahuaylas','Cerro de Pasco',
  'Ilo','Tingo María','Chachapoyas','Jaén','Bagua Grande','Paita','Talara',
  'Ferreñafe','Lambayeque','Barranca','Huacho','Chancay','Nazca','Sicuani',
  'Ilave','Juanjuí','Tocache','Yurimaguas','Requena','Contamana',
  'Rioja','Lamas','Bellavista','Pichanaki','La Merced','Satipo',
  'Oxapampa','Tarma','Junín','Huancavelica','Acobamba','Lircay',
  'Otra ciudad'
];

const ALL_COUNTRIES = [
  'Perú','México','España','Colombia','Argentina','Venezuela','Chile','Ecuador',
  'Guatemala','Cuba','Bolivia','República Dominicana','Honduras','Paraguay',
  'El Salvador','Nicaragua','Costa Rica','Panamá','Uruguay','Guinea Ecuatorial',
  'United States','United Kingdom','Canada','Australia','New Zealand',
  'Germany','France','Italy','Portugal','Netherlands','Belgium','Switzerland',
  'Austria','Sweden','Norway','Denmark','Finland','Poland','Czech Republic',
  'Hungary','Romania','Greece','Turkey','Russia','Ukraine','Israel',
  'Saudi Arabia','United Arab Emirates','Qatar','Kuwait','Bahrain','Oman','Jordan',
  'Egypt','Morocco','Tunisia','Algeria','South Africa','Nigeria','Kenya','Ghana',
  'Ethiopia','Tanzania','Uganda','Cameroon','Senegal','Ivory Coast',
  'India','Pakistan','Bangladesh','Sri Lanka','Nepal','China','Japan','South Korea',
  'Indonesia','Philippines','Vietnam','Thailand','Malaysia','Singapore','Myanmar',
  'Cambodia','Laos','Taiwan','Hong Kong','Mongolia',
  'Brazil','Guyana','Suriname','Trinidad and Tobago','Jamaica',
  'Haiti','Barbados','Bahamas','Belize','Puerto Rico',
  'Afghanistan','Iran','Iraq','Syria','Lebanon','Libya','Sudan','Somalia',
  'Azerbaijan','Kazakhstan','Uzbekistan','Georgia','Armenia','Belarus',
  'Moldova','Serbia','Croatia','Slovenia','Bosnia and Herzegovina','Albania',
  'North Macedonia','Kosovo','Montenegro','Bulgaria','Latvia','Lithuania','Estonia',
  'Iceland','Ireland','Luxembourg','Malta','Cyprus','Slovakia',
  'Mozambique','Angola','Zambia','Zimbabwe','Botswana','Namibia','Rwanda',
  'Democratic Republic of the Congo','Congo','Gabon','Madagascar','Mali','Niger',
  'Chad','Central African Republic','Burkina Faso',
  'Papua New Guinea','Fiji','Samoa','Tonga','Vanuatu',
  'Otro país'
];

export function showUserProfileModal({ onSave }) {
  const portal = document.getElementById('modal-portal');
  if (!portal) return;

  const settings = storage.getSettings() || {};
  const currentFirst   = settings.userFirstName || '';
  const currentLast    = settings.userLastName || '';
  const currentCity    = settings.userCity || 'Lima';
  const currentCountry = settings.userCountry || 'Perú';
  const currentEmail   = settings.userEmail || '';

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const cityOptions    = PERU_CITIES.map(c => `<option value="${c}"${c === currentCity ? ' selected' : ''}>${c}</option>`).join('');
  const countryOptions = ALL_COUNTRIES.map(c => `<option value="${c}"${c === currentCountry ? ' selected' : ''}>${c}</option>`).join('');

  // Current initials preview
  const firstI = currentFirst ? currentFirst.trim()[0] : '';
  const lastParts = currentLast ? currentLast.trim().split(/\s+/) : [];
  const lastI  = lastParts.length > 1 ? lastParts[lastParts.length - 1][0] : (lastParts[0] ? lastParts[0][0] : '');
  const previewInitials = (firstI + lastI).toUpperCase() || '?';

  overlay.innerHTML = `
    <div class="bottom-sheet" style="max-width: 440px; overflow-y: auto; max-height: 92vh;">
      <div class="sheet-handle"></div>
      <div class="sheet-header">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 34px; height: 34px; border-radius: 10px; background: #0F172A; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.88rem; letter-spacing: 0.5px; flex-shrink: 0;">
            ${previewInitials}
          </div>
          <h3 class="sheet-title">Editar Perfil</h3>
        </div>
        <button type="button" class="sheet-close-btn" id="btn-profile-close">
          <i data-lucide="x" style="width: 18px; height: 18px;"></i>
        </button>
      </div>

      <form id="form-user-profile" style="display: flex; flex-direction: column; gap: 12px;">
        <!-- Names -->
        <div class="form-group">
          <label class="form-label">Primer Nombre</label>
          <input type="text" id="prof-first-name" class="input-control" value="${currentFirst}" placeholder="Ej: Julio" required />
        </div>
        <div class="form-group">
          <label class="form-label">Apellidos</label>
          <input type="text" id="prof-last-name" class="input-control" value="${currentLast}" placeholder="Ej: Hidalgo Palacios" />
          <span style="font-size: 0.67rem; color: var(--ink-40); margin-top: 2px;">Inicial 1° nombre + inicial 2° apellido = iniciales del avatar</span>
        </div>

        <!-- City Dropdown -->
        <div class="form-group">
          <label class="form-label">Ciudad</label>
          <select id="prof-city" class="input-control" style="-webkit-appearance:none;appearance:none;background-image:url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 fill=%27%2394A3B8%27 viewBox=%270 0 24 24%27%3E%3Cpath d=%27M6 9l6 6 6-6%27/%3E%3C/svg%3E');background-repeat:no-repeat;background-position:right 14px center;padding-right:40px;">
            ${cityOptions}
          </select>
        </div>

        <!-- Country Dropdown -->
        <div class="form-group">
          <label class="form-label">País</label>
          <select id="prof-country" class="input-control" style="-webkit-appearance:none;appearance:none;background-image:url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 fill=%27%2394A3B8%27 viewBox=%270 0 24 24%27%3E%3Cpath d=%27M6 9l6 6 6-6%27/%3E%3C/svg%3E');background-repeat:no-repeat;background-position:right 14px center;padding-right:40px;">
            ${countryOptions}
          </select>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label class="form-label">Correo Electrónico (Opcional)</label>
          <input type="email" id="prof-email" class="input-control" value="${currentEmail}" placeholder="nombre@correo.com" />
        </div>

        <button type="submit" class="btn btn-primary btn-block" style="padding: 12px; font-size: 0.92rem; font-weight: 700; margin-top: 4px;">
          Guardar Perfil
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
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  overlay.querySelector('#form-user-profile')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const first   = overlay.querySelector('#prof-first-name').value.trim();
    const last    = overlay.querySelector('#prof-last-name').value.trim();
    const city    = overlay.querySelector('#prof-city').value;
    const country = overlay.querySelector('#prof-country').value;
    const email   = overlay.querySelector('#prof-email').value.trim();

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
