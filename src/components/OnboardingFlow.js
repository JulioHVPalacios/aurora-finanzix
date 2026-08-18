/* ==========================================================================
   VALO OS - ONBOARDING FLOW
   First-launch profile setup. Shown once before the main app loads.
   All fields optional — skip at any step to enter the app immediately.
   ========================================================================== */

import { storage } from '../services/storage.js';

const ONBOARDING_KEY = 'valo_onboarding_done_v1';

export function isOnboardingDone() {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
}

export function markOnboardingDone() {
  localStorage.setItem(ONBOARDING_KEY, 'true');
}

export function showOnboarding({ onComplete }) {
  const root = document.getElementById('app-root') || document.body;

  // Inject animation styles once
  if (!document.getElementById('onboarding-style')) {
    const style = document.createElement('style');
    style.id = 'onboarding-style';
    style.textContent = `
      @keyframes onbFadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes onbFadeOut {
        from { opacity: 1; transform: translateY(0); }
        to   { opacity: 0; transform: translateY(-28px); }
      }
      #onboarding-overlay {
        position: fixed; inset: 0; z-index: 99999;
        background: #FFFFFF;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        padding: 32px 24px;
        animation: onbFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
      }
      #onboarding-overlay.leaving {
        animation: onbFadeOut 0.32s cubic-bezier(0.4, 0, 1, 1) both;
        pointer-events: none;
      }
      .onb-inner { width: 100%; max-width: 360px; display: flex; flex-direction: column; align-items: center; }
      .onb-step  { display: none; flex-direction: column; align-items: center; width: 100%; }
      .onb-step.active { display: flex; animation: onbFadeIn 0.3s ease both; }
      .onb-input {
        width: 100%; padding: 14px 16px;
        font-size: 1rem; font-weight: 600;
        border: 2px solid rgba(15, 23, 42, 0.10);
        border-radius: 14px; outline: none;
        background: #F8FAFC; color: #0F172A;
        transition: border-color 0.18s;
        box-sizing: border-box; font-family: inherit;
        margin: 0;
      }
      .onb-input:focus { border-color: #0F172A; background: #FFF; }
      .onb-btn-primary {
        width: 100%; padding: 15px;
        font-size: 1rem; font-weight: 800;
        background: #0F172A; color: #FFFFFF;
        border: none; border-radius: 14px;
        cursor: pointer; transition: opacity 0.18s, transform 0.12s;
        font-family: inherit; letter-spacing: -0.2px;
      }
      .onb-btn-primary:active { transform: scale(0.98); opacity: 0.9; }
      .onb-btn-skip {
        background: none; border: none; font-family: inherit;
        color: #94A3B8; font-size: 0.82rem; cursor: pointer;
        padding: 10px 16px; text-decoration: underline;
        text-underline-offset: 3px;
      }
      .onb-btn-skip:hover { color: #64748B; }
    `;
    document.head.appendChild(style);
  }

  const overlay = document.createElement('div');
  overlay.id = 'onboarding-overlay';

  overlay.innerHTML = `
    <div class="onb-inner">

      <!-- Logo Header -->
      <div style="margin-bottom: 36px; text-align: center;">
        <img src="/icon.svg" style="width: 56px; height: 56px; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto;" alt="VALO OS" />
        <div style="font-weight: 800; font-size: 1.35rem; letter-spacing: -0.5px; color: #0F172A;">VALO OS</div>
        <div style="font-size: 0.72rem; color: #94A3B8; margin-top: 3px; letter-spacing: 0.06em; text-transform: uppercase;">Tu espacio financiero personal</div>
      </div>

      <!-- Step 1: Name -->
      <div class="onb-step active" id="onb-step-1">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="font-size: 2rem; margin-bottom: 10px;">👋</div>
          <h2 style="font-size: 1.25rem; font-weight: 800; color: #0F172A; margin: 0 0 0px;">¿Cómo te llamas?</h2>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
          <input class="onb-input" id="onb-first-name" type="text" placeholder="Primer nombre  (ej: Julio)" autocomplete="given-name" />
          <input class="onb-input" id="onb-last-name" type="text" placeholder="Apellidos  (ej: Hidalgo Palacios)" autocomplete="family-name" />
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; width: 100%; margin-top: 18px; gap: 2px;">
          <button class="onb-btn-primary" id="onb-btn-1">Continuar →</button>
          <button class="onb-btn-skip" id="onb-skip-1">Saltar</button>
        </div>
      </div>

      <!-- Step 2: Location -->
      <div class="onb-step" id="onb-step-2">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="font-size: 2rem; margin-bottom: 10px;">📍</div>
          <h2 style="font-size: 1.25rem; font-weight: 800; color: #0F172A; margin: 0;">¿Dónde estás?</h2>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
          <input class="onb-input" id="onb-city" type="text" placeholder="Ciudad  (ej: Lima)" value="Lima" />
          <input class="onb-input" id="onb-country" type="text" placeholder="País  (ej: Perú)" value="Perú" />
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; width: 100%; margin-top: 18px; gap: 2px;">
          <button class="onb-btn-primary" id="onb-btn-2">Continuar →</button>
          <button class="onb-btn-skip" id="onb-skip-2">Saltar</button>
        </div>
      </div>

      <!-- Step 3: All done -->
      <div class="onb-step" id="onb-step-3">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="font-size: 3rem; margin-bottom: 12px;">✨</div>
          <h2 style="font-size: 1.35rem; font-weight: 800; color: #0F172A; margin: 0 0 8px;" id="onb-welcome-name">¡Todo listo!</h2>
          <p style="font-size: 0.84rem; color: #64748B; margin: 0; line-height: 1.5;">Tu espacio financiero está listo.</p>
        </div>
        <button class="onb-btn-primary" id="onb-btn-3">Entrar a VALO OS →</button>
      </div>

    </div>
  `;

  root.prepend(overlay);

  let savedFirstName = '';
  let savedLastName = '';

  /* ── Step 1 ─────────────────────────────────────────────────── */
  overlay.querySelector('#onb-btn-1').addEventListener('click', () => {
    savedFirstName = overlay.querySelector('#onb-first-name').value.trim();
    savedLastName  = overlay.querySelector('#onb-last-name').value.trim();
    goToStep(2);
  });

  overlay.querySelector('#onb-skip-1').addEventListener('click', () => {
    // Skip directly to app — no need for location step
    finish('', '');
  });

  /* ── Step 2 ─────────────────────────────────────────────────── */
  overlay.querySelector('#onb-btn-2').addEventListener('click', () => {
    const city    = overlay.querySelector('#onb-city').value.trim() || 'Lima';
    const country = overlay.querySelector('#onb-country').value.trim() || 'Perú';
    storage.updateSettings({ userCity: city, userCountry: country });

    const namePart = savedFirstName ? `, ${savedFirstName}` : '';
    overlay.querySelector('#onb-welcome-name').textContent = `¡Todo listo${namePart}!`;
    goToStep(3);
  });

  overlay.querySelector('#onb-skip-2').addEventListener('click', () => {
    const namePart = savedFirstName ? `, ${savedFirstName}` : '';
    overlay.querySelector('#onb-welcome-name').textContent = `¡Todo listo${namePart}!`;
    goToStep(3);
  });

  /* ── Step 3 ─────────────────────────────────────────────────── */
  overlay.querySelector('#onb-btn-3').addEventListener('click', () => {
    finish(savedFirstName, savedLastName);
  });

  /* ── Helpers ─────────────────────────────────────────────────── */
  function goToStep(num) {
    overlay.querySelectorAll('.onb-step').forEach(s => s.classList.remove('active'));
    overlay.querySelector(`#onb-step-${num}`)?.classList.add('active');
  }

  function finish(firstName, lastName) {
    if (firstName || lastName) {
      const fullName = [firstName, lastName].filter(Boolean).join(' ');
      storage.updateSettings({
        userName:      fullName,
        userFirstName: firstName,
        userLastName:  lastName
      });
    }

    markOnboardingDone();

    overlay.classList.add('leaving');
    overlay.addEventListener('animationend', () => {
      overlay.remove();
      onComplete?.();
    }, { once: true });
  }
}
