import { createIcons, icons } from 'lucide';

// Lightweight Charts is imported dynamically via CDN in the code to keep it modular
let LightweightCharts = null;

export class MarketsView {
  constructor(container) {
    this.container = container;
    this.currentSymbol = 'BTCUSDT';
    this.assets = [
      { symbol: 'BTCUSDT', name: 'Bitcoin', icon: '₿', color: '#F7931A' },
      { symbol: 'ETHUSDT', name: 'Ethereum', icon: 'Ξ', color: '#627EEA' },
      { symbol: 'BNBUSDT', name: 'BNB', icon: 'B', color: '#F3BA2F' },
      { symbol: 'SOLUSDT', name: 'Solana', icon: 'S', color: '#14F195' },
      { symbol: 'XRPUSDT', name: 'Ripple', icon: '✕', color: '#23292F' },
      { symbol: 'DOGEUSDT', name: 'Dogecoin', icon: 'Ð', color: '#C2A633' },
      { symbol: 'ADAUSDT', name: 'Cardano', icon: '₳', color: '#0033AD' },
      { symbol: 'TRXUSDT', name: 'TRON', icon: 'T', color: '#FF0013' },
      { symbol: 'LINKUSDT', name: 'Chainlink', icon: 'L', color: '#2A5ADA' },
      { symbol: 'DOTUSDT', name: 'Polkadot', icon: 'P', color: '#E6007A' },
      { symbol: 'MATICUSDT', name: 'Polygon', icon: 'M', color: '#8247E5' }
    ];
    this.ws = null;
    this.chart = null;
    this.lineSeries = null;
  }

  async init() {
    this.renderSkeleton();
    
    // Start WebSocket IMMEDIATELY, don't wait for chart libraries
    this.render();
    this.initWebSocket();
    this.initStocksWidget();
    
    // Load Lightweight Charts dynamically
    try {
      if (!LightweightCharts) {
        LightweightCharts = await import('https://cdn.jsdelivr.net/npm/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.mjs');
      }
      await this.initChart();
    } catch (err) {
      console.error('Error loading lightweight-charts', err);
    }
  }

  renderSkeleton() {
    this.container.innerHTML = `
      <div style="padding: 24px; padding-top: 50px; text-align: center; color: var(--ink-40);">
        <i data-lucide="loader" style="width: 32px; height: 32px; animation: spin 2s linear infinite; margin-bottom: 12px;"></i>
        <p style="font-size: 0.9rem; font-weight: 600;">Conectando a los mercados en vivo...</p>
      </div>
    `;
    if (typeof createIcons !== 'undefined') createIcons({ icons, nameAttr: 'data-lucide', root: this.container });
  }

