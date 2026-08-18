import { createIcons, icons } from 'lucide';

// Lightweight Charts is imported dynamically via CDN in the code to keep it modular
let LightweightCharts = null;

export class MarketsView {
  constructor(container) {
    this.container = container;
    this.ws = null;
    this.chart = null;
    this.lineSeries = null;
    this.currentSymbol = 'BTCUSDT';
    
    // Top assets to track in real-time
    this.assets = [
      { symbol: 'BTCUSDT', name: 'Bitcoin', icon: '₿', color: '#F7931A' },
      { symbol: 'ETHUSDT', name: 'Ethereum', icon: 'Ξ', color: '#627EEA' },
      { symbol: 'SOLUSDT', name: 'Solana', icon: 'S', color: '#14F195' },
      { symbol: 'BNBUSDT', name: 'BNB', icon: 'B', color: '#F3BA2F' }
    ];
  }

  async init() {
    this.renderSkeleton();
    
    // Start WebSocket IMMEDIATELY, don't wait for chart libraries
    this.render();
    this.initWebSocket();
    
    // Load Lightweight Charts dynamically
    try {
      if (!LightweightCharts) {
        LightweightCharts = await import('https://cdn.jsdelivr.net/npm/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.mjs');
      }
      await this.initChart();
    } catch (err) {
      console.error('Error loading lightweight-charts', err);
      // Even if chart fails, live prices will still work because WS is decoupled
    }
  }

  renderSkeleton() {
    this.container.innerHTML = `
      <div style="padding: 24px; padding-top: 60px; color: #FFFFFF; min-height: 100vh; background: #020617;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h1 style="font-size: 1.8rem; font-weight: 800; margin: 0; letter-spacing: -0.03em;">Mercados</h1>
          <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center;">
            <i data-lucide="search" style="width: 20px; height: 20px;"></i>
          </div>
        </div>
        <div style="height: 300px; background: rgba(255,255,255,0.05); border-radius: 20px; margin-bottom: 24px; animation: pulse 1.5s infinite;"></div>
        <div style="display: flex; gap: 12px; overflow-x: auto; padding-bottom: 12px;">
          <div style="min-width: 140px; height: 160px; background: rgba(255,255,255,0.05); border-radius: 16px;"></div>
          <div style="min-width: 140px; height: 160px; background: rgba(255,255,255,0.05); border-radius: 16px;"></div>
        </div>
      </div>
    `;
    createIcons({ icons, nameAttr: 'data-lucide', root: this.container });
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
            <i data-lucide="bell" style="width: 18px; height: 18px;"></i>
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

        <!-- Watchlist -->
        <h3 style="font-size: 1.05rem; font-weight: 800; margin-bottom: 14px; color: var(--ink);">Tendencias (Watchlist)</h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;" id="watchlist-grid">
          ${this.assets.map(asset => `
            <div class="watchlist-card" data-symbol="${asset.symbol}" style="
              background: #FFFFFF;
              border: 1.5px solid rgba(15, 23, 42, 0.05);
              border-radius: 18px;
              padding: 14px;
              cursor: pointer;
              transition: all 0.2s;
              box-shadow: 0 4px 12px rgba(0,0,0,0.02);
            ">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <div style="width: 26px; height: 26px; border-radius: 50%; background: ${asset.color}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.75rem; color: #FFF;">
                    ${asset.icon}
                  </div>
                  <span style="font-weight: 700; font-size: 0.8rem; color: var(--ink-80);">${asset.name}</span>
                </div>
              </div>
              <div style="font-size: 1.1rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 2px; color: var(--ink);" id="price-${asset.symbol}">
                ---
              </div>
              <div style="font-size: 0.72rem; font-weight: 700; color: var(--ink-40);" id="change-${asset.symbol}">
                ---
              </div>
            </div>
          `).join('')}
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
        c.style.border = '1.5px solid #4F46E5';
        c.style.background = '#EEF2FF';
        c.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.1)';
      } else {
        c.style.border = '1.5px solid rgba(15, 23, 42, 0.05)';
        c.style.background = '#FFFFFF';
        c.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)';
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
          setTimeout(() => priceEl.style.color = '#FFFFFF', 300);
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