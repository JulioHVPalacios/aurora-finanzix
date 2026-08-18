/* ==========================================================================
   VALO OS - TOP NAVBAR COMPONENT
   Minimalist Glass Controls, Custom User Initials (JP) & Profile Personalization
   ========================================================================== */

import { storage } from '../services/storage.js';
import { t, setLanguage } from '../services/i18n.js';
import { showUserProfileModal } from './UserProfileModal.js';
import { createIcons, icons } from 'lucide';

export function renderNavbar(container, { onOpenMobileQR, onOpenExportImport, onCurrencyChange, onCheckUpdates }) {
  const settings = storage.getSettings() || {};
  const currentLang = settings.language || settings.lang || 'es';
  const currentCurrency = settings.currency || 'PEN';
  const currentSymbol = settings.currencySymbol || 'S/';

  const userName = (!settings.userName || settings.userName === 'Mi Espacio' || settings.userName === 'My Space')
    ? t('nav_my_space')
    : settings.userName;

  const userFirstName = settings.userFirstName || '';
  const userLastName = settings.userLastName || '';
  const hasProfile = !!(userFirstName || (settings.userName && settings.userName !== 'Mi Espacio' && settings.userName !== 'My Space'));

  let initials = '';
  if (userFirstName || userLastName) {
    const firstI = userFirstName ? userFirstName.trim()[0] : '';
    const lastParts = userLastName ? userLastName.trim().split(/\s+/) : [];
    // Use second surname (last part) if available, else first surname
    const lastI = lastParts.length > 1 ? lastParts[lastParts.length - 1][0] : (lastParts[0] ? lastParts[0][0] : '');
    initials = (firstI + lastI).toUpperCase();
  } else if (settings.userName && settings.userName !== 'Mi Espacio' && settings.userName !== 'My Space') {
    const parts = settings.userName.trim().split(/\s+/);
    if (parts.length === 1) {
      initials = parts[0].substring(0, 2).toUpperCase();
    } else {
      initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
  }

  container.innerHTML = `
    <div class="navbar-user" id="btn-navbar-profile" style="max-width: 48%; overflow: hidden; cursor: pointer;" title="${t('nav_edit_profile') || 'Editar Perfil'}">
      <div class="user-avatar-glass" style="background: #090D16; border: 1.5px solid rgba(255,255,255,0.85); color: #FFFFFF; font-weight: 800; width: 36px; height: 36px; flex-shrink: 0; font-size: ${initials.length > 0 ? '0.85rem' : '1rem'}; letter-spacing: 0.5px; display: flex; align-items: center; justify-content: center;">
        ${initials.length > 0
          ? initials
          : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
        }
      </div>
      <div style="min-width: 0; overflow: hidden;">
        <div class="greeting-sub" style="font-family: var(--font-mono); font-size: 0.60rem; letter-spacing: 0.1em; color: var(--ink-60);">
          VALO OS
        </div>
        <div class="greeting-main" style="font-size: 0.95rem; font-weight: 800; color: var(--ink); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
          ${userName}
        </div>
      </div>
    </div>

    <div class="navbar-actions" style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
      <!-- Language Selector Chip (ES / EN) -->
      <button id="btn-lang-selector" class="chip-glass" style="cursor: pointer; padding: 5px 9px; font-family: var(--font-mono); font-weight: 800; font-size: 0.75rem;" title="${t('lang_title')}">
        <span id="nav-lang-txt" style="color: #4F46E5;">${currentLang.toUpperCase()}</span>
      </button>

      <!-- Currency Selector Chip (S/ or $) -->
      <button id="btn-currency-selector" class="chip-glass" style="cursor: pointer; padding: 5px 9px; font-family: var(--font-mono); font-weight: 800; font-size: 0.75rem;" title="${t('currency_title')}">
        <span id="nav-currency-sym" style="color: #059669;">${currentSymbol}</span>
      </button>

      <!-- Zen Mode (Privacy Eye) -->
      <button id="btn-nav-zen" class="tool-circle-glass" style="width: 34px; height: 34px;" title="${t('zen_title')}">
        <i data-lucide="eye-off" style="width: 15px; height: 15px; color: var(--ink-60);"></i>
      </button>

      <!-- Settings & Tools Dropdown Sheet Button -->
      <button id="btn-nav-more" class="tool-circle-glass" style="width: 34px; height: 34px;" title="Más opciones">
        <i data-lucide="more-horizontal" style="width: 16px; height: 16px; color: #0F172A;"></i>
      </button>
    </div>
  `;

  // Bind Events
  container.querySelector('#btn-navbar-profile')?.addEventListener('click', () => {
    showUserProfileModal({
      onSave: () => {
        window.dispatchEvent(new CustomEvent('finanzix:data-changed'));
      }
    });
  });

  container.querySelector('#btn-lang-selector')?.addEventListener('click', () => {
    const nextLang = currentLang === 'es' ? 'en' : 'es';
    setLanguage(nextLang);
  });

  container.querySelector('#btn-currency-selector')?.addEventListener('click', () => {
    let nextCurrency = 'USD';
    let nextSymbol = '$';
    
    if (currentCurrency === 'PEN') {
      nextCurrency = 'USD';
      nextSymbol = '$';
    } else {
      nextCurrency = 'PEN';
      nextSymbol = 'S/';
    }

    storage.updateSettings({ currency: nextCurrency, currencySymbol: nextSymbol });
    onCurrencyChange?.(nextCurrency, nextSymbol);
  });

  container.querySelector('#btn-nav-zen')?.addEventListener('click', () => {
    document.body.classList.toggle('zen-mode-active');
  });

  // Settings & More Modal
  container.querySelector('#btn-nav-more')?.addEventListener('click', () => {
    showNavbarMoreModal({
      onCheckUpdates,
      onOpenExportImport,
      onOpenMobileQR
    });
  });

  createIcons({ icons });
}

function showNavbarMoreModal({ onCheckUpdates, onOpenExportImport, onOpenMobileQR }) {
  const portal = document.getElementById('modal-portal');
  if (!portal) return;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  overlay.innerHTML = `
    <div class="bottom-sheet" style="max-width: 420px;">
      <div class="sheet-handle"></div>
      <div class="sheet-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <img src="/icon.svg" style="width: 22px; height: 22px;" />
          <h3 class="sheet-title">VALO Control Panel</h3>
        </div>
        <button type="button" class="sheet-close-btn" id="btn-more-sheet-close">
          <i data-lucide="x" style="width: 18px; height: 18px;"></i>
        </button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 8px;">
        <!-- Sync & Update Option -->
        <button type="button" class="btn" id="btn-more-sync" style="background: #F8FAFC; border: 1px solid rgba(15, 23, 42, 0.08); justify-content: flex-start; padding: 14px 16px; border-radius: 14px; font-weight: 700; color: var(--ink);">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: #EEF2FF; color: #4F46E5; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
            <i data-lucide="refresh-cw" style="width: 18px; height: 18px;"></i>
          </div>
          <div style="text-align: left;">
            <div style="font-size: 0.9rem;">${t('sync_title')}</div>
            <div style="font-size: 0.72rem; color: var(--ink-60); font-weight: 500;">Verificar última versión y caché</div>
          </div>
        </button>

        <!-- Backups & Export Option -->
        <button type="button" class="btn" id="btn-more-backup" style="background: #F8FAFC; border: 1px solid rgba(15, 23, 42, 0.08); justify-content: flex-start; padding: 14px 16px; border-radius: 14px; font-weight: 700; color: var(--ink);">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: #F0FDF4; color: #059669; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
            <i data-lucide="folder-down" style="width: 18px; height: 18px;"></i>
          </div>
          <div style="text-align: left;">
            <div style="font-size: 0.9rem;">${t('backup_title')}</div>
            <div style="font-size: 0.72rem; color: var(--ink-60); font-weight: 500;">Exportar o restaurar archivo JSON</div>
          </div>
        </button>

        <!-- Mobile QR Option -->
        <button type="button" class="btn" id="btn-more-qr" style="background: #F8FAFC; border: 1px solid rgba(15, 23, 42, 0.08); justify-content: flex-start; padding: 14px 16px; border-radius: 14px; font-weight: 700; color: var(--ink);">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: #FFF7ED; color: #EA580C; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
            <i data-lucide="qr-code" style="width: 18px; height: 18px;"></i>
          </div>
          <div style="text-align: left;">
            <div style="font-size: 0.9rem;">${t('qr_title')}</div>
            <div style="font-size: 0.72rem; color: var(--ink-60); font-weight: 500;">Escanear túnel para abrir en celular</div>
          </div>
        </button>

        <!-- Divider -->
        <div style="height: 1px; background: rgba(15, 23, 42, 0.06); margin: 2px 0;"></div>

        <!-- Edit Profile -->
        <button type="button" class="btn" id="btn-more-edit-profile" style="background: #F8FAFC; border: 1px solid rgba(15, 23, 42, 0.08); justify-content: flex-start; padding: 14px 16px; border-radius: 14px; font-weight: 700; color: var(--ink);">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: #F0F9FF; color: #0284C7; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
            <i data-lucide="user-pen" style="width: 18px; height: 18px;"></i>
          </div>
          <div style="text-align: left;">
            <div style="font-size: 0.9rem;">Editar Perfil</div>
            <div style="font-size: 0.72rem; color: var(--ink-60); font-weight: 500;">Cambiar nombre, ciudad y datos personales</div>
          </div>
        </button>

        <!-- Privacy Policy -->
        <a href="/privacy.html" target="_blank" rel="noopener noreferrer" class="btn" style="background: #F8FAFC; border: 1px solid rgba(15, 23, 42, 0.08); justify-content: flex-start; padding: 14px 16px; border-radius: 14px; font-weight: 700; color: var(--ink); text-decoration: none; display: flex; align-items: center;">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: #F3F4F6; color: #4B5563; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
            <i data-lucide="shield-check" style="width: 18px; height: 18px;"></i>
          </div>
          <div style="text-align: left;">
            <div style="font-size: 0.9rem;">Política de Privacidad</div>
            <div style="font-size: 0.72rem; color: var(--ink-60); font-weight: 500;">Almacenamiento 100% local y seguro</div>
          </div>
        </a>

        <!-- Reset App -->
        <button type="button" class="btn" id="btn-more-reset" style="background: #FFF5F5; border: 1px solid rgba(239, 68, 68, 0.15); justify-content: flex-start; padding: 14px 16px; border-radius: 14px; font-weight: 700; color: #DC2626;">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: #FEE2E2; color: #DC2626; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
            <i data-lucide="rotate-ccw" style="width: 18px; height: 18px;"></i>
          </div>
          <div style="text-align: left;">
            <div style="font-size: 0.9rem; color: #DC2626;">Reiniciar App</div>
            <div style="font-size: 0.72rem; color: #F87171; font-weight: 500;">Borrar todos los datos y volver al inicio</div>
          </div>
        </button>
      </div>
    </div>
  `;


  function close() {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 280);
  }

  overlay.querySelector('#btn-more-sheet-close')?.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  overlay.querySelector('#btn-more-sync')?.addEventListener('click', () => {
    close();
    onCheckUpdates?.();
  });

  overlay.querySelector('#btn-more-backup')?.addEventListener('click', () => {
    close();
    onOpenExportImport?.();
  });

  overlay.querySelector('#btn-more-qr')?.addEventListener('click', () => {
    close();
    onOpenMobileQR?.();
  });

  overlay.querySelector('#btn-more-edit-profile')?.addEventListener('click', () => {
    close();
    setTimeout(() => {
      showUserProfileModal({
        onSave: () => window.dispatchEvent(new CustomEvent('finanzix:data-changed'))
      });
    }, 300);
  });

  overlay.querySelector('#btn-more-reset')?.addEventListener('click', () => {
    // Two-step confirmation inside the panel
    const resetBtn = overlay.querySelector('#btn-more-reset');
    if (resetBtn.dataset.confirmed !== 'true') {
      resetBtn.dataset.confirmed = 'true';
      resetBtn.innerHTML = `
        <div style="width: 36px; height: 36px; border-radius: 10px; background: #DC2626; color: #FFFFFF; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
          <i data-lucide="alert-triangle" style="width: 18px; height: 18px;"></i>
        </div>
        <div style="text-align: left;">
          <div style="font-size: 0.9rem; color: #DC2626; font-weight: 800;">⚠️ Toca de nuevo para confirmar</div>
          <div style="font-size: 0.72rem; color: #F87171; font-weight: 500;">Se borrarán TODOS tus datos. Irreversible.</div>
        </div>
      `;
      createIcons({ icons, nameAttr: 'data-lucide', root: resetBtn });
      return;
    }

    // Confirmed — wipe everything
    localStorage.clear();
    // Reload app so onboarding shows again
    window.location.reload();
  });

  portal.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('active'));
  createIcons({ icons, nameAttr: 'data-lucide', root: overlay });
}

