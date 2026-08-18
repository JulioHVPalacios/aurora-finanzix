/* ==========================================================================
   VALO OS - ONBOARDING FLOW v3
   - Language selector (ES/EN) on first screen
   - Cities update dynamically based on selected country
   - Auto-switch app language for non-Spanish-speaking countries
   ========================================================================== */

import { storage } from '../services/storage.js';
import { setLanguage } from '../services/i18n.js';
import { ALL_COUNTRIES, getCitiesForCountry } from '../services/citiesData.js';

const ONBOARDING_KEY = 'valo_onboarding_done_v1';

export function isOnboardingDone() {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
}
export function markOnboardingDone() {
  localStorage.setItem(ONBOARDING_KEY, 'true');
}

const SPANISH_SPEAKING_COUNTRIES = new Set([
  'Perú','México','España','Colombia','Argentina','Venezuela','Chile','Ecuador',
  'Guatemala','Cuba','Bolivia','República Dominicana','Honduras','Paraguay',
  'El Salvador','Nicaragua','Costa Rica','Panamá','Uruguay','Guinea Ecuatorial',
  'Puerto Rico','Belize'
]);

const ONBOARDING_TX = {
  es: {
    logo_sub:            'Tu espacio financiero personal',
    step1_emoji:         '👋',
    step1_title:         '¿Cómo te llamas?',
    step1_ph1:           'Primer nombre  (ej: Julio)',
    step1_ph2:           'Apellidos  (ej: Hidalgo Palacios)',
    step1_btn:           'Continuar →',
    step1_skip:          'Saltar',
    step2_emoji:         '📍',
    step2_title:         '¿Dónde estás?',
    step2_city_lbl:      'Ciudad',
    step2_country_lbl:   'País',
    step2_btn:           'Continuar →',
    step2_skip:          'Saltar',
    step3_emoji:         '✨',
    step3_base:          '¡Todo listo',
    step3_end:           '!',
    step3_sub:           'Tu espacio financiero está listo.',
    step3_btn:           'Entrar a VALO OS →',
  },
  en: {
    logo_sub:            'Your personal financial space',
    step1_emoji:         '👋',
    step1_title:         "What's your name?",
    step1_ph1:           'First name  (e.g. John)',
    step1_ph2:           'Last name  (e.g. Smith)',
    step1_btn:           'Continue →',
    step1_skip:          'Skip',
    step2_emoji:         '📍',
    step2_title:         'Where are you located?',
    step2_city_lbl:      'City',
    step2_country_lbl:   'Country',
    step2_btn:           'Continue →',
    step2_skip:          'Skip',
    step3_emoji:         '✨',
    step3_base:          "You're all set",
    step3_end:           '!',
    step3_sub:           'Your financial space is ready.',
    step3_btn:           'Enter VALO OS →',
  }
};

