/* ==========================================================================
   AURORA FINANZIX - CONNECT MOBILE MODAL
   Direct APK Download & Local/Tunnel Connect
   ========================================================================== */

import QRCode from 'qrcode';

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
        <h3 class="sheet-title">📱 App para tu Celular</h3>
        <button type="button" class="sheet-close-btn" id="btn-modal-close">✕</button>
      </div>

      <!-- Direct APK Download Button -->
      <a href="${apkDownloadUrl}" download="Aurora-Finanzix.apk" class="btn btn-primary btn-block" style="padding: 14px; font-size: 0.95rem; margin-bottom: 14px; background: #FFFFFF; color: #000000; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px;">
        <i data-lucide="download" style="width: 18px; height: 18px;"></i>
        <span>Descargar Archivo APK Directo (.apk)</span>
      </a>

      <!-- Segmented Tabs -->
      <div class="segmented-control" style="margin-bottom: 14px;">
        <button type="button" class="segment-btn active" id="tab-btn-tunnel">🌐 Túnel HTTPS</button>
        <button type="button" class="segment-btn" id="tab-btn-wifi">📶 Wi-Fi Directo</button>
      </div>

      <!-- QR Card Container -->
      <div style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 18px; padding: 16px 12px; text-align: center;">
        <div id="qr-code-wrapper" style="display: flex; justify-content: center; margin-bottom: 10px;">
          <canvas id="qr-canvas" style="border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.5);"></canvas>
        </div>

        <div id="tunnel-info-block">
          <div style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: #FFFFFF; word-break: break-all; margin-bottom: 8px;">
            ${publicTunnelUrl}
          </div>
          <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 10px; padding: 8px; font-size: 0.76rem; color: #6EE7B7; text-align: left;">
            💡 <strong>Contraseña / IP de Verificación:</strong><br/>
            Si pide "Tunnel Password": <strong style="color: #FFFFFF; font-family: var(--font-mono);">${publicIP}</strong>
          </div>
        </div>

        <div id="wifi-info-block" style="display: none;">
          <div style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: #FFFFFF; word-break: break-all; margin-bottom: 8px;">
            ${localWifiUrl}
          </div>
        </div>

        <button type="button" class="btn btn-secondary btn-block" id="btn-copy-url" style="margin-top: 10px; font-size: 0.82rem; padding: 10px;">
          📋 Copiar Enlace
        </button>
      </div>
    </div>
  `;

  function renderQR(url) {
    const canvas = overlay.querySelector('#qr-canvas');
    if (canvas) {
      QRCode.toCanvas(canvas, url, {
        width: 150,
        margin: 2,
        color: {
          dark: '#000000',
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
      copyBtn.textContent = '✓ ¡Enlace Copiado!';
      setTimeout(() => copyBtn.textContent = '📋 Copiar Enlace', 2000);
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
