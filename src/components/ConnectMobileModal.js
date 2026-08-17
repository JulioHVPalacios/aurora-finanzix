/* ==========================================================================
   VALO OS - CONNECT MOBILE MODAL
   100% Bilingual (ES / EN) with Direct APK & Local/Tunnel Connect
   ========================================================================== */

import QRCode from 'qrcode';
import { t } from '../services/i18n.js';
import { createIcons, icons } from 'lucide';

export function showConnectMobileModal() {
  const portal = document.getElementById('modal-portal');
  if (!portal) return;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const publicTunnelUrl = 'https://aurora-finanzix-app.loca.lt';
  const localWifiUrl = 'http://192.168.1.50:5173';
  const publicIP = '190.235.185.14';
  const apkDownloadUrl = '/Aurora-Finanzix.apk';

  overlay.innerHTML = `
    <div class="bottom-sheet" style="max-width: 440px;">
      <div class="sheet-handle"></div>
      <div class="sheet-header">
        <h3 class="sheet-title">${t('modal_qr_title')}</h3>
        <button type="button" class="sheet-close-btn" id="btn-modal-close">
          <i data-lucide="x" style="width: 18px; height: 18px;"></i>
        </button>
      </div>

      <!-- Direct APK Download Button -->
      <a href="${apkDownloadUrl}" download="VALO-Finanzix.apk" class="btn btn-primary btn-block" style="padding: 14px; font-size: 0.92rem; margin-bottom: 14px; background: #0F172A; color: #FFFFFF; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 700;">
        <i data-lucide="download" style="width: 17px; height: 17px;"></i>
        <span>${t('modal_qr_download_apk')}</span>
      </a>

      <!-- Segmented Tabs -->
      <div class="segmented-control" style="margin-bottom: 14px;">
        <button type="button" class="segment-btn active" id="tab-btn-tunnel">${t('modal_qr_tab_tunnel')}</button>
        <button type="button" class="segment-btn" id="tab-btn-wifi">${t('modal_qr_tab_wifi')}</button>
      </div>

      <!-- QR Card Container -->
      <div style="background: #F8FAFC; border: 1px solid rgba(15, 23, 42, 0.08); border-radius: 18px; padding: 16px 12px; text-align: center;">
        <div id="qr-code-wrapper" style="display: flex; justify-content: center; margin-bottom: 10px;">
          <canvas id="qr-canvas" style="border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08);"></canvas>
        </div>

        <div id="tunnel-info-block">
          <div style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: var(--ink); word-break: break-all; margin-bottom: 8px;">
            ${publicTunnelUrl}
          </div>
          <div style="background: #ECFDF5; border: 1px solid rgba(5, 150, 105, 0.2); border-radius: 10px; padding: 8px; font-size: 0.76rem; color: #065F46; text-align: left;">
            <strong>${t('modal_qr_pwd_label')}</strong><br/>
            <span style="color: #047857; font-family: var(--font-mono); font-weight: 800;">${publicIP}</span>
          </div>
        </div>

        <div id="wifi-info-block" style="display: none;">
          <div style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: var(--ink); word-break: break-all; margin-bottom: 8px;">
            ${localWifiUrl}
          </div>
        </div>

        <button type="button" class="btn btn-secondary btn-block" id="btn-copy-url" style="margin-top: 10px; font-size: 0.82rem; padding: 10px; font-weight: 700;">
          <i data-lucide="copy" style="width: 14px; height: 14px; margin-right: 6px;"></i>
          <span>${t('modal_qr_copy_btn')}</span>
        </button>
      </div>
    </div>
  `;

  createIcons({ icons, nameAttr: 'data-lucide', root: overlay });

  function renderQR(url) {
    const canvas = overlay.querySelector('#qr-canvas');
    if (canvas) {
      QRCode.toCanvas(canvas, url, {
        width: 150,
        margin: 2,
        color: {
          dark: '#0F172A',
          light: '#FFFFFF'
        }
      });
    }
  }

  let activeUrl = publicTunnelUrl;

  const btnTunnel = overlay.querySelector('#tab-btn-tunnel');
  const btnWifi = overlay.querySelector('#tab-btn-wifi');
  const tunnelBlock = overlay.querySelector('#tunnel-info-block');
  const wifiBlock = overlay.querySelector('#wifi-info-block');
  const copyBtn = overlay.querySelector('#btn-copy-url');

  btnTunnel?.addEventListener('click', () => {
    btnTunnel.classList.add('active');
    btnWifi?.classList.remove('active');
    tunnelBlock.style.display = 'block';
    wifiBlock.style.display = 'none';
    activeUrl = publicTunnelUrl;
    renderQR(activeUrl);
  });

  btnWifi?.addEventListener('click', () => {
    btnWifi.classList.add('active');
    btnTunnel?.classList.remove('active');
    tunnelBlock.style.display = 'none';
    wifiBlock.style.display = 'block';
    activeUrl = localWifiUrl;
    renderQR(activeUrl);
  });

  copyBtn?.addEventListener('click', () => {
    navigator.clipboard.writeText(activeUrl).then(() => {
      copyBtn.innerHTML = `<span>${t('modal_qr_copied')}</span>`;
      setTimeout(() => {
        copyBtn.innerHTML = `<i data-lucide="copy" style="width: 14px; height: 14px; margin-right: 6px;"></i><span>${t('modal_qr_copy_btn')}</span>`;
        createIcons({ icons, nameAttr: 'data-lucide', root: copyBtn });
      }, 2000);
    });
  });

  function close() {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 280);
  }

  overlay.querySelector('#btn-modal-close')?.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  portal.appendChild(overlay);
  renderQR(activeUrl);

  requestAnimationFrame(() => {
    overlay.classList.add('active');
  });
}
