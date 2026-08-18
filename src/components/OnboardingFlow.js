/* ==========================================================================
   VALO OS - ONBOARDING FLOW v2
   - Language selector (ES/EN) on first screen
   - Peruvian cities dropdown + full world countries dropdown
   - Auto-switch language if non-Spanish-speaking country selected
   ========================================================================== */

import { storage } from '../services/storage.js';
import { setLanguage } from '../services/i18n.js';

const ONBOARDING_KEY = 'valo_onboarding_done_v1';

export function isOnboardingDone() {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
}
export function markOnboardingDone() {
  localStorage.setItem(ONBOARDING_KEY, 'true');
}

// Countries that speak Spanish → keep ES; all others → switch to EN
const SPANISH_SPEAKING_COUNTRIES = new Set([
  'Perú','México','España','Colombia','Argentina','Venezuela','Chile','Ecuador',
  'Guatemala','Cuba','Bolivia','República Dominicana','Honduras','Paraguay',
  'El Salvador','Nicaragua','Costa Rica','Panamá','Uruguay','Guinea Ecuatorial'
]);

const PERU_CITIES = [
  'Lima','Arequipa','Trujillo','Chiclayo','Piura','Iquitos','Cusco','Chimbote',
  'Huancayo','Tacna','Cajamarca','Puno','Juliaca','Ica','Sullana','Ayacucho',
  'Huánuco','Chincha Alta','Tarapoto','Pucallpa','Tumbes','Moquegua','Huaraz',
  'Puerto Maldonado','Pisco','Abancay','Moyobamba','Andahuaylas','Cerro de Pasco',
  'Ilo','Tingo María','Chachapoyas','Jaén','Bagua Grande','Paita','Talara',
  'Ferreñafe','Lambayeque','Barranca','Huacho','Chancay','Ica','Nazca',
  'Sicuani','Ilave','Juanjuí','Tocache','Yurimaguas','Requena','Contamana',
  'San Martín','Rioja','Lamas','Bellavista','Pichanaki','La Merced','Satipo',
  'Oxapampa','Tarma','Junín','Huancavelica','Acobamba','Lircay','Paucar del Sara Sara',
  'Otra ciudad'
];