  render() {
    this.container.innerHTML = `
      <div style="padding-bottom: 130px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <div>
            <h1 style="font-size: 1.6rem; font-weight: 800; margin: 0; color: var(--ink);">Mercados</h1>
            <div style="display: flex; align-items: center; gap: 6px; margin-top: 4px;">
              <span style="display: inline-block; width: 8px; height: 8px; background: #10B981; border-radius: 50%; box-shadow: 0 0 6px rgba(16, 185, 129, 0.5);"></span>
              <span style="font-size: 0.72rem; color: var(--ink-60); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Tiempo Real · Binance</span>
            </div>
          </div>
          <button style="width: 40px; height: 40px; border-radius: 50%; background: #FFFFFF; border: 1px solid rgba(15, 23, 42, 0.08); color: var(--ink); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
            <i data-lucide="search" style="width: 18px; height: 18px;"></i>
          </button>
        </div>

        <!-- Main Chart Card (Light Glassmorphism) -->
        <div style="
          background: #FFFFFF;
          border: 1px solid rgba(15, 23, 42, 0.06);
          border-radius: 24px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
          position: relative;
          overflow: hidden;
        ">
          <!-- Active Asset Info -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; position: relative; z-index: 2;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <div style="width: 24px; height: 24px; border-radius: 50%; background: #F7931A; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem; color: #FFF;" id="chart-asset-icon">₿</div>
                <span style="font-weight: 700; color: var(--ink-80); font-size: 1rem;" id="chart-asset-name">Bitcoin</span>
                <span style="font-size: 0.7rem; background: var(--bg-color); padding: 2px 6px; border-radius: 6px; color: var(--ink-60); font-weight: 600;">BTC</span>
              </div>
              <div style="font-size: 2.1rem; font-weight: 800; letter-spacing: -0.04em; color: var(--ink);" id="chart-live-price">
                Cargando...
              </div>
              <div style="font-size: 0.85rem; font-weight: 700; color: #10B981; display: flex; align-items: center; gap: 4px; margin-top: 2px;" id="chart-live-change">
                <i data-lucide="loader" style="width: 14px; height: 14px; animation: spin 2s linear infinite;"></i>
                ---
              </div>
            </div>
          </div>

          <!-- Chart Container -->
          <div id="tv-chart" style="width: 100%; height: 220px; position: relative; z-index: 2;"></div>
          
          <!-- Background Glow -->
          <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: rgba(16, 185, 129, 0.08); border-radius: 50%; filter: blur(40px); z-index: 0;" id="chart-glow"></div>
        </div>

        <!-- Crypto List (CoinMarketCap Style) -->
        <h3 style="font-size: 1.05rem; font-weight: 800; margin-bottom: 14px; color: var(--ink);">Criptomonedas (Top 10)</h3>
        
        <div style="background: #FFFFFF; border: 1.5px solid rgba(15, 23, 42, 0.05); border-radius: 20px; padding: 16px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.02); margin-bottom: 24px;">
           <div style="display: flex; justify-content: space-between; padding-bottom: 12px; border-bottom: 1px solid rgba(15, 23, 42, 0.06); font-size: 0.7rem; color: var(--ink-40); font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em;">
             <span style="flex: 1.5; padding-left: 8px;">Activo</span>
             <span style="flex: 1; text-align: right;">Precio</span>
             <span style="flex: 1; text-align: right; padding-right: 8px;">24h %</span>
           </div>
           
           <div id="crypto-list">
             ${this.assets.map((asset, index) => `
               <div class="watchlist-card" data-symbol="${asset.symbol}" style="
                 display: flex; justify-content: space-between; align-items: center; 
                 padding: 12px 8px; border-bottom: 1px solid rgba(15, 23, 42, 0.03); 
                 cursor: pointer; transition: all 0.2s; border-radius: 10px;
                 margin-top: 4px;
               ">
                 <div style="flex: 1.5; display: flex; align-items: center; gap: 10px;">
                   <span style="font-size: 0.75rem; color: var(--ink-40); font-weight: 700; width: 14px;">${index + 1}</span>
                   <div style="width: 30px; height: 30px; border-radius: 50%; background: ${asset.color}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem; color: #FFF; box-shadow: 0 2px 6px rgba(0,0,0,0.08);">
                     ${asset.icon}
                   </div>
                   <div style="display: flex; flex-direction: column;">
                     <span style="font-weight: 800; font-size: 0.85rem; color: var(--ink); line-height: 1.2;">${asset.name}</span>
                     <span style="font-size: 0.7rem; color: var(--ink-40); font-weight: 600;">${asset.symbol.replace('USDT', '')}</span>
                   </div>
                 </div>
                 <div style="flex: 1; text-align: right; font-weight: 800; font-size: 0.9rem; color: var(--ink);" id="price-${asset.symbol}">
                   ---
                 </div>
                 <div style="flex: 1; text-align: right; font-weight: 700; font-size: 0.8rem; padding-right: 4px;" id="change-${asset.symbol}">
                   ---
                 </div>
               </div>
             `).join('')}
           </div>
        </div>

        <!-- Global Stocks Section -->
        <div style="margin-top: 10px;">
          <h3 style="font-size: 1.05rem; font-weight: 800; margin-bottom: 14px; color: var(--ink);">Acciones Globales</h3>
          <div id="stocks-widget-container" style="background: #FFFFFF; border: 1.5px solid rgba(15, 23, 42, 0.05); border-radius: 18px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.02); height: 500px; width: 100%;">
            <!-- Script will be injected here -->
          </div>
        </div>

      </div>
    `;

    createIcons({ icons, nameAttr: 'data-lucide', root: this.container });

    // Bind card clicks to change main chart
    this.container.querySelectorAll('.watchlist-card').forEach(card => {
      card.addEventListener('click', () => {
        const symbol = card.getAttribute('data-symbol');
        this.switchAsset(symbol);
      });
    });
  }

