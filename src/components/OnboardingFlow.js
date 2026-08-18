/* ==========================================================================
   VALO OS - ONBOARDING FLOW v4
   - Geolocation detection on first open (non-blocking, background)
   - navigator.language for instant language hint while geo loads
   - Auto-language from country selected (country always wins on step 2)
   - Dynamic cities per country, language chips ES/EN
   ========================================================================== */

import { storage } from '../services/storage.js';
import { setLanguage } from '../services/i18n.js';
import { ALL_COUNTRIES, getCitiesForCountry } from '../services/citiesData.js';
import { biometrics } from '../services/biometrics.js';

const ONBOARDING_KEY = 'valo_onboarding_done_v1';

export function isOnboardingDone() {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
}
export function markOnboardingDone() {
  localStorage.setItem(ONBOARDING_KEY, 'true');
}

/* ── Constants ─────────────────────────────────────────────────────────── */
const SPANISH_CODES = new Set([
  'pe','mx','es','co','ar','ve','cl','ec','gt','cu','bo','do',
  'hn','py','sv','ni','cr','pa','uy','gq','bz','pr'
]);

const SPANISH_SPEAKING_COUNTRIES = new Set([
  'Perú','México','España','Colombia','Argentina','Venezuela','Chile','Ecuador',
  'Guatemala','Cuba','Bolivia','República Dominicana','Honduras','Paraguay',
  'El Salvador','Nicaragua','Costa Rica','Panamá','Uruguay','Guinea Ecuatorial',
  'Puerto Rico','Belize'
]);

// Map ISO country code → name in our countries list
const CODE_TO_COUNTRY = {
  pe:'Perú', mx:'México', es:'España', co:'Colombia', ar:'Argentina',
  ve:'Venezuela', cl:'Chile', ec:'Ecuador', gt:'Guatemala', cu:'Cuba',
  bo:'Bolivia', do:'República Dominicana', hn:'Honduras', py:'Paraguay',
  sv:'El Salvador', ni:'Nicaragua', cr:'Costa Rica', pa:'Panamá',
  uy:'Uruguay', gq:'Guinea Ecuatorial', pr:'Puerto Rico', bz:'Belize',
  us:'United States', gb:'United Kingdom', ca:'Canada', au:'Australia',
  nz:'New Zealand', de:'Germany', fr:'France', it:'Italy', pt:'Portugal',
  nl:'Netherlands', be:'Belgium', ch:'Switzerland', at:'Austria',
  se:'Sweden', no:'Norway', dk:'Denmark', fi:'Finland', pl:'Poland',
  cz:'Czech Republic', hu:'Hungary', ro:'Romania', gr:'Greece',
  tr:'Turkey', ru:'Russia', ua:'Ukraine', il:'Israel',
  sa:'Saudi Arabia', ae:'United Arab Emirates', qa:'Qatar', kw:'Kuwait',
  bh:'Bahrain', om:'Oman', jo:'Jordan', eg:'Egypt', ma:'Morocco',
  tn:'Tunisia', dz:'Algeria', za:'South Africa', ng:'Nigeria', ke:'Kenya',
  gh:'Ghana', et:'Ethiopia', tz:'Tanzania', ug:'Uganda', cm:'Cameroon',
  sn:'Senegal', ci:'Ivory Coast', in:'India', pk:'Pakistan', bd:'Bangladesh',
  lk:'Sri Lanka', np:'Nepal', cn:'China', jp:'Japan', kr:'South Korea',
  id:'Indonesia', ph:'Philippines', vn:'Vietnam', th:'Thailand',
  my:'Malaysia', sg:'Singapore', mm:'Myanmar', kh:'Cambodia', la:'Laos',
  tw:'Taiwan', hk:'Hong Kong', mn:'Mongolia', br:'Brazil', gy:'Guyana',
  sr:'Suriname', tt:'Trinidad and Tobago', jm:'Jamaica', ht:'Haiti',
  bb:'Barbados', bs:'Bahamas', af:'Afghanistan', ir:'Iran', iq:'Iraq',
  sy:'Syria', lb:'Lebanon', ly:'Libya', sd:'Sudan', so:'Somalia',
  az:'Azerbaijan', kz:'Kazakhstan', uz:'Uzbekistan', ge:'Georgia',
  am:'Armenia', by:'Belarus', md:'Moldova', rs:'Serbia', hr:'Croatia',
  si:'Slovenia', ba:'Bosnia and Herzegovina', al:'Albania', mk:'North Macedonia',
  xk:'Kosovo', me:'Montenegro', bg:'Bulgaria', lv:'Latvia', lt:'Lithuania',
  ee:'Estonia', is:'Iceland', ie:'Ireland', lu:'Luxembourg', mt:'Malta',
  cy:'Cyprus', sk:'Slovakia', mz:'Mozambique', ao:'Angola', zm:'Zambia',
  zw:'Zimbabwe', bw:'Botswana', na:'Namibia', rw:'Rwanda',
  cd:'Democratic Republic of the Congo', cg:'Congo', ga:'Gabon',
  mg:'Madagascar', ml:'Mali', ne:'Niger', td:'Chad', cf:'Central African Republic',
  bf:'Burkina Faso', pg:'Papua New Guinea', fj:'Fiji', ws:'Samoa',
  to:'Tonga', vu:'Vanuatu', gf:'French Guiana'
};