const ALL_COUNTRIES = [
  // Latinoamérica & España (Spanish)
  'Perú','México','España','Colombia','Argentina','Venezuela','Chile','Ecuador',
  'Guatemala','Cuba','Bolivia','República Dominicana','Honduras','Paraguay',
  'El Salvador','Nicaragua','Costa Rica','Panamá','Uruguay','Guinea Ecuatorial',
  // ─── Resto del mundo ───
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
  'Brazil','Guyana','Suriname','French Guiana','Trinidad and Tobago','Jamaica',
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

export function showOnboarding({ onComplete }) {
  const root = document.getElementById('app-root') || document.body;

  if (!document.getElementById('onboarding-style')) {
    const style = document.createElement('style');
    style.id = 'onboarding-style';
    style.textContent = `
      @keyframes onbFadeIn  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
      @keyframes onbFadeOut { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(-24px)} }
      #onboarding-overlay {
        position:fixed;inset:0;z-index:99999;
        background:#FFFFFF;
        display:flex;flex-direction:column;
        align-items:center;justify-content:center;
        padding:28px 20px;
        animation:onbFadeIn 0.4s cubic-bezier(0.16,1,0.3,1) both;
      }
      #onboarding-overlay.leaving {
        animation:onbFadeOut 0.3s cubic-bezier(0.4,0,1,1) both;
        pointer-events:none;
      }
      .onb-inner { width:100%;max-width:360px;display:flex;flex-direction:column;align-items:center; }
      .onb-step  { display:none;flex-direction:column;align-items:center;width:100%; }
      .onb-step.active { display:flex;animation:onbFadeIn 0.28s ease both; }
      .onb-input, .onb-select {
        width:100%;padding:13px 16px;
        font-size:0.97rem;font-weight:600;
        border:2px solid rgba(15,23,42,0.10);
        border-radius:14px;outline:none;
        background:#F8FAFC;color:#0F172A;
        transition:border-color 0.18s;
        box-sizing:border-box;font-family:inherit;
        -webkit-appearance:none;appearance:none;
      }
      .onb-select { cursor:pointer; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%2394A3B8' viewBox='0 0 24 24'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 14px center; padding-right:40px; }
      .onb-input:focus, .onb-select:focus { border-color:#0F172A;background:#FFF; }
      .onb-btn-primary {
        width:100%;padding:14px;
        font-size:0.98rem;font-weight:800;
        background:#0F172A;color:#FFFFFF;
        border:none;border-radius:14px;
        cursor:pointer;transition:opacity 0.18s,transform 0.12s;
        font-family:inherit;letter-spacing:-0.2px;
      }
      .onb-btn-primary:active{transform:scale(0.98);opacity:0.9;}
      .onb-btn-skip {
        background:none;border:none;font-family:inherit;
        color:#94A3B8;font-size:0.8rem;cursor:pointer;
        padding:10px 16px;text-decoration:underline;text-underline-offset:3px;
      }
      .onb-btn-skip:hover{color:#64748B;}
      .onb-lang-bar {
        display:flex;gap:8px;margin-bottom:20px;
      }
      .onb-lang-chip {
        padding:6px 16px;border-radius:999px;font-weight:800;font-size:0.82rem;
        font-family:inherit;cursor:pointer;border:2px solid transparent;
        transition:all 0.18s;letter-spacing:0.04em;
      }
      .onb-lang-chip.active {
        background:#0F172A;color:#FFFFFF;border-color:#0F172A;
      }
      .onb-lang-chip:not(.active) {
        background:#F1F5F9;color:#64748B;border-color:#E2E8F0;
      }
      .onb-dots { display:flex;gap:6px;margin-bottom:24px; }
      .onb-dot {
        width:6px;height:6px;border-radius:50%;background:#E2E8F0;
        transition:background 0.2s,width 0.2s;
      }
      .onb-dot.active { background:#0F172A;width:18px;border-radius:3px; }
    `;
    document.head.appendChild(style);
  }

  const overlay = document.createElement('div');
  overlay.id = 'onboarding-overlay';

  // Initial language from storage (defaults to 'es')
  let currentLang = storage.getSettings()?.language || 'es';

  const tx = {
    es: {
      logo_sub: 'Tu espacio financiero personal',
      step1_emoji: '👋',
      step1_title: '¿Cómo te llamas?',
      step1_placeholder1: 'Primer nombre  (ej: Julio)',
      step1_placeholder2: 'Apellidos  (ej: Hidalgo Palacios)',
      step1_btn: 'Continuar →',
      step1_skip: 'Saltar',
      step2_emoji: '📍',
      step2_title: '¿Dónde estás?',
      step2_city_label: 'Ciudad',
      step2_country_label: 'País',
      step2_city_other: 'Otra ciudad',
      step2_country_other: 'Otro país',
      step2_btn: 'Continuar →',
      step2_skip: 'Saltar',
      step3_emoji: '✨',
      step3_title: '¡Todo listo',
      step3_title_end: '!',
      step3_sub: 'Tu espacio financiero está listo.',
      step3_btn: 'Entrar a VALO OS →',
    },
    en: {
      logo_sub: 'Your personal financial space',
      step1_emoji: '👋',
      step1_title: "What's your name?",
      step1_placeholder1: 'First name  (e.g. John)',
      step1_placeholder2: 'Last name  (e.g. Smith)',
      step1_btn: 'Continue →',
      step1_skip: 'Skip',
      step2_emoji: '📍',
      step2_title: 'Where are you?',
      step2_city_label: 'City',
      step2_country_label: 'Country',
      step2_city_other: 'Other city',
      step2_country_other: 'Other country',
      step2_btn: 'Continue →',
      step2_skip: 'Skip',
      step3_emoji: '✨',
      step3_title: "You're all set",
      step3_title_end: '!',
      step3_sub: 'Your financial space is ready.',
      step3_btn: 'Enter VALO OS →',
    }
  };

  function T(key) { return (tx[currentLang] || tx.es)[key] || tx.es[key]; }

  function buildHTML() {
    const dict = tx[currentLang] || tx.es;
    const cityOptions = PERU_CITIES.map(c => `<option value="${c}">${c}</option>`).join('');
    const countryOptions = ALL_COUNTRIES.map(c => `<option value="${c}"${c === 'Perú' ? ' selected' : ''}>${c}</option>`).join('');

    return `
      <div class="onb-inner">

        <!-- Language Selector Bar -->
        <div class="onb-lang-bar">
          <button class="onb-lang-chip${currentLang === 'es' ? ' active' : ''}" id="onb-lang-es">ES</button>
          <button class="onb-lang-chip${currentLang === 'en' ? ' active' : ''}" id="onb-lang-en">EN</button>
        </div>

        <!-- Logo -->
        <div style="margin-bottom:28px;text-align:center;">
          <img src="/icon.svg" style="width:54px;height:54px;margin-bottom:9px;display:block;margin-left:auto;margin-right:auto;" alt="VALO OS"/>
          <div style="font-weight:800;font-size:1.3rem;letter-spacing:-0.5px;color:#0F172A;">VALO OS</div>
          <div style="font-size:0.70rem;color:#94A3B8;margin-top:3px;letter-spacing:0.06em;text-transform:uppercase;">${dict.logo_sub}</div>
        </div>

        <!-- Progress Dots -->
        <div class="onb-dots">
          <div class="onb-dot active" id="dot-1"></div>
          <div class="onb-dot" id="dot-2"></div>
          <div class="onb-dot" id="dot-3"></div>
        </div>

        <!-- Step 1: Name -->
        <div class="onb-step active" id="onb-step-1">
          <div style="text-align:center;margin-bottom:22px;">
            <div style="font-size:1.9rem;margin-bottom:8px;">${dict.step1_emoji}</div>
            <h2 style="font-size:1.22rem;font-weight:800;color:#0F172A;margin:0;">${dict.step1_title}</h2>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;width:100%;">
            <input class="onb-input" id="onb-first-name" type="text" placeholder="${dict.step1_placeholder1}" autocomplete="given-name" />
            <input class="onb-input" id="onb-last-name" type="text" placeholder="${dict.step1_placeholder2}" autocomplete="family-name" />
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;width:100%;margin-top:16px;gap:2px;">
            <button class="onb-btn-primary" id="onb-btn-1">${dict.step1_btn}</button>
            <button class="onb-btn-skip" id="onb-skip-1">${dict.step1_skip}</button>
          </div>
        </div>

        <!-- Step 2: Location -->
        <div class="onb-step" id="onb-step-2">
          <div style="text-align:center;margin-bottom:22px;">
            <div style="font-size:1.9rem;margin-bottom:8px;">${dict.step2_emoji}</div>
            <h2 style="font-size:1.22rem;font-weight:800;color:#0F172A;margin:0;">${dict.step2_title}</h2>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;width:100%;">
            <div>
              <label style="font-size:0.72rem;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.06em;display:block;margin-bottom:5px;">${dict.step2_city_label}</label>
              <select class="onb-select" id="onb-city">
                ${cityOptions}
              </select>
            </div>
            <div>
              <label style="font-size:0.72rem;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.06em;display:block;margin-bottom:5px;">${dict.step2_country_label}</label>
              <select class="onb-select" id="onb-country">
                ${countryOptions}
              </select>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;width:100%;margin-top:16px;gap:2px;">
            <button class="onb-btn-primary" id="onb-btn-2">${dict.step2_btn}</button>
            <button class="onb-btn-skip" id="onb-skip-2">${dict.step2_skip}</button>
          </div>
        </div>

        <!-- Step 3: Done -->
        <div class="onb-step" id="onb-step-3">
          <div style="text-align:center;margin-bottom:28px;">
            <div style="font-size:2.8rem;margin-bottom:10px;">${dict.step3_emoji}</div>
            <h2 style="font-size:1.3rem;font-weight:800;color:#0F172A;margin:0 0 8px;" id="onb-welcome-name">${dict.step3_title}${dict.step3_title_end}</h2>
            <p style="font-size:0.83rem;color:#64748B;margin:0;line-height:1.5;">${dict.step3_sub}</p>
          </div>
          <button class="onb-btn-primary" id="onb-btn-3">${dict.step3_btn}</button>
        </div>

      </div>
    `;
  }

  function render() {
    overlay.innerHTML = buildHTML();
    bindEvents();
    updateDots(currentStep);
  }

  let currentStep = 1;
  let savedFirstName = '';
  let savedLastName = '';

  function bindEvents() {
    // Language chips
    overlay.querySelector('#onb-lang-es')?.addEventListener('click', () => {
      currentLang = 'es';
      setLanguage('es');
      render();
    });
    overlay.querySelector('#onb-lang-en')?.addEventListener('click', () => {
      currentLang = 'en';
      setLanguage('en');
      render();
    });

    // Step 1
    overlay.querySelector('#onb-btn-1')?.addEventListener('click', () => {
      savedFirstName = overlay.querySelector('#onb-first-name')?.value.trim() || '';
      savedLastName  = overlay.querySelector('#onb-last-name')?.value.trim() || '';
      goToStep(2);
    });
    overlay.querySelector('#onb-skip-1')?.addEventListener('click', () => finish('', ''));

    // Step 2
    overlay.querySelector('#onb-country')?.addEventListener('change', (e) => {
      const country = e.target.value;
      // Auto-detect language from country
      const langForCountry = SPANISH_SPEAKING_COUNTRIES.has(country) ? 'es' : 'en';
      if (langForCountry !== currentLang) {
        currentLang = langForCountry;
        setLanguage(currentLang);
        render();
        // Restore step 2 view
        goToStep(2);
      }
    });

    overlay.querySelector('#onb-btn-2')?.addEventListener('click', () => {
      const city    = overlay.querySelector('#onb-city')?.value || 'Lima';
      const country = overlay.querySelector('#onb-country')?.value || 'Perú';
      storage.updateSettings({ userCity: city, userCountry: country });

      const namePart = savedFirstName ? `, ${savedFirstName}` : '';
      const dict = tx[currentLang] || tx.es;
      const welcomeEl = overlay.querySelector('#onb-welcome-name');
      if (welcomeEl) welcomeEl.textContent = `${dict.step3_title}${namePart}${dict.step3_title_end}`;

      goToStep(3);
    });
    overlay.querySelector('#onb-skip-2')?.addEventListener('click', () => {
      const dict = tx[currentLang] || tx.es;
      const namePart = savedFirstName ? `, ${savedFirstName}` : '';
      const welcomeEl = overlay.querySelector('#onb-welcome-name');
      if (welcomeEl) welcomeEl.textContent = `${dict.step3_title}${namePart}${dict.step3_title_end}`;
      goToStep(3);
    });

    // Step 3
    overlay.querySelector('#onb-btn-3')?.addEventListener('click', () => finish(savedFirstName, savedLastName));
  }

  function goToStep(num) {
    currentStep = num;
    overlay.querySelectorAll('.onb-step').forEach(s => s.classList.remove('active'));
    overlay.querySelector(`#onb-step-${num}`)?.classList.add('active');
    updateDots(num);
  }

  function updateDots(num) {
    [1,2,3].forEach(i => {
      const dot = overlay.querySelector(`#dot-${i}`);
      if (dot) dot.classList.toggle('active', i === num);
    });
  }

  function finish(firstName, lastName) {
    if (firstName || lastName) {
      const fullName = [firstName, lastName].filter(Boolean).join(' ');
      storage.updateSettings({
        userName: fullName,
        userFirstName: firstName,
        userLastName: lastName
      });
    }

    markOnboardingDone();

    overlay.classList.add('leaving');
    overlay.addEventListener('animationend', () => {
      overlay.remove();
      onComplete?.();
    }, { once: true });
  }

  root.prepend(overlay);
  render();
}
