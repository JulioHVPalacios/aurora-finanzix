import { storage } from '../services/storage.js';
import { createIcons, icons } from 'lucide';
import { t } from '../services/i18n.js';
import { biometrics } from '../services/biometrics.js';

let isLocked = false;
let unlockCallback = null;

export function initSecurityLock(onUnlocked) {
  const settings = storage.getSettings() || {};
  
  if (settings.securityPinEnabled && settings.securityPin) {
    isLocked = true;
    unlockCallback = onUnlocked;
    showLockScreen();

    // Re-lock when coming back from background
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        const currentSettings = storage.getSettings() || {};
        if (currentSettings.securityPinEnabled) {
          isLocked = true;
        }
      } else if (document.visibilityState === 'visible' && isLocked) {
        showLockScreen();
      }
    });

  } else {
    onUnlocked(); // No pin set
  }
}

function showLockScreen() {
  let lockContainer = document.getElementById('valo-security-lock');
  if (lockContainer) {
    lockContainer.style.display = 'flex';
    // Auto trigger biometric if enabled
    const settings = storage.getSettings() || {};
    if (settings.biometricEnabled) triggerBiometricUnlock();
    return;
  }

  const settings = storage.getSettings() || {};
  const correctPin = settings.securityPin;
  let currentInput = '';

  lockContainer = document.createElement('div');
  lockContainer.id = 'valo-security-lock';
  lockContainer.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: #0F172A; z-index: 2147483647; 
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    color: #FFF; font-family: var(--font-display, 'Inter');
  `;

  lockContainer.innerHTML = `
    <div style="text-align: center; margin-bottom: 40px; animation: slideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1);">
      <div style="width: 54px; height: 54px; border-radius: 16px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
        <i data-lucide="lock" style="width: 24px; height: 24px; color: #10B981;"></i>
      </div>
      <h2 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 6px;">VALO Seguro</h2>
      <p style="font-size: 0.9rem; color: rgba(255,255,255,0.6);">Ingresa tu PIN ${settings.biometricEnabled ? 'o Huella' : ''}</p>
    </div>

    <!-- Dots -->
    <div id="pin-dots" style="display: flex; gap: 14px; margin-bottom: 40px;">
      <div class="pin-dot" style="width:14px;height:14px;border-radius:50%;background:rgba(255,255,255,0.2);transition:all 0.2s;"></div>
      <div class="pin-dot" style="width:14px;height:14px;border-radius:50%;background:rgba(255,255,255,0.2);transition:all 0.2s;"></div>
      <div class="pin-dot" style="width:14px;height:14px;border-radius:50%;background:rgba(255,255,255,0.2);transition:all 0.2s;"></div>
      <div class="pin-dot" style="width:14px;height:14px;border-radius:50%;background:rgba(255,255,255,0.2);transition:all 0.2s;"></div>
    </div>

    <!-- Numpad -->
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; width: 260px;">
      ${[1,2,3,4,5,6,7,8,9].map(n => `
        <button class="pin-btn" data-val="${n}" style="
          width: 70px; height: 70px; border-radius: 50%; border: none; outline: none;
          background: rgba(255,255,255,0.05); color: #FFF; font-size: 1.6rem; font-weight: 500;
          cursor: pointer; display:flex; align-items:center; justify-content:center;
          transition: background 0.15s; margin: 0 auto;
        ">${n}</button>
      `).join('')}
      
      <!-- Bottom row: Biometric, 0, Delete -->
      ${settings.biometricEnabled ? `
        <button id="pin-bio" style="
          width: 70px; height: 70px; border-radius: 50%; border: none; outline: none;
          background: transparent; color: #10B981; font-size: 1.5rem;
          cursor: pointer; display:flex; align-items:center; justify-content:center; margin: 0 auto;
        "><i data-lucide="fingerprint"></i></button>
      ` : `<div style="width: 70px; height: 70px;"></div>`}

      <button class="pin-btn" data-val="0" style="
        width: 70px; height: 70px; border-radius: 50%; border: none; outline: none;
        background: rgba(255,255,255,0.05); color: #FFF; font-size: 1.6rem; font-weight: 500;
        cursor: pointer; display:flex; align-items:center; justify-content:center; margin: 0 auto;
      ">0</button>
      <button id="pin-del" style="
        width: 70px; height: 70px; border-radius: 50%; border: none; outline: none;
        background: transparent; color: rgba(255,255,255,0.6); font-size: 1.2rem;
        cursor: pointer; display:flex; align-items:center; justify-content:center; margin: 0 auto;
      "><i data-lucide="delete"></i></button>
    </div>
  `;

  document.body.appendChild(lockContainer);
  createIcons({ icons, root: lockContainer });

  function triggerBiometricUnlock() {
    biometrics.verify().then(success => {
      if (success) {
        isLocked = false;
        lockContainer.style.animation = 'fadeOut 0.4s ease forwards';
        setTimeout(() => {
          lockContainer.style.display = 'none';
          currentInput = '';
          updateDots();
          if (unlockCallback) unlockCallback();
        }, 400);
      }
    });
  }

  // Auto-trigger if biometric is enabled
  if (settings.biometricEnabled) {
    triggerBiometricUnlock();
  }

  lockContainer.querySelector('#pin-bio')?.addEventListener('click', () => {
    triggerBiometricUnlock();
  });

  const dots = lockContainer.querySelectorAll('.pin-dot');
  
  function updateDots() {
    dots.forEach((dot, i) => {
      if (i < currentInput.length) {
        dot.style.background = '#10B981';
        dot.style.transform = 'scale(1.15)';
      } else {
        dot.style.background = 'rgba(255,255,255,0.2)';
        dot.style.transform = 'scale(1)';
      }
    });
  }

  function handleInput(val) {
    if (currentInput.length < 4) {
      currentInput += val;
      updateDots();
      
      if (currentInput.length === 4) {
        setTimeout(checkPin, 200);
      }
    }
  }

  function checkPin() {
    if (currentInput === correctPin) {
      isLocked = false;
      lockContainer.style.animation = 'fadeOut 0.4s ease forwards';
      setTimeout(() => {
        lockContainer.style.display = 'none';
        currentInput = '';
        updateDots();
        if (unlockCallback) unlockCallback();
      }, 400);
    } else {
      // Error animation
      const dotsContainer = document.getElementById('pin-dots');
      dotsContainer.style.animation = 'shake 0.4s ease';
      navigator.vibrate?.(200);
      
      setTimeout(() => {
        dotsContainer.style.animation = '';
        currentInput = '';
        updateDots();
      }, 400);
    }
  }

  lockContainer.querySelectorAll('.pin-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.style.background = 'rgba(255,255,255,0.15)';
      setTimeout(() => btn.style.background = 'rgba(255,255,255,0.05)', 150);
      handleInput(btn.getAttribute('data-val'));
    });
  });

  lockContainer.querySelector('#pin-del').addEventListener('click', () => {
    if (currentInput.length > 0) {
      currentInput = currentInput.slice(0, -1);
      updateDots();
    }
  });

  if (!document.getElementById('pin-styles')) {
    const style = document.createElement('style');
    style.id = 'pin-styles';
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-8px); }
        40% { transform: translateX(8px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
      }
      @keyframes fadeOut {
        to { opacity: 0; visibility: hidden; }
      }
      @keyframes slideDown {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }
}
