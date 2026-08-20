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
    lockContainer.style.opacity = '1';
    lockContainer.style.transform = 'scale(1)';
    lockContainer.style.filter = 'blur(0px)';
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
    background: radial-gradient(circle at 50% 22%, #1E293B 0%, #0F172A 48%, #030712 100%);
    z-index: 2147483647; 
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    color: #FFF; font-family: var(--font-display, -apple-system, BlinkMacSystemFont, 'Inter', sans-serif);
    user-select: none;
    overflow: hidden;
  `;

  const numpadKeys = [
    { num: '1', sub: '' },
    { num: '2', sub: 'ABC' },
    { num: '3', sub: 'DEF' },
    { num: '4', sub: 'GHI' },
    { num: '5', sub: 'JKL' },
    { num: '6', sub: 'MNO' },
    { num: '7', sub: 'PQRS' },
    { num: '8', sub: 'TUV' },
    { num: '9', sub: 'WXYZ' }
  ];

  lockContainer.innerHTML = `
    <!-- Top Security Emblem -->
    <div style="text-align: center; margin-bottom: 32px; animation: slideDownLock 0.5s cubic-bezier(0.16, 1, 0.3, 1);">
      <div id="lock-badge-wrap" style="
        width: 66px; height: 66px; border-radius: 22px; 
        background: radial-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 100%); 
        border: 1.5px solid rgba(255,255,255,0.18);
        box-shadow: 0 16px 36px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.3);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      ">
        <div id="lock-icon-container" style="display: flex; align-items: center; justify-content: center; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
          <i data-lucide="lock" id="lock-icon" style="width: 28px; height: 28px; color: #10B981; filter: drop-shadow(0 2px 10px rgba(16, 185, 129, 0.45));"></i>
        </div>
      </div>
      <h2 style="font-size: 1.45rem; font-weight: 800; margin: 0 0 4px; letter-spacing: -0.02em; color: #FFFFFF;">VALO Seguro</h2>
      <p style="font-size: 0.84rem; color: rgba(255,255,255,0.65); margin: 0; font-weight: 500;">
        ${settings.biometricEnabled ? 'Ingresa tu PIN o usa Huella Digital' : 'Ingresa tu código PIN de acceso'}
      </p>
    </div>

    <!-- PIN Progress Dots -->
    <div id="pin-dots" style="display: flex; gap: 16px; margin-bottom: 36px;">
      <div class="pin-dot" style="width:14px;height:14px;border-radius:50%;background:rgba(255,255,255,0.2);border: 1px solid rgba(255,255,255,0.15);transition:all 0.22s cubic-bezier(0.16, 1, 0.3, 1);"></div>
      <div class="pin-dot" style="width:14px;height:14px;border-radius:50%;background:rgba(255,255,255,0.2);border: 1px solid rgba(255,255,255,0.15);transition:all 0.22s cubic-bezier(0.16, 1, 0.3, 1);"></div>
      <div class="pin-dot" style="width:14px;height:14px;border-radius:50%;background:rgba(255,255,255,0.2);border: 1px solid rgba(255,255,255,0.15);transition:all 0.22s cubic-bezier(0.16, 1, 0.3, 1);"></div>
      <div class="pin-dot" style="width:14px;height:14px;border-radius:50%;background:rgba(255,255,255,0.2);border: 1px solid rgba(255,255,255,0.15);transition:all 0.22s cubic-bezier(0.16, 1, 0.3, 1);"></div>
    </div>

    <!-- Premium Tactile Glass Numpad -->
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; width: 280px;">
      ${numpadKeys.map(k => `
        <button class="pin-btn" data-val="${k.num}" style="
          width: 72px; height: 72px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.12); outline: none;
          background: rgba(255,255,255,0.06); color: #FFF;
          cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center;
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
          transition: all 0.16s cubic-bezier(0.16, 1, 0.3, 1); margin: 0 auto;
        ">
          <span style="font-size: 1.55rem; font-weight: 600; line-height: 1; color: #FFFFFF;">${k.num}</span>
          ${k.sub ? `<span style="font-size: 0.58rem; font-weight: 700; letter-spacing: 0.14em; color: rgba(255,255,255,0.45); margin-top: 2px;">${k.sub}</span>` : ''}
        </button>
      `).join('')}
      
      <!-- Bottom row: Biometric / Space, 0, Delete -->
      ${settings.biometricEnabled ? `
        <button id="pin-bio" style="
          width: 72px; height: 72px; border-radius: 50%; border: 1px solid rgba(16, 185, 129, 0.3); outline: none;
          background: rgba(16, 185, 129, 0.1); color: #10B981;
          cursor: pointer; display: flex; align-items: center; justify-content: center; margin: 0 auto;
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          transition: all 0.16s cubic-bezier(0.16, 1, 0.3, 1);
        "><i data-lucide="fingerprint" style="width: 26px; height: 26px;"></i></button>
      ` : `<div style="width: 72px; height: 72px;"></div>`}

      <button class="pin-btn" data-val="0" style="
        width: 72px; height: 72px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.12); outline: none;
        background: rgba(255,255,255,0.06); color: #FFF;
        cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center;
        backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        transition: all 0.16s cubic-bezier(0.16, 1, 0.3, 1); margin: 0 auto;
      ">
        <span style="font-size: 1.55rem; font-weight: 600; line-height: 1; color: #FFFFFF;">0</span>
      </button>

      <button id="pin-del" style="
        width: 72px; height: 72px; border-radius: 50%; border: none; outline: none;
        background: transparent; color: rgba(255,255,255,0.65);
        cursor: pointer; display: flex; align-items: center; justify-content: center; margin: 0 auto;
        transition: all 0.16s cubic-bezier(0.16, 1, 0.3, 1);
      "><i data-lucide="delete" style="width: 24px; height: 24px;"></i></button>
    </div>
  `;

  document.body.appendChild(lockContainer);
  createIcons({ icons, root: lockContainer });

  function executeUnlockSuccess() {
    isLocked = false;
    
    // Unlock Physical Animation Sequence
    const badgeWrap = lockContainer.querySelector('#lock-badge-wrap');
    const iconContainer = lockContainer.querySelector('#lock-icon-container');
    
    if (badgeWrap && iconContainer) {
      badgeWrap.style.transform = 'scale(1.15)';
      badgeWrap.style.borderColor = 'rgba(16, 185, 129, 0.8)';
      badgeWrap.style.boxShadow = '0 0 40px rgba(16, 185, 129, 0.5), inset 0 0 20px rgba(16, 185, 129, 0.3)';
      
      iconContainer.innerHTML = '<i data-lucide="lock-keyhole-open" style="width: 30px; height: 30px; color: #10B981; filter: drop-shadow(0 0 14px #10B981);"></i>';
      createIcons({ icons, root: iconContainer });
    }

    dots.forEach(d => {
      d.style.background = '#10B981';
      d.style.boxShadow = '0 0 12px #10B981';
      d.style.transform = 'scale(1.2)';
    });

    // Smooth App Iris Transition
    setTimeout(() => {
      lockContainer.style.transition = 'opacity 0.42s cubic-bezier(0.16, 1, 0.3, 1), transform 0.42s cubic-bezier(0.16, 1, 0.3, 1), filter 0.42s cubic-bezier(0.16, 1, 0.3, 1)';
      lockContainer.style.opacity = '0';
      lockContainer.style.transform = 'scale(1.08)';
      lockContainer.style.filter = 'blur(14px)';
      lockContainer.style.pointerEvents = 'none';

      setTimeout(() => {
        lockContainer.style.display = 'none';
        currentInput = '';
        updateDots();
        if (unlockCallback) unlockCallback();
      }, 420);
    }, 240);
  }

  function triggerBiometricUnlock() {
    biometrics.verify().then(success => {
      if (success) {
        executeUnlockSuccess();
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
        dot.style.boxShadow = '0 0 8px rgba(16, 185, 129, 0.5)';
        dot.style.borderColor = '#10B981';
        dot.style.transform = 'scale(1.2)';
      } else {
        dot.style.background = 'rgba(255,255,255,0.2)';
        dot.style.boxShadow = 'none';
        dot.style.borderColor = 'rgba(255,255,255,0.15)';
        dot.style.transform = 'scale(1)';
      }
    });
  }

  function handleInput(val) {
    if (currentInput.length < 4) {
      currentInput += val;
      updateDots();
      
      if (currentInput.length === 4) {
        setTimeout(checkPin, 150);
      }
    }
  }

  function checkPin() {
    if (currentInput === correctPin) {
      executeUnlockSuccess();
    } else {
      // Tactile Error Animation
      const dotsContainer = document.getElementById('pin-dots');
      dotsContainer.style.animation = 'shakeLock 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both';
      navigator.vibrate?.(200);
      
      dots.forEach(d => {
        d.style.background = '#EF4444';
        d.style.borderColor = '#EF4444';
        d.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.6)';
      });

      setTimeout(() => {
        dotsContainer.style.animation = '';
        currentInput = '';
        updateDots();
      }, 450);
    }
  }

  lockContainer.querySelectorAll('.pin-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.style.transform = 'scale(0.9)';
      btn.style.background = 'rgba(255,255,255,0.18)';
      setTimeout(() => {
        btn.style.transform = 'scale(1)';
        btn.style.background = 'rgba(255,255,255,0.06)';
      }, 140);
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
      @keyframes shakeLock {
        0%, 100% { transform: translateX(0); }
        15% { transform: translateX(-10px); }
        30% { transform: translateX(10px); }
        45% { transform: translateX(-6px); }
        60% { transform: translateX(6px); }
        75% { transform: translateX(-3px); }
        90% { transform: translateX(3px); }
      }
      @keyframes slideDownLock {
        from { opacity: 0; transform: translateY(-24px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }
}