const ONBOARDING_TX = {
  es: {
    logo_sub: 'Tu espacio financiero personal',
    detecting: 'Detectando tu ubicación…',
    detected: '📍 Detectado:',
    step1_emoji: '👋', step1_title: '¿Cómo te llamas?',
    step1_ph1: 'Primer nombre  (ej: Julio)',
    step1_ph2: 'Apellidos  (ej: Hidalgo Palacios)',
    step1_btn: 'Continuar →', step1_skip: 'Saltar',
    step2_emoji: '📍', step2_title: '¿Dónde estás?',
    step2_city_lbl: 'Ciudad', step2_country_lbl: 'País',
    step2_btn: 'Continuar →', step2_skip: 'Saltar',
    step3_emoji: '✨', step3_base: '¡Todo listo',
    step3_end: '!', step3_sub: 'Tu espacio financiero está listo.',
    step3_btn: 'Entrar a VALO OS →',
  },
  en: {
    logo_sub: 'Your personal financial space',
    detecting: 'Detecting your location…',
    detected: '📍 Detected:',
    step1_emoji: '👋', step1_title: "What's your name?",
    step1_ph1: 'First name  (e.g. John)',
    step1_ph2: 'Last name  (e.g. Smith)',
    step1_btn: 'Continue →', step1_skip: 'Skip',
    step2_emoji: '📍', step2_title: 'Where are you located?',
    step2_city_lbl: 'City', step2_country_lbl: 'Country',
    step2_btn: 'Continue →', step2_skip: 'Skip',
    step3_emoji: '✨', step3_base: "You're all set",
    step3_end: '!', step3_sub: 'Your financial space is ready.',
    step3_btn: 'Enter VALO OS →',
  }
};

/* ── Geo detection (non-blocking) ──────────────────────────────────────── */
async function detectLocation() {
  // 1. Instant hint from browser language (no permission needed)
  const browserLang = navigator.language?.toLowerCase() || 'es';
  const instantLang = browserLang.startsWith('es') ? 'es' : 'en';

  // 2. Try geolocation → Nominatim reverse geocode
  if (!navigator.geolocation) return { lang: instantLang, country: null, city: null };

  return new Promise((resolve) => {
    // Timeout after 6s so we don't hang
    const timer = setTimeout(() => resolve({ lang: instantLang, country: null, city: null }), 6000);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        clearTimeout(timer);
        try {
          const { latitude: lat, longitude: lon } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
            { headers: { 'Accept-Language': 'en', 'User-Agent': 'VALO-OS-App/1.0' } }
          );
          const data = await res.json();
          const code    = (data?.address?.country_code || '').toLowerCase();
          const country = CODE_TO_COUNTRY[code] || null;
          const lang    = SPANISH_CODES.has(code) ? 'es' : 'en';

          // Try to match detected city against our cities list
          const rawCity = data?.address?.city
            || data?.address?.town
            || data?.address?.village
            || data?.address?.county
            || null;

          let matchedCity = null;
          if (rawCity && country) {
            const cityList = getCitiesForCountry(country);
            matchedCity = cityList.find(c =>
              c.toLowerCase().includes(rawCity.toLowerCase()) ||
              rawCity.toLowerCase().includes(c.toLowerCase())
            ) || null;
          }

          resolve({ lang, country, city: matchedCity });
        } catch {
          resolve({ lang: instantLang, country: null, city: null });
        }
      },
      () => { clearTimeout(timer); resolve({ lang: instantLang, country: null, city: null }); },
      { timeout: 5000, maximumAge: 300000 }
    );
  });
}

