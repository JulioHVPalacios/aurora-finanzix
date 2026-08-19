import { t } from '../services/i18n.js';
import { createIcons, icons } from 'lucide';

let LightweightCharts = null;

export class MarketsView {
  constructor(container) {
    this.container = container;
    this.currentSymbol = 'BTCUSDT';
    this.assets = [];
    this.ws = null;
    this.chart = null;
    this.lineSeries = null;
    this.sortState = { column: null, asc: false };
    this._destroyed = false;
  }

  async init() {
    this._destroyed = false;
    this.renderSkeleton();
    await this.fetchTopCryptos();
    this.render();
    this.initWebSocket();
    this.initStocksWidget();
    this.bindSorting();

    try {
      if (!LightweightCharts) {
        LightweightCharts = await import('https://cdn.jsdelivr.net/npm/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.mjs');
      }
      if (!this._destroyed) await this.initChart();
    } catch (err) {
      console.error('Error loading lightweight-charts', err);
    }
  }

  async fetchTopCryptos() {
    try {
      const res = await fetch('https://api.binance.com/api/v3/ticker/24hr');
      if (!res.ok) throw new Error('Binance API Error');
      const data = await res.json();

      // Filter USDT pairs, exclude stablecoins
      const stablecoins = new Set(['USDTUSDT','USDCUSDT','TUSDUSDT','FDUSDUSDT','BUSDUSDT','DAIUSDT','USDPUSDT']);
      let pairs = data.filter(d => d.symbol.endsWith('USDT') && !stablecoins.has(d.symbol));
      // Sort by 24h volume (most liquid = most real-time data)
      pairs.sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume));

      const nameMap = {
        'BTC':'Bitcoin','ETH':'Ethereum','BNB':'BNB','SOL':'Solana','XRP':'Ripple',
        'ADA':'Cardano','DOGE':'Dogecoin','TRX':'TRON','LINK':'Chainlink','DOT':'Polkadot',
        'MATIC':'Polygon','LTC':'Litecoin','SHIB':'Shiba Inu','AVAX':'Avalanche','BCH':'Bitcoin Cash',
        'XLM':'Stellar','ATOM':'Cosmos','UNI':'Uniswap','NEAR':'NEAR Protocol','APT':'Aptos',
        'ARB':'Arbitrum','OP':'Optimism','INJ':'Injective','RNDR':'Render','PEPE':'Pepe',
        'SUI':'Sui','WIF':'Dogwifhat','FIL':'Filecoin','HBAR':'Hedera','ICP':'Internet Computer',
        'VET':'VeChain','MKR':'Maker','AAVE':'Aave','GRT':'The Graph','ALGO':'Algorand',
        'QNT':'Quant','EGLD':'MultiversX','SAND':'The Sandbox','MANA':'Decentraland',
        'AXS':'Axie Infinity','CHZ':'Chiliz','ENJ':'Enjin','GALA':'Gala','IMX':'Immutable',
        'FTM':'Fantom','CRV':'Curve','COMP':'Compound','SNX':'Synthetix','LDO':'Lido DAO',
        'RUNE':'THORChain','KSM':'Kusama','ROSE':'Oasis Network','ONE':'Harmony',
        'ZEC':'Zcash','XMR':'Monero','ETC':'Ethereum Classic','NEO':'Neo','IOTA':'IOTA',
        'THETA':'Theta','ZIL':'Zilliqa','ENS':'ENS Domains','1INCH':'1inch','BAT':'Basic Attention',
      };

