/* ==========================================================================
   VALO OS - ONBOARDING FLOW
   First-launch profile setup screen, shown once before the main app loads.
   100% local, zero server, zero passwords.
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

  const overlay = document.createElement('div');
  overlay.id = 'onboarding-overlay';
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 99999;
    background: #FFFFFF;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 24px;
    animation: fadeInUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
  `;

  // Inject animation keyframes once
  if (!document.getElementById('onboarding-style')) {
    const style = document.createElement('style');
    style.id = 'onboarding-style';
    style.textContent = `
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(24px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeOutDown {
        from { opacity: 1; transform: translateY(0); }
        to   { opacity: 0; transform: translateY(-32px); }
      }
      #onboarding-overlay.leaving {
        animation: fadeOutDown 0.38s cubic-bezier(0.4, 0, 1, 1) both;
      }
      .onb-step { display: none; flex-direction: column; align-items: center; width: 100%; max-width: 380px; }
      .onb-step.active { display: flex; }
      .onb-input {
        width: 100%; padding: 14px 16px;
        font-size: 1.05rem; font-weight: 600;
        border: 2px solid rgba(15, 23, 42, 0.10);
        border-radius: 14px; outline: none;
        background: #F8FAFC; color: #0F172A;
        transition: border-color 0.2s;
        box-sizing: border-box;
        font-family: inherit;
      }
      .onb-input:focus { border-color: #0F172A; background: #FFF; }
      .onb-btn {
        width: 100%; padding: 15px;
        font-size: 1rem; font-weight: 800;
        background: #0F172A; color: #FFFFFF;
        border: none; border-radius: 14px;
        cursor: pointer; transition: opacity 0.2s, transform 0.15s;
        font-family: inherit; margin-top: 4px;
      }
      .onb-btn:active { transform: scale(0.98); }
      .onb-skip {
        background: none; border: none; font-family: inherit;
        color: #94A3B8; font-size: 0.82rem; cursor: pointer;
        text-decoration: underline; margin-top: 10px;
      }
    `;
    document.head.appendChild(style);
  }

  overlay.innerHTML = `
    <div style="width: 100%; max-width: 380px; display: flex; flex-direction: column; align-items: center;">
      <!-- Logo -->
      <div style="margin-bottom: 32px; text-align: center;">
        <img src="/icon.svg" style="width: 60px; height: 60px; margin-bottom: 12px;" alt="VALO OS" />
        <div style="font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 1.4rem; letter-spacing: -0.5px; color: #0F172A;">VALO OS</div>
        <div style="font-size: 0.75rem; color: #94A3B8; margin-top: 2px; letter-spacing: 0.05em; text-transform: uppercase;">Tu espacio financiero personal</div>
      </div>

      <!-- Step 1: Name -->
      <div class="onb-step active" id="onb-step-1">
        <div style="text-align: center; margin-bottom: 28px;">
          <div style="font-size: 1.6rem; margin-bottom: 8px;">👋</div>
          <h2 style="font-size: 1.3rem; font-weight: 800; color: #0F172A; margin: 0 0 6px;">¿Cómo te llamas?</h2>
          <p style="font-size: 0.82rem; color: #64748B; margin: 0; line-height: 1.5;">
            Solo tus iniciales se muestran en pantalla.<br/>Tus datos nunca salen de tu dispositivo.
          </p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
          <input class="onb-input" id="onb-first-name" type="text" placeholder="Tu primer nombre (ej: Julio)" autocomplete="given-name" />
          <input class="onb-input" id="onb-last-name" type="text" placeholder="Tus apellidos (ej: Hidalgo Palacios)" autocomplete="family-name" />
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; width: 100%; gap: 0; margin-top: 16px;">
          <button class="onb-btn" id="onb-btn-1">Continuar →</button>
          <button class="onb-skip" id="onb-skip-all">Saltar y entrar</button>
        </div>
      </div>

      <!-- Step 2: Location -->
      <div class="onb-step" id="onb-step-2">
        <div style="text-align: center; margin-bottom: 28px;">
          <div style="font-size: 1.6rem; margin-bottom: 8px;">📍</div>
          <h2 style="font-size: 1.3rem; font-weight: 800; color: #0F172A; margin: 0 0 6px;">¿Dónde estás?</h2>
          <p style="font-size: 0.82rem; color: #64748B; margin: 0; line-height: 1.5;">
            Esto personaliza las monedas y servicios<br/>más relevantes para tu región.
          </p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
          <input class="onb-input" id="onb-city" type="text" placeholder="Ciudad (ej: Lima)" value="Lima" />
          <input class="onb-input" id="onb-country" type="text" placeholder="País (ej: Perú)" value="Perú" />
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; width: 100%; gap: 0; margin-top: 16px;">
          <button class="onb-btn" id="onb-btn-2">Continuar →</button>
          <button class="onb-skip" id="onb-skip-2">Saltar este paso</button>
        </div>
      </div>

      <!-- Step 3: Done! -->
      <div class="onb-step" id="onb-step-3">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">✨</div>
          <h2 style="font-size: 1.4rem; font-weight: 800; color: #0F172A; margin: 0 0 8px;" id="onb-welcome-name">¡Listo!</h2>
          <p style="font-size: 0.84rem; color: #64748B; margin: 0; line-height: 1.5;">
            Tu espacio financiero está listo.<br/>Todo queda guardado en este dispositivo, solo para ti.
          </p>
        </div>
        <button class="onb-btn" id="onb-btn-3">Entrar a VALO OS 🚀</button>
      </div>
    </div>
  `;

  root.prepend(overlay);

  let firstName = '';
  let lastName = '';

  // Step 1 → 2
  const btn1 = overlay.querySelector('#onb-btn-1');
  const skipAll = overlay.querySelector('#onb-skip-all');

  btn1.addEventListener('click', () => {
    firstName = overlay.querySelector('#onb-first-name').value.trim();
    lastName = overlay.querySelector('#onb-last-name').value.trim();
    goToStep(2);
  });

  skipAll.addEventListener('click', () => {
    completeOnboarding('', '');
  });

  // Step 2 → 3
  overlay.querySelector('#onb-btn-2').addEventListener('click', () => {
    const city = overlay.querySelector('#onb-city').value.trim() || 'Lima';
    const country = overlay.querySelector('#onb-country').value.trim() || 'Perú';
    storage.updateSettings({ userCity: city, userCountry: country });
    
    const nameDisplay = firstName ? `, ${firstName}` : '';
    overlay.querySelector('#onb-welcome-name').textContent = `¡Todo listo${nameDisplay}!`;
    
    goToStep(3);
  });

  overlay.querySelector('#onb-skip-2').addEventListener('click', () => {
    const nameDisplay = firstName ? `, ${firstName}` : '';
    overlay.querySelector('#onb-welcome-name').textContent = `¡Todo listo${nameDisplay}!`;
    goToStep(3);
  });

  // Step 3 → App
  overlay.querySelector('#onb-btn-3').addEventListener('click', () => {
    completeOnboarding(firstName, lastName);
  });

  function goToStep(num) {
    overlay.querySelectorAll('.onb-step').forEach(s => s.classList.remove('active'));
    overlay.querySelector(`#onb-step-${num}`)?.classList.add('active');
  }

  function completeOnboarding(first, last) {
    // Save profile data
    const fullName = [first, last].filter(Boolean).join(' ') || '';
    if (fullName) {
      storage.updateSettings({
        userName: fullName,
        userFirstName: first,
        userLastName: last
      });
    }

    markOnboardingDone();

    // Animate out, then remove and call onComplete
    overlay.classList.add('leaving');
    overlay.addEventListener('animationend', () => {
      overlay.remove();
      onComplete?.();
    }, { once: true });
  }
}