/* ── Main export ───────────────────────────────────────────────────────── */
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
        background-repeat:no-repeat;background-position:right 14px center;padding-right:42px;
      }
      .onb-input:focus,.onb-select:focus{border-color:#0F172A;background:#FFF;}
      .onb-btn-primary{
        width:100%;padding:14px;font-size:0.98rem;font-weight:800;
        background:#0F172A;color:#FFFFFF;border:none;border-radius:14px;
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
      .onb-geo-badge{
        display:flex;align-items:center;gap:5px;
        font-size:0.7rem;color:#64748B;font-weight:600;
        background:#F1F5F9;border-radius:999px;padding:4px 10px;
        margin-bottom:16px;min-height:24px;
        transition:all 0.3s;
      }
      .onb-geo-dot{
        width:6px;height:6px;border-radius:50%;background:#94A3B8;
        animation:geoPulse 1.2s ease-in-out infinite;
        flex-shrink:0;
      }
      .onb-geo-dot.found{background:#10B981;animation:none;}
      @keyframes geoPulse{0%,100%{opacity:0.4}50%{opacity:1}}
    `;
    document.head.appendChild(style);
  }

  const overlay = document.createElement('div');
  overlay.id = 'onboarding-overlay';

  // ── State ──────────────────────────────────────────────────────────────
  // Instant browser-language hint while we wait for geo
  const browserLang = navigator.language?.toLowerCase() || 'es';
  let currentLang    = browserLang.startsWith('es') ? 'es' : 'en';
  let currentStep    = 1;
  let savedFirstName = '';
  let savedLastName  = '';
  let selectedCountry = currentLang === 'es' ? 'Perú' : 'United States';
  let selectedCity    = '';
  let visitedStep2    = false;
  let geoResolved     = false;
  let biometricsAvailable = false;

  biometrics.isAvailable().then(a => {
    biometricsAvailable = a;
    if (currentStep === 3) render(); // Update if already on step 3
  });

  function T(key) { return (ONBOARDING_TX[currentLang] || ONBOARDING_TX.es)[key]; }

  function buildCityOptions(country, preferred = '') {
    const cities = getCitiesForCountry(country);
    return cities.map(c =>
      `<option value="${c}"${c === preferred || (c === cities[0] && !preferred) ? ' selected' : ''}>${c}</option>`
    ).join('');
  }

  function buildCountryOptions() {
    return ALL_COUNTRIES.map(c =>
      `<option value="${c}"${c === selectedCountry ? ' selected' : ''}>${c}</option>`
    ).join('');
  }

  // ── Render ─────────────────────────────────────────────────────────────
  function render() {
    overlay.innerHTML = `
      <div class="onb-inner">
        <div class="onb-lang-bar">
          <button class="onb-lang-chip${currentLang==='es'?' active':''}" id="onb-lang-es">ES</button>
          <button class="onb-lang-chip${currentLang==='en'?' active':''}" id="onb-lang-en">EN</button>
        </div>

        <div style="margin-bottom:20px;text-align:center;">
          <img src="/icon.svg" style="width:50px;height:50px;margin-bottom:7px;display:block;margin-left:auto;margin-right:auto;" alt="VALO OS"/>
          <div style="font-weight:800;font-size:1.25rem;letter-spacing:-0.5px;color:#0F172A;">VALO OS</div>
          <div style="font-size:0.68rem;color:#94A3B8;margin-top:3px;letter-spacing:0.06em;text-transform:uppercase;">${T('logo_sub')}</div>
        </div>

        <!-- Geo detection badge -->
        <div class="onb-geo-badge" id="onb-geo-badge">
          <span class="onb-geo-dot${geoResolved?' found':''}" id="geo-dot"></span>
          <span id="geo-label">${geoResolved
            ? (selectedCountry ? `${T('detected')} ${selectedCity ? selectedCity + ', ' : ''}${selectedCountry}` : (currentLang==='es'?'Ubicación no disponible':'Location unavailable'))
            : T('detecting')
          }</span>
        </div>

        <div class="onb-dots">
          <div class="onb-dot${currentStep===1?' active':''}"></div>
          <div class="onb-dot${currentStep===2?' active':''}"></div>
          <div class="onb-dot${currentStep===3?' active':''}"></div>
        </div>

        <!-- Step 1 -->
        <div class="onb-step${currentStep===1?' active':''}" id="onb-step-1">
          <div style="text-align:center;margin-bottom:18px;">
            <div style="font-size:1.9rem;margin-bottom:6px;">${T('step1_emoji')}</div>
            <h2 style="font-size:1.18rem;font-weight:800;color:#0F172A;margin:0;">${T('step1_title')}</h2>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;width:100%;">
            <input class="onb-input" id="onb-first-name" type="text" value="${savedFirstName}" placeholder="${T('step1_ph1')}" autocomplete="given-name"/>
            <input class="onb-input" id="onb-last-name"  type="text" value="${savedLastName}"  placeholder="${T('step1_ph2')}" autocomplete="family-name"/>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;width:100%;margin-top:14px;gap:2px;">
            <button class="onb-btn-primary" id="onb-btn-1">${T('step1_btn')}</button>
            <button class="onb-btn-skip" id="onb-skip-1">${T('step1_skip')}</button>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="onb-step${currentStep===2?' active':''}" id="onb-step-2">
          <div style="text-align:center;margin-bottom:18px;">
            <div style="font-size:1.9rem;margin-bottom:6px;">${T('step2_emoji')}</div>
            <h2 style="font-size:1.18rem;font-weight:800;color:#0F172A;margin:0;">${T('step2_title')}</h2>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;width:100%;">
            <div>
              <label style="font-size:0.68rem;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.06em;display:block;margin-bottom:4px;">${T('step2_country_lbl')}</label>
              <select class="onb-select" id="onb-country">${buildCountryOptions()}</select>
            </div>
            <div>
              <label style="font-size:0.68rem;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.06em;display:block;margin-bottom:4px;">${T('step2_city_lbl')}</label>
              <select class="onb-select" id="onb-city">${buildCityOptions(selectedCountry, selectedCity)}</select>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;width:100%;margin-top:14px;gap:2px;">
            <button class="onb-btn-primary" id="onb-btn-2">${T('step2_btn')}</button>
            <button class="onb-btn-skip" id="onb-skip-2">${T('step2_skip')}</button>
          </div>
        </div>

        <!-- Step 3 (Security) -->
        <div class="onb-step${currentStep===3?' active':''}" id="onb-step-3">
          <div style="text-align:center;margin-bottom:18px;">
            <div style="font-size:1.9rem;margin-bottom:6px;">🔒</div>
            <h2 style="font-size:1.18rem;font-weight:800;color:#0F172A;margin:0;">${currentLang === 'es' ? 'Seguridad de tu App' : 'App Security'}</h2>
            <p style="font-size:0.75rem;color:#64748B;margin-top:6px;">${currentLang === 'es' ? 'Ingresa un PIN de 4 dígitos para proteger tu información.' : 'Enter a 4-digit PIN to secure your data.'}</p>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;width:100%;">
            <input class="onb-input" id="onb-pin-code" type="password" maxlength="4" pattern="[0-9]{4}" inputmode="numeric" placeholder="1234" style="letter-spacing:6px; font-weight:800; text-align:center; font-size:1.4rem;" autocomplete="off" />
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;width:100%;margin-top:14px;gap:2px;">
            <button class="onb-btn-primary" id="onb-btn-3">${currentLang === 'es' ? 'Guardar PIN →' : 'Save PIN →'}</button>
            <button class="onb-btn-skip" id="onb-skip-3">${T('step1_skip')}</button>
          </div>
        </div>

        <!-- Step 4 -->
        <div class="onb-step${currentStep===4?' active':''}" id="onb-step-4">
          <div style="text-align:center;margin-bottom:24px;">
            <div style="font-size:2.8rem;margin-bottom:10px;">${T('step3_emoji')}</div>
            <h2 style="font-size:1.25rem;font-weight:800;color:#0F172A;margin:0 0 8px;" id="onb-welcome-name">${T('step3_base')}${T('step3_end')}</h2>
            <p style="font-size:0.82rem;color:#64748B;margin:0;line-height:1.5;">${T('step3_sub')}</p>
          </div>
          <button class="onb-btn-primary" id="onb-btn-4">${T('step3_btn')}</button>
        </div>
      </div>
    `;
    bindEvents();
  }

  // ── Helper for Validation ──────────────────────────────────────────────
  function showError(inputEl, msg) {
    if (!inputEl) return;
    inputEl.setCustomValidity(msg);
    inputEl.reportValidity();
    inputEl.addEventListener('input', () => inputEl.setCustomValidity(''), { once: true });
  }

  // ── Bind events ────────────────────────────────────────────────────────
  function bindEvents() {
    overlay.querySelector('#onb-lang-es')?.addEventListener('click', () => {
      currentLang = 'es'; setLanguage('es'); render();
    });
    overlay.querySelector('#onb-lang-en')?.addEventListener('click', () => {
      currentLang = 'en'; setLanguage('en'); render();
    });

    overlay.querySelector('#onb-btn-1')?.addEventListener('click', () => {
      const firstInput = overlay.querySelector('#onb-first-name');
      const lastInput  = overlay.querySelector('#onb-last-name');
      const first = firstInput?.value.trim() || '';
      const last  = lastInput?.value.trim() || '';
      
      const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
      
      if (!first) {
        showError(firstInput, currentLang === 'es' ? 'El nombre es obligatorio.' : 'First name is required.');
        return;
      }
      if (!nameRegex.test(first)) {
        showError(firstInput, currentLang === 'es' ? 'Solo se permiten letras.' : 'Only letters are allowed.');
        return;
      }
      if (last && !nameRegex.test(last)) {
        showError(lastInput, currentLang === 'es' ? 'Solo se permiten letras.' : 'Only letters are allowed.');
        return;
      }

      savedFirstName = first;
      savedLastName  = last;
      visitedStep2 = true; currentStep = 2; render();
    });

    overlay.querySelector('#onb-skip-1')?.addEventListener('click', () => {
      savedFirstName = ''; savedLastName = '';
      visitedStep2 = true; currentStep = 2; render();
    });

    overlay.querySelector('#onb-country')?.addEventListener('change', (e) => {
      selectedCountry = e.target.value;
      selectedCity    = '';
      const lang = SPANISH_SPEAKING_COUNTRIES.has(selectedCountry) ? 'es' : 'en';
      if (lang !== currentLang) { currentLang = lang; setLanguage(lang); }
      const citySelect = overlay.querySelector('#onb-city');
      if (citySelect) citySelect.innerHTML = buildCityOptions(selectedCountry, '');
      const esChip = overlay.querySelector('#onb-lang-es');
      const enChip = overlay.querySelector('#onb-lang-en');
      if (esChip) esChip.classList.toggle('active', currentLang === 'es');
      if (enChip) enChip.classList.toggle('active', currentLang === 'en');
    });

    overlay.querySelector('#onb-btn-2')?.addEventListener('click', () => {
      const countryInput = overlay.querySelector('#onb-country');
      const cityInput    = overlay.querySelector('#onb-city');
      const country = countryInput?.value || selectedCountry;
      const city    = cityInput?.value || '';

      if (!country) {
        showError(countryInput, currentLang === 'es' ? 'Selecciona un país.' : 'Select a country.');
        return;
      }

      const lang = SPANISH_SPEAKING_COUNTRIES.has(country) ? 'es' : 'en';
      currentLang = lang; setLanguage(lang); selectedCountry = country; visitedStep2 = true;
      storage.updateSettings({ userCity: city, userCountry: country });
      currentStep = 3; render();
    });

    overlay.querySelector('#onb-skip-2')?.addEventListener('click', () => {
      const country = overlay.querySelector('#onb-country')?.value || selectedCountry;
      const lang = SPANISH_SPEAKING_COUNTRIES.has(country) ? 'es' : 'en';
      currentLang = lang; setLanguage(lang); visitedStep2 = true;
      currentStep = 3; render();
    });

    overlay.querySelector('#onb-btn-3')?.addEventListener('click', () => {
      const pinInput = overlay.querySelector('#onb-pin-code');
      const pinCode = pinInput?.value.trim();
      
      if (!pinCode || pinCode.length !== 4) {
        showError(pinInput, currentLang === 'es' ? 'Ingresa un PIN de 4 dígitos.' : 'Enter a 4-digit PIN.');
        return;
      }
      
      storage.updateSettings({ securityPinEnabled: true, securityPin: pinCode });
      
      if (biometricsAvailable) {
        // Auto-prompt biometrics
        biometrics.register().then(() => {
          proceedToWelcome();
        }).catch(() => {
          proceedToWelcome(); // Proceed even if they cancel
        });
      } else {
        proceedToWelcome();
      }
    });
    
    function proceedToWelcome() {
      const namePart = savedFirstName ? `, ${savedFirstName}` : '';
      const w = overlay.querySelector('#onb-welcome-name');
      if (w) w.textContent = `${T('step3_base')}${namePart}${T('step3_end')}`;
      currentStep = 4; render();
    }

    overlay.querySelector('#onb-skip-3')?.addEventListener('click', proceedToWelcome);

    overlay.querySelector('#onb-btn-4')?.addEventListener('click', () => finish(savedFirstName, savedLastName));
  }

  // ── Geo update (called after geo resolves, only if still on step 1) ───
  function applyGeoResult({ lang, country, city }) {
    geoResolved = true;
    if (country) {
      selectedCountry = country;
      selectedCity    = city || '';
    }
    // Only update language if user hasn't manually changed chips AND hasn't visited step 2
    if (!visitedStep2) {
      currentLang = lang;
      setLanguage(lang);
    }

    if (currentStep === 1) {
      // Re-render to update geo badge and language text — non-disruptive
      render();
    } else {
      // Just update the geo badge without re-rendering the whole screen
      const badge = overlay.querySelector('#onb-geo-badge');
      const dot   = overlay.querySelector('#geo-dot');
      const label = overlay.querySelector('#geo-label');
      if (dot)   dot.classList.add('found');
      if (label) label.textContent = country
        ? `${T('detected')} ${city ? city + ', ' : ''}${country}`
        : (lang === 'es' ? 'Ubicación no disponible' : 'Location unavailable');
    }
  }

  // ── Finish ─────────────────────────────────────────────────────────────
  function finish(firstName, lastName) {
    if (visitedStep2) {
      setLanguage(SPANISH_SPEAKING_COUNTRIES.has(selectedCountry) ? 'es' : 'en');
    }
    if (firstName || lastName) {
      const fullName = [firstName, lastName].filter(Boolean).join(' ');
      storage.updateSettings({ userName: fullName, userFirstName: firstName, userLastName: lastName });
    }
    markOnboardingDone();
    overlay.classList.add('leaving');
    overlay.addEventListener('animationend', () => { overlay.remove(); onComplete?.(); }, { once: true });
  }

  // ── Boot ───────────────────────────────────────────────────────────────
  root.prepend(overlay);
  render();

  // Start geo detection in background — doesn't block the UI
  detectLocation().then(applyGeoResult).catch(() => {
    geoResolved = true;
    // Silently fail — badge updates but no crash
    const dot = overlay.querySelector('#geo-dot');
    const label = overlay.querySelector('#geo-label');
    if (dot) dot.classList.add('found');
    if (label) label.textContent = currentLang === 'es' ? 'Ubicación no disponible' : 'Location unavailable';
  });
}