export function showOnboarding({ onComplete }) {
  const root = document.getElementById('app-root') || document.body;

  if (!document.getElementById('onboarding-style')) {
    const style = document.createElement('style');
    style.id = 'onboarding-style';
    style.textContent = `
      @keyframes onbIn  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      @keyframes onbOut { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(-20px)} }
      #onboarding-overlay {
        position:fixed;inset:0;z-index:99999;
        background:#FFFFFF;
        display:flex;flex-direction:column;
        align-items:center;justify-content:center;
        padding:28px 20px;
        animation:onbIn 0.4s cubic-bezier(0.16,1,0.3,1) both;
      }
      #onboarding-overlay.leaving{animation:onbOut 0.3s cubic-bezier(0.4,0,1,1) both;pointer-events:none;}
      .onb-inner{width:100%;max-width:360px;display:flex;flex-direction:column;align-items:center;}
      .onb-step{display:none;flex-direction:column;align-items:center;width:100%;}
      .onb-step.active{display:flex;animation:onbIn 0.25s ease both;}
      .onb-input,.onb-select{
        width:100%;padding:13px 16px;
        font-size:0.97rem;font-weight:600;
        border:2px solid rgba(15,23,42,0.10);
        border-radius:14px;outline:none;
        background:#F8FAFC;color:#0F172A;
        transition:border-color 0.18s;
        box-sizing:border-box;font-family:inherit;
        -webkit-appearance:none;appearance:none;
      }
      .onb-select{
        cursor:pointer;
        background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
        background-repeat:no-repeat;
        background-position:right 14px center;
        padding-right:42px;
      }
      .onb-input:focus,.onb-select:focus{border-color:#0F172A;background:#FFF;}
      .onb-btn-primary{
        width:100%;padding:14px;
        font-size:0.98rem;font-weight:800;
        background:#0F172A;color:#FFFFFF;
        border:none;border-radius:14px;
        cursor:pointer;transition:opacity 0.18s,transform 0.12s;
        font-family:inherit;letter-spacing:-0.2px;
      }
      .onb-btn-primary:active{transform:scale(0.98);opacity:0.9;}
      .onb-btn-skip{
        background:none;border:none;font-family:inherit;
        color:#94A3B8;font-size:0.8rem;cursor:pointer;
        padding:10px 16px;text-decoration:underline;text-underline-offset:3px;
      }
      .onb-btn-skip:hover{color:#64748B;}
      .onb-lang-bar{display:flex;gap:8px;margin-bottom:18px;}
      .onb-lang-chip{
        padding:5px 16px;border-radius:999px;font-weight:800;font-size:0.82rem;
        font-family:inherit;cursor:pointer;border:2px solid transparent;
        transition:all 0.18s;letter-spacing:0.04em;
      }
      .onb-lang-chip.active{background:#0F172A;color:#FFFFFF;border-color:#0F172A;}
      .onb-lang-chip:not(.active){background:#F1F5F9;color:#64748B;border-color:#E2E8F0;}
      .onb-dots{display:flex;gap:6px;margin-bottom:22px;}
      .onb-dot{width:6px;height:6px;border-radius:50%;background:#E2E8F0;transition:background 0.2s,width 0.2s;}
      .onb-dot.active{background:#0F172A;width:18px;border-radius:3px;}
    `;
    document.head.appendChild(style);
  }

  const overlay = document.createElement('div');
  overlay.id = 'onboarding-overlay';

  let currentLang = storage.getSettings()?.language || 'es';
  let currentStep = 1;
  let savedFirstName = '';
  let savedLastName  = '';
  let selectedCountry = 'Perú';
  let visitedStep2 = false;   // true when user reaches or skips step 2

  function T(key) { return (ONBOARDING_TX[currentLang] || ONBOARDING_TX.es)[key]; }

  function buildCityOptions(country) {
    const cities = getCitiesForCountry(country);
    return cities.map(c => `<option value="${c}">${c}</option>`).join('');
  }

  function buildCountryOptions() {
    return ALL_COUNTRIES.map(c =>
      `<option value="${c}"${c === selectedCountry ? ' selected' : ''}>${c}</option>`
    ).join('');
  }

  function render() {
    overlay.innerHTML = `
      <div class="onb-inner">
        <!-- Language chips -->
        <div class="onb-lang-bar">
          <button class="onb-lang-chip${currentLang === 'es' ? ' active' : ''}" id="onb-lang-es">ES</button>
          <button class="onb-lang-chip${currentLang === 'en' ? ' active' : ''}" id="onb-lang-en">EN</button>
        </div>

        <!-- Logo -->
        <div style="margin-bottom:26px;text-align:center;">
          <img src="/icon.svg" style="width:52px;height:52px;margin-bottom:8px;display:block;margin-left:auto;margin-right:auto;" alt="VALO OS"/>
          <div style="font-weight:800;font-size:1.28rem;letter-spacing:-0.5px;color:#0F172A;">VALO OS</div>
          <div style="font-size:0.70rem;color:#94A3B8;margin-top:3px;letter-spacing:0.06em;text-transform:uppercase;">${T('logo_sub')}</div>
        </div>

        <!-- Progress dots -->
        <div class="onb-dots">
          <div class="onb-dot${currentStep===1?' active':''}" id="dot-1"></div>
          <div class="onb-dot${currentStep===2?' active':''}" id="dot-2"></div>
          <div class="onb-dot${currentStep===3?' active':''}" id="dot-3"></div>
        </div>

        <!-- Step 1: Name -->
        <div class="onb-step${currentStep===1?' active':''}" id="onb-step-1">
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:1.9rem;margin-bottom:7px;">${T('step1_emoji')}</div>
            <h2 style="font-size:1.2rem;font-weight:800;color:#0F172A;margin:0;">${T('step1_title')}</h2>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;width:100%;">
            <input class="onb-input" id="onb-first-name" type="text" value="${savedFirstName}" placeholder="${T('step1_ph1')}" autocomplete="given-name"/>
            <input class="onb-input" id="onb-last-name"  type="text" value="${savedLastName}"  placeholder="${T('step1_ph2')}" autocomplete="family-name"/>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;width:100%;margin-top:15px;gap:2px;">
            <button class="onb-btn-primary" id="onb-btn-1">${T('step1_btn')}</button>
            <button class="onb-btn-skip"    id="onb-skip-1">${T('step1_skip')}</button>
          </div>
        </div>

        <!-- Step 2: Location -->
        <div class="onb-step${currentStep===2?' active':''}" id="onb-step-2">
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:1.9rem;margin-bottom:7px;">${T('step2_emoji')}</div>
            <h2 style="font-size:1.2rem;font-weight:800;color:#0F172A;margin:0;">${T('step2_title')}</h2>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;width:100%;">
            <div>
              <label style="font-size:0.70rem;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.06em;display:block;margin-bottom:5px;">${T('step2_country_lbl')}</label>
              <select class="onb-select" id="onb-country">${buildCountryOptions()}</select>
            </div>
            <div>
              <label style="font-size:0.70rem;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.06em;display:block;margin-bottom:5px;">${T('step2_city_lbl')}</label>
              <select class="onb-select" id="onb-city">${buildCityOptions(selectedCountry)}</select>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;width:100%;margin-top:15px;gap:2px;">
            <button class="onb-btn-primary" id="onb-btn-2">${T('step2_btn')}</button>
            <button class="onb-btn-skip"    id="onb-skip-2">${T('step2_skip')}</button>
          </div>
        </div>

        <!-- Step 3: Done -->
        <div class="onb-step${currentStep===3?' active':''}" id="onb-step-3">
          <div style="text-align:center;margin-bottom:26px;">
            <div style="font-size:2.8rem;margin-bottom:10px;">${T('step3_emoji')}</div>
            <h2 style="font-size:1.28rem;font-weight:800;color:#0F172A;margin:0 0 8px;" id="onb-welcome-name">${T('step3_base')}${T('step3_end')}</h2>
            <p style="font-size:0.82rem;color:#64748B;margin:0;line-height:1.5;">${T('step3_sub')}</p>
          </div>
          <button class="onb-btn-primary" id="onb-btn-3">${T('step3_btn')}</button>
        </div>

      </div>
    `;
    bindEvents();
  }

  function bindEvents() {
    // Language chips
    overlay.querySelector('#onb-lang-es')?.addEventListener('click', () => {
      currentLang = 'es'; setLanguage('es'); render();
    });
    overlay.querySelector('#onb-lang-en')?.addEventListener('click', () => {
      currentLang = 'en'; setLanguage('en'); render();
    });

    // Step 1
    overlay.querySelector('#onb-btn-1')?.addEventListener('click', () => {
      savedFirstName = overlay.querySelector('#onb-first-name')?.value.trim() || '';
      savedLastName  = overlay.querySelector('#onb-last-name')?.value.trim() || '';
      visitedStep2 = true;
      currentStep = 2; render();
    });
    overlay.querySelector('#onb-skip-1')?.addEventListener('click', () => finish('',''));

    // Step 2 — Country changes cities dynamically
    overlay.querySelector('#onb-country')?.addEventListener('change', (e) => {
      selectedCountry = e.target.value;

      // Auto-detect language
      const langForCountry = SPANISH_SPEAKING_COUNTRIES.has(selectedCountry) ? 'es' : 'en';
      if (langForCountry !== currentLang) {
        currentLang = langForCountry;
        setLanguage(currentLang);
      }

      // Update city dropdown without full re-render (faster UX)
      const citySelect = overlay.querySelector('#onb-city');
      if (citySelect) {
        citySelect.innerHTML = buildCityOptions(selectedCountry);
      }

      // Re-render lang chips if language changed
      const esChip = overlay.querySelector('#onb-lang-es');
      const enChip = overlay.querySelector('#onb-lang-en');
      if (esChip) esChip.classList.toggle('active', currentLang === 'es');
      if (enChip) enChip.classList.toggle('active', currentLang === 'en');
    });

    overlay.querySelector('#onb-btn-2')?.addEventListener('click', () => {
      const country = overlay.querySelector('#onb-country')?.value || selectedCountry;
      const city    = overlay.querySelector('#onb-city')?.value || '';

      // ✅ ALWAYS apply language based on the final chosen country
      const finalLang = SPANISH_SPEAKING_COUNTRIES.has(country) ? 'es' : 'en';
      currentLang = finalLang;
      setLanguage(finalLang);
      selectedCountry = country;
      visitedStep2 = true;

      storage.updateSettings({ userCity: city, userCountry: country });

      const namePart = savedFirstName ? `, ${savedFirstName}` : '';
      const welcomeEl = overlay.querySelector('#onb-welcome-name');
      if (welcomeEl) welcomeEl.textContent = `${T('step3_base')}${namePart}${T('step3_end')}`;

      currentStep = 3; render();
    });

    overlay.querySelector('#onb-skip-2')?.addEventListener('click', () => {
      // Even on skip, apply language based on whatever country is currently shown
      const country = overlay.querySelector('#onb-country')?.value || selectedCountry;
      const finalLang = SPANISH_SPEAKING_COUNTRIES.has(country) ? 'es' : 'en';
      currentLang = finalLang;
      setLanguage(finalLang);
      visitedStep2 = true;

      const namePart = savedFirstName ? `, ${savedFirstName}` : '';
      const welcomeEl = overlay.querySelector('#onb-welcome-name');
      if (welcomeEl) welcomeEl.textContent = `${T('step3_base')}${namePart}${T('step3_end')}`;
      currentStep = 3; render();
    });

    // Step 3
    overlay.querySelector('#onb-btn-3')?.addEventListener('click', () => finish(savedFirstName, savedLastName));
  }

  function finish(firstName, lastName) {
    // ✅ Final language lock — if user went through step 2, country drives the language.
    // If they skipped step 2 entirely, the manual chip selection stays.
    if (visitedStep2) {
      const finalLang = SPANISH_SPEAKING_COUNTRIES.has(selectedCountry) ? 'es' : 'en';
      setLanguage(finalLang);
    }

    if (firstName || lastName) {
      const fullName = [firstName, lastName].filter(Boolean).join(' ');
      storage.updateSettings({ userName: fullName, userFirstName: firstName, userLastName: lastName });
    }
    markOnboardingDone();
    overlay.classList.add('leaving');
    overlay.addEventListener('animationend', () => { overlay.remove(); onComplete?.(); }, { once: true });
  }


  root.prepend(overlay);
  render();
}