  async initChart() {
    const chartContainer = this.container.querySelector('#tv-chart');
    if (!chartContainer) return;

    this.chart = LightweightCharts.createChart(chartContainer, {
      width: chartContainer.clientWidth,
      height: 220,
      layout: {
        background: { type: 'solid', color: 'transparent' },
        textColor: '#64748B',
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: 'rgba(255, 255, 255, 0.04)' },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        vertLine: { color: 'rgba(255,255,255,0.4)', width: 1, style: 3 },
        horzLine: { color: 'rgba(255,255,255,0.4)', width: 1, style: 3 },
      },
      handleScroll: { mouseWheel: false, pressedMouseMove: true },
      handleScale: { axisPressedMouseMove: false, mouseWheel: false, pinch: true },
    });

    this.lineSeries = this.chart.addAreaSeries({
      lineColor: '#10B981',
      topColor: 'rgba(16, 185, 129, 0.4)',
      bottomColor: 'rgba(16, 185, 129, 0.0)',
      lineWidth: 3,
      priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
    });

    // Resize handler
    window.addEventListener('resize', () => {
      if (this.chart && chartContainer) {
        this.chart.applyOptions({ width: chartContainer.clientWidth });
      }
    });

    this.switchAsset(this.currentSymbol);
  }

  async fetchHistoricalData(symbol) {
    try {
      // Fetch last 24h of 15m candles
      const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=15m&limit=96`);
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      
      const chartData = data.map(d => ({
        time: d[0] / 1000,
        value: parseFloat(d[4]) // Close price
      }));
      
      this.lineSeries.setData(chartData);
      this.chart.timeScale().fitContent();
    } catch (e) {
      console.error('Failed to load historical data', e);
      // Fallback: draw a straight line if API is blocked by CORS/Adblocker
      const now = Math.floor(Date.now() / 1000);
      this.lineSeries.setData([
        { time: now - 3600, value: 50000 },
        { time: now, value: 50000 }
      ]);
    }
  }

  initStocksWidget() {
    const container = this.container.querySelector('#stocks-widget-container');
    if (!container) return;

    const config = {
      "width": "100%",
      "height": "100%",
      "symbolsGroups": [
        {
          "name": "Tecnología",
          "originalName": "Technology",
          "symbols": [
            { "name": "NASDAQ:AAPL", "displayName": "Apple Inc." },
            { "name": "NASDAQ:NVDA", "displayName": "NVIDIA" },
            { "name": "NASDAQ:TSLA", "displayName": "Tesla" },
            { "name": "NASDAQ:MSFT", "displayName": "Microsoft" },
            { "name": "NASDAQ:AMZN", "displayName": "Amazon" },
            { "name": "NASDAQ:META", "displayName": "Meta" }
          ]
        },
        {
          "name": "Índices Mundiales",
          "originalName": "Indices",
          "symbols": [
            { "name": "FOREXCOM:SPXUSD", "displayName": "S&P 500" },
            { "name": "FOREXCOM:NSXUSD", "displayName": "Nasdaq 100" },
            { "name": "FOREXCOM:DJI", "displayName": "Dow Jones" }
          ]
        }
      ],
      "showSymbolLogo": true,
      "isTransparent": true,
      "colorTheme": "light",
      "locale": "es"
    };

    const iframeHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>body { margin: 0; padding: 0; overflow: hidden; background: transparent; }</style>
      </head>
      <body>
        <div class="tradingview-widget-container">
          <div class="tradingview-widget-container__widget"></div>
          <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js" async>
            ${JSON.stringify(config)}
          </script>
        </div>
      </body>
      </html>
    `;

    container.innerHTML = `<iframe srcdoc='${iframeHtml.replace(/'/g, "&#39;")}' style="width: 100%; height: 100%; border: none;" scrolling="no"></iframe>`;
  }

  switchAsset(symbol) {
    this.currentSymbol = symbol;
    const asset = this.assets.find(a => a.symbol === symbol);
    if (!asset) return;

    // Update UI Header
    this.container.querySelector('#chart-asset-name').textContent = asset.name;
    this.container.querySelector('#chart-asset-icon').textContent = asset.icon;
    this.container.querySelector('#chart-asset-icon').style.background = asset.color;

    // Reset chart data
    this.fetchHistoricalData(symbol);
    
    // Update active styles
    this.container.querySelectorAll('.watchlist-card').forEach(c => {
      if (c.getAttribute('data-symbol') === symbol) {
        c.style.background = '#EEF2FF';
        c.style.borderBottom = '1px solid #4F46E5';
        c.style.boxShadow = 'inset 4px 0 0 #4F46E5';
      } else {
        c.style.background = 'transparent';
        c.style.borderBottom = '1px solid rgba(15, 23, 42, 0.03)';
        c.style.boxShadow = 'none';
      }
    });
  }

  initWebSocket() {
    // Combine streams: all mini-tickers for the watchlist, plus the trade stream for the active chart
    const streams = this.assets.map(a => `${a.symbol.toLowerCase()}@miniTicker`).join('/');
    const wsUrl = `wss://stream.binance.com/stream?streams=${streams}`;
    
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (!payload.data) return;
      
      const stream = payload.stream;
      const data = payload.data;
      
      // Data is from @miniTicker (updates every second)
      // data.s = Symbol, data.c = Close Price, data.o = Open Price (24h)
      const symbol = data.s;
      const price = parseFloat(data.c);
      const openPrice = parseFloat(data.o);
      const changePct = ((price - openPrice) / openPrice) * 100;
      
      // Formatters
      const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
      const isPositive = changePct >= 0;
      const formattedChange = `${isPositive ? '+' : ''}${changePct.toFixed(2)}%`;
      const color = isPositive ? '#10B981' : '#EF4444'; // Green or Red
      const icon = isPositive ? 'trending-up' : 'trending-down';

      // 1. Update Watchlist Card
      const priceEl = this.container.querySelector(`#price-${symbol}`);
      const changeEl = this.container.querySelector(`#change-${symbol}`);
      if (priceEl && changeEl) {
        // Flash animation
        const oldPrice = priceEl.getAttribute('data-raw') || 0;
        if (price !== parseFloat(oldPrice)) {
          priceEl.style.color = price > oldPrice ? '#10B981' : '#EF4444';
          setTimeout(() => priceEl.style.color = '', 300); // FIXED: reset to CSS default, not white!
        }
        priceEl.setAttribute('data-raw', price);
        priceEl.textContent = formattedPrice;
        
        changeEl.style.color = color;
        changeEl.textContent = formattedChange;
      }

      // 2. Update Main Chart (if it's the active symbol)
      if (symbol === this.currentSymbol) {
        const livePriceEl = this.container.querySelector('#chart-live-price');
        const liveChangeEl = this.container.querySelector('#chart-live-change');
        
        if (livePriceEl && liveChangeEl) {
          livePriceEl.textContent = formattedPrice;
          liveChangeEl.style.color = color;
          liveChangeEl.innerHTML = `<i data-lucide="${icon}" style="width: 18px; height: 18px;"></i> ${formattedChange}`;
          createIcons({ icons, nameAttr: 'data-lucide', root: liveChangeEl });
        }

        // Update Lightweight Chart Live Point
        if (this.lineSeries) {
          const timestamp = Math.floor(Date.now() / 1000);
          this.lineSeries.update({
            time: timestamp,
            value: price
          });
          
          // Dynamically change chart color based on 24h trend
          this.lineSeries.applyOptions({
            lineColor: color,
            topColor: isPositive ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)',
            bottomColor: isPositive ? 'rgba(16, 185, 129, 0.0)' : 'rgba(239, 68, 68, 0.0)',
          });
          
          const glow = this.container.querySelector('#chart-glow');
          if (glow) {
            glow.style.background = isPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
          }
        }
      }
    };
    
    this.ws.onclose = () => {
      console.log('Binance WS closed, attempting reconnect in 3s...');
      setTimeout(() => this.initWebSocket(), 3000);
    };
  }

  destroy() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.chart) {
      this.chart.remove();
      this.chart = null;
    }
    this.container.innerHTML = '';
  }
}