      this.assets = pairs.slice(0, 100).map((d, index) => {
        const base = d.symbol.replace('USDT', '');
        const price = parseFloat(d.lastPrice);
        const change = parseFloat(d.priceChangePercent); // This is the OFFICIAL 24h % from Binance REST
        return {
          symbol: d.symbol,
          baseAsset: base,
          name: nameMap[base] || base,
          price,
          change,
          rank: index + 1,
        };
      });
    } catch (e) {
      console.error('Failed to fetch cryptos', e);
      this.assets = [
        { symbol:'BTCUSDT', baseAsset:'BTC', name:'Bitcoin', price:60000, change:2.5, rank:1 },
        { symbol:'ETHUSDT', baseAsset:'ETH', name:'Ethereum', price:3000, change:1.8, rank:2 },
      ];
    }
  }

  renderSkeleton() {
    this.container.innerHTML = `
      <div style="padding:60px 24px; text-align:center; color:var(--ink-40);">
        <i data-lucide="loader" style="width:32px;height:32px;animation:spin 1.2s linear infinite;margin-bottom:12px;"></i>
        <p style="font-size:0.9rem;font-weight:600;">${t("market_loading")}</p>
      </div>
    `;
    createIcons({ icons, nameAttr: 'data-lucide', root: this.container });
  }

  formatPrice(price) {
    if (price >= 1)    return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2}).format(price);
    if (price >= 0.01) return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:4,maximumFractionDigits:4}).format(price);
    return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:6,maximumFractionDigits:8}).format(price);
  }

  buildCryptoRows() {
    return this.assets.map(asset => {
      const chgColor = asset.change >= 0 ? '#10B981' : '#EF4444';
      const chgText  = (asset.change >= 0 ? '+' : '') + asset.change.toFixed(2) + '%';
      return `
        <div class="mkt-row" data-symbol="${asset.symbol}" data-name="${asset.name}"
             data-price="${asset.price}" data-change="${asset.change}" data-rank="${asset.rank}"
             style="display:flex;align-items:center;padding:11px 12px;border-bottom:1px solid rgba(15,23,42,0.04);cursor:pointer;transition:background 0.12s;border-radius:12px;">
          <div style="flex:0 0 22px;font-size:0.68rem;color:var(--ink-40);font-weight:700;text-align:center;">${asset.rank}</div>
          <img src="https://assets.coincap.io/assets/icons/${asset.baseAsset.toLowerCase()}@2x.png"
               onerror="this.onerror=null;this.src='https://ui-avatars.com/api/?name=${asset.baseAsset}&size=40&background=6366f1&color=ffffff&bold=true&rounded=true'"
               style="width:32px;height:32px;border-radius:50%;margin:0 10px;flex-shrink:0;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
          <div style="flex:1;min-width:0;">
            <div style="font-weight:800;font-size:0.85rem;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${asset.name}</div>
            <div style="font-size:0.7rem;color:var(--ink-40);font-weight:600;">${asset.baseAsset}</div>
          </div>
          <div style="text-align:right;margin-left:8px;">
            <div id="price-${asset.symbol}" data-raw="${asset.price}" style="font-weight:800;font-size:0.88rem;color:var(--ink);white-space:nowrap;">${this.formatPrice(asset.price)}</div>
            <div id="change-${asset.symbol}" style="font-weight:700;font-size:0.75rem;color:${chgColor};">${chgText}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  render() {
    const a = this.assets[0] || { name:'Bitcoin', baseAsset:'BTC', price:0, change:0 };

    this.container.innerHTML = `
      <div style="padding-bottom:130px;">

        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
          <div>
            <div style="display:flex;align-items:baseline;gap:8px;">
              <h1 style="font-size:1.6rem;font-weight:800;margin:0;color:var(--ink);">${t("nav_markets")}</h1>
            </div>
            <div style="display:flex;align-items:center;gap:6px;margin-top:4px;">
              <span id="ws-dot" style="display:inline-block;width:8px;height:8px;background:#94A3B8;border-radius:50%;transition:background 0.3s;"></span>
              <span id="ws-label" style="font-size:0.7rem;color:var(--ink-60);font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">${t("market_connecting")}</span>
            </div>
          </div>
        </div>

        <!-- Main Chart Card -->
        <div style="background:#fff;border:1px solid rgba(15,23,42,0.06);border-radius:24px;padding:20px;margin-bottom:20px;box-shadow:0 8px 24px rgba(0,0,0,0.04);position:relative;overflow:hidden;">
          <div style="display:flex;align-items:flex-start;margin-bottom:14px;position:relative;z-index:2;">
            <div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;">
                <img id="chart-icon" src="https://assets.coincap.io/assets/icons/${a.baseAsset.toLowerCase()}@2x.png"
                     style="width:24px;height:24px;border-radius:50%;">
                <span id="chart-name" style="font-weight:700;color:var(--ink-80);font-size:1rem;">${a.name}</span>
                <span id="chart-symbol" style="font-size:0.68rem;background:var(--bg-color);padding:2px 7px;border-radius:6px;color:var(--ink-60);font-weight:700;">${a.baseAsset}</span>
              </div>
              <div id="chart-price" style="font-size:2rem;font-weight:800;letter-spacing:-0.04em;color:var(--ink);line-height:1.1;">--</div>
              <div id="chart-change" style="font-size:0.82rem;font-weight:700;color:#10B981;display:flex;align-items:center;gap:4px;margin-top:3px;">
                <i data-lucide="loader" style="width:13px;height:13px;animation:spin 1.2s linear infinite;"></i> Cargando...
              </div>
            </div>
          </div>
          <div id="tv-chart" style="width:100%;height:200px;position:relative;z-index:2;"></div>
          <div id="chart-glow" style="position:absolute;top:-60px;right:-60px;width:180px;height:180px;background:rgba(16,185,129,0.07);border-radius:50%;filter:blur(50px);z-index:0;pointer-events:none;"></div>
        </div>

        <!-- Crypto Section -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <h2 style="font-size:1rem;font-weight:800;margin:0;color:var(--ink);">${t("market_crypto")} <span style="font-size:0.7rem;color:var(--ink-40);font-weight:600;">Top 100</span></h2>
        </div>

        <!-- Crypto Search -->
        <div style="position:relative;margin-bottom:10px;">
          <i data-lucide="search" style="position:absolute;left:13px;top:50%;transform:translateY(-50%);width:15px;height:15px;color:var(--ink-40);pointer-events:none;"></i>
          <input id="crypto-search" type="text" placeholder="${t("market_search")}"
                 style="width:100%;padding:10px 12px 10px 36px;border-radius:13px;border:1.5px solid rgba(15,23,42,0.09);font-size:0.84rem;background:#fff;color:var(--ink);outline:none;box-sizing:border-box;">
        </div>

        <!-- Crypto Table -->
        <div style="background:#fff;border:1.5px solid rgba(15,23,42,0.05);border-radius:18px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,0.03);margin-bottom:24px;">
          <div style="display:flex;align-items:center;padding:10px 12px;border-bottom:1.5px solid rgba(15,23,42,0.06);font-size:0.68rem;color:var(--ink-40);font-weight:700;text-transform:uppercase;letter-spacing:0.04em;user-select:none;">
            <div style="flex:0 0 22px;"></div>
            <div style="width:32px;margin:0 10px;flex-shrink:0;"></div>
            <div class="sort-btn" data-col="name" style="flex:1;cursor:pointer;display:flex;align-items:center;gap:3px;">
              ${t("market_asset")} <i data-lucide="chevrons-up-down" style="width:11px;height:11px;"></i>
            </div>
            <div class="sort-btn" data-col="price" style="text-align:right;cursor:pointer;display:flex;align-items:center;justify-content:flex-end;gap:3px;margin-left:8px;min-width:80px;">
              ${t("market_price")} <i data-lucide="chevrons-up-down" style="width:11px;height:11px;"></i>
            </div>
            <div class="sort-btn" data-col="change" style="text-align:right;cursor:pointer;display:flex;align-items:center;justify-content:flex-end;gap:3px;margin-left:8px;min-width:64px;">
              ${t("market_24h")} <i data-lucide="chevrons-up-down" style="width:11px;height:11px;"></i>
            </div>
          </div>
          <div id="crypto-list" style="max-height:480px;overflow-y:auto;scrollbar-width:none;padding:4px 0;">
            ${this.buildCryptoRows()}
          </div>
        </div>

        <!-- Stocks Section -->
        <h2 style="font-size:1rem;font-weight:800;margin:0 0 10px 0;color:var(--ink);">${t("market_stocks")} <span style="font-size:0.7rem;color:var(--ink-40);font-weight:600;">Wall Street</span></h2>
        <div style="background:#fff;border:1.5px solid rgba(15,23,42,0.05);border-radius:18px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,0.03);margin-bottom:16px;min-height:460px;">
          <iframe id="stocks-iframe"
            style="width:100%;height:500px;border:none;display:block;"
            loading="lazy"
            title="Acciones Globales">
          </iframe>
        </div>

      </div>
    `;

    createIcons({ icons, nameAttr: 'data-lucide', root: this.container });

    // Search filter
    const searchEl = this.container.querySelector('#crypto-search');
    searchEl?.addEventListener('input', e => {
      const val = e.target.value.toLowerCase().trim();
      this.container.querySelectorAll('.mkt-row').forEach(row => {
        const sym  = row.dataset.symbol.toLowerCase();
        const name = row.dataset.name.toLowerCase();
        row.style.display = (!val || sym.includes(val) || name.includes(val)) ? 'flex' : 'none';
      });
    });

    // Row click → switch chart
    this.container.querySelectorAll('.mkt-row').forEach(row => {
      row.addEventListener('click', () => this.switchAsset(row.dataset.symbol));
      row.addEventListener('mouseover', () => row.style.background = 'rgba(15,23,42,0.025)');
      row.addEventListener('mouseout', () => row.style.background = '');
    });
  }

  initStocksWidget() {
    const iframe = this.container.querySelector('#stocks-iframe');
    if (!iframe) return;

    // The ONLY reliable way to inject TradingView into a Vanilla JS SPA:
    // Use srcdoc with a complete self-contained HTML document.
    const config = JSON.stringify({
      "width":  "100%",
      "height": "100%",
      "defaultColumn": "overview",
      "defaultScreen": "most_capitalized",
      "market": "america",
      "showToolbar": true,
      "colorTheme": "light",
      "locale": "es",
      "isTransparent": true
    });

    iframe.srcdoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { width:100%; height:100%; overflow:hidden; background:transparent; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; }
  .tradingview-widget-container { width:100%; height:100%; }
</style>
</head>
<body>
<div class="tradingview-widget-container">
  <div class="tradingview-widget-container__widget"></div>
  <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-screener.js" async>
${config}
  </script>
</div>
</body>
</html>`;
  }

  bindSorting() {
    this.container.querySelectorAll('.sort-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const col = btn.dataset.col;
        const listEl = this.container.querySelector('#crypto-list');
        if (!listEl) return;

        const rows = Array.from(listEl.querySelectorAll('.mkt-row'));

        if (col === 'name') {
          // Reset to original rank order
          rows.sort((a, b) => parseInt(a.dataset.rank) - parseInt(b.dataset.rank));
          this.sortState = { column: null, asc: false };
        } else {
          const toggleAsc = this.sortState.column === col ? !this.sortState.asc : false;
          this.sortState = { column: col, asc: toggleAsc };
          rows.sort((a, b) => {
            const va = parseFloat(a.dataset[col]) || 0;
            const vb = parseFloat(b.dataset[col]) || 0;
            return this.sortState.asc ? va - vb : vb - va;
          });
        }

        rows.forEach(r => listEl.appendChild(r));
      });
    });
  }

  async initChart() {
    const el = this.container.querySelector('#tv-chart');
    if (!el || this._destroyed) return;

    this.chart = LightweightCharts.createChart(el, {
      width: el.clientWidth,
      height: 200,
      layout: { background: { type: 'solid', color: 'transparent' }, textColor: '#94A3B8' },
      grid: { vertLines: { visible: false }, horzLines: { color: 'rgba(15,23,42,0.05)' } },
      rightPriceScale: { borderVisible: false, scaleMargins: { top: 0.1, bottom: 0.1 } },
      timeScale: { borderVisible: false, timeVisible: true, fixLeftEdge: true, fixRightEdge: true },
      handleScroll: { mouseWheel: false, pressedMouseMove: true },
      handleScale: { mouseWheel: false, pinch: true, axisPressedMouseMove: false },
      crosshair: { horzLine: { visible: true }, vertLine: { visible: true } },
    });

    this.lineSeries = this.chart.addAreaSeries({
      lineColor: '#10B981',
      topColor: 'rgba(16,185,129,0.35)',
      bottomColor: 'rgba(16,185,129,0.0)',
      lineWidth: 2,
      crosshairMarkerRadius: 5,
    });

    const resizeObs = new ResizeObserver(() => {
      if (this.chart && el.clientWidth > 0) this.chart.applyOptions({ width: el.clientWidth });
    });
    resizeObs.observe(el);
    this._resizeObs = resizeObs;

    await this.switchAsset(this.currentSymbol);
  }

  async fetchKlines(symbol) {
    try {
      const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=15m&limit=96`);
      const raw = await res.json();
      return raw.map(d => ({ time: d[0] / 1000, value: parseFloat(d[4]) }));
    } catch {
      return [];
    }
  }

  async switchAsset(symbol) {
    this.currentSymbol = symbol;
    const asset = this.assets.find(a => a.symbol === symbol);
    if (!asset) return;

    // Highlight row
    this.container.querySelectorAll('.mkt-row').forEach(r => {
      r.style.background = r.dataset.symbol === symbol ? 'rgba(99,102,241,0.06)' : '';
    });

    // Update chart header
    const nameEl   = this.container.querySelector('#chart-name');
    const symEl    = this.container.querySelector('#chart-symbol');
    const iconEl   = this.container.querySelector('#chart-icon');
    const priceEl  = this.container.querySelector('#chart-price');
    const changeEl = this.container.querySelector('#chart-change');

    if (nameEl)  nameEl.textContent  = asset.name;
    if (symEl)   symEl.textContent   = asset.baseAsset;
    if (iconEl)  iconEl.src = `https://assets.coincap.io/assets/icons/${asset.baseAsset.toLowerCase()}@2x.png`;
    if (priceEl) priceEl.textContent = this.formatPrice(asset.price);
    if (changeEl) {
      const pos = asset.change >= 0;
      changeEl.style.color = pos ? '#10B981' : '#EF4444';
      changeEl.innerHTML = `<i data-lucide="${pos ? 'trending-up' : 'trending-down'}" style="width:14px;height:14px;"></i> ${pos ? '+' : ''}${asset.change.toFixed(2)}%`;
      createIcons({ icons, nameAttr: 'data-lucide', root: changeEl });
    }

    // Load kline data into chart
    if (this.lineSeries) {
      const klines = await this.fetchKlines(symbol);
      if (klines.length > 1) {
        this.lineSeries.setData(klines);
        this.chart?.timeScale().fitContent();
      }
    }
  }

  initWebSocket() {
    const rowsMap = new Map();
    this.container.querySelectorAll('.mkt-row').forEach(row => {
      const sym = row.dataset.symbol;
      rowsMap.set(sym, {
        row: row,
        priceEl: this.container.querySelector(`#price-${sym}`),
        changeEl: this.container.querySelector(`#change-${sym}`)
      });
    });

    const connect = () => {
      if (this._destroyed) return;
      
      // Combine 100 specific streams to get ultra-fast updates without 5MB/sec overload
      const streams = this.assets.map(a => a.symbol.toLowerCase() + '@ticker').join('/');
      const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);
      this.ws = ws;

      let tickCount = 0;

      ws.onopen = () => {
        const dot   = this.container.querySelector('#ws-dot');
        const label = this.container.querySelector('#ws-label');
        if (dot)   dot.style.background = '#10B981';
        if (label) label.textContent = 'En vivo · Pro Stream';
      };

      ws.onmessage = (event) => {
        if (this._destroyed) return;
        let payload;
        try { payload = JSON.parse(event.data); } catch { return; }

        // Update debug badge so user knows it's receiving
        tickCount++;
        const badge = this.container.querySelector('#debug-badge');
        if (badge) badge.textContent = `V35 (${tickCount})`;

        const ticker = payload.data;
        if (!ticker) return;

        const dom = rowsMap.get(ticker.s);
        if (!dom) return;

        const price     = parseFloat(ticker.c);
        const changePct = parseFloat(ticker.P);

        if (dom.priceEl && dom.changeEl) {
          dom.row.dataset.price  = price;
          dom.row.dataset.change = changePct;

          const prev = parseFloat(dom.priceEl.dataset.raw) || 0;
          if (price !== prev) {
            dom.priceEl.style.transition = 'color 0.1s';
            dom.priceEl.style.color = price > prev ? '#10B981' : '#EF4444';
            setTimeout(() => { if (dom.priceEl) dom.priceEl.style.color = ''; }, 300);
          }
          dom.priceEl.dataset.raw  = price;
          dom.priceEl.textContent  = this.formatPrice(price);

          const pos = changePct >= 0;
          dom.changeEl.style.color  = pos ? '#10B981' : '#EF4444';
          dom.changeEl.textContent  = (pos ? '+' : '') + changePct.toFixed(2) + '%';
        }

        if (ticker.s === this.currentSymbol) {
          const chartPriceEl  = this.container.querySelector('#chart-price');
          const chartChangeEl = this.container.querySelector('#chart-change');

          if (chartPriceEl) chartPriceEl.textContent = this.formatPrice(price);
          if (chartChangeEl) {
            const pos = changePct >= 0;
            chartChangeEl.style.color = pos ? '#10B981' : '#EF4444';
            chartChangeEl.innerHTML = `<i data-lucide="${pos ? 'trending-up' : 'trending-down'}" style="width:14px;height:14px;"></i> ${pos ? '+' : ''}${changePct.toFixed(2)}%`;
            createIcons({ icons, nameAttr: 'data-lucide', root: chartChangeEl });
          }

          if (this.lineSeries) {
            try { this.lineSeries.update({ time: Math.floor(Date.now() / 1000), value: price }); } catch { }
          }

          const glow = this.container.querySelector('#chart-glow');
          if (glow) glow.style.background = changePct >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)';
        }
      };

      ws.onerror  = () => ws.close();
      ws.onclose  = () => {
        if (this._destroyed) return;
        const dot   = this.container.querySelector('#ws-dot');
        const label = this.container.querySelector('#ws-label');
        if (dot)   dot.style.background = '#F59E0B';
        if (label) label.textContent = 'Reconectando...';
        setTimeout(connect, 3000);
      };
    };

    connect();
  }


  destroy() {
    this._destroyed = true;
    if (this.ws)   { this.ws.close(); this.ws = null; }
    if (this.chart){ this.chart.remove(); this.chart = null; }
    if (this._resizeObs) { this._resizeObs.disconnect(); this._resizeObs = null; }
    this.container.innerHTML = '';
  }
}
