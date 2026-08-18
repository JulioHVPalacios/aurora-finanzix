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
  }

  async init() {
    this.renderSkeleton();
    
    await this.fetchTopCryptos();
    this.render();
    this.initWebSocket();
    this.initStocksWidget();
    
    try {
      if (!LightweightCharts) {
        LightweightCharts = await import('https://cdn.jsdelivr.net/npm/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.mjs');
      }
      await this.initChart();
    } catch (err) {
      console.error('Error loading lightweight-charts', err);
    }
  }

  async fetchTopCryptos() {
    try {
      const res = await fetch('https://api.binance.com/api/v3/ticker/24hr');
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      
      let usdtPairs = data.filter(d => d.symbol.endsWith('USDT') && !['USDTUSDT', 'USDCUSDT', 'TUSDUSDT', 'FDUSDUSDT'].includes(d.symbol));
      usdtPairs.sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume));
      
      const nameMap = { 'BTC': 'Bitcoin', 'ETH': 'Ethereum', 'BNB': 'BNB', 'SOL': 'Solana', 'XRP': 'Ripple', 'ADA': 'Cardano', 'DOGE': 'Dogecoin', 'TRX': 'TRON', 'LINK': 'Chainlink', 'DOT': 'Polkadot', 'MATIC': 'Polygon', 'LTC': 'Litecoin', 'SHIB': 'Shiba Inu', 'AVAX': 'Avalanche', 'BCH': 'Bitcoin Cash', 'XLM': 'Stellar', 'ATOM': 'Cosmos', 'UNI': 'Uniswap', 'NEAR': 'NEAR Protocol', 'APT': 'Aptos', 'ARB': 'Arbitrum', 'OP': 'Optimism', 'INJ': 'Injective', 'RNDR': 'Render', 'PEPE': 'Pepe', 'SUI': 'Sui', 'WIF': 'Dogwifhat' };

      this.assets = usdtPairs.slice(0, 100).map((d, index) => {
        const base = d.symbol.replace('USDT', '');
        return {
          symbol: d.symbol,
          baseAsset: base,
          name: nameMap[base] || base,
          price: parseFloat(d.lastPrice),
          change: parseFloat(d.priceChangePercent),
          rank: index + 1
        };
      });
    } catch (e) {
      console.error('Failed to fetch cryptos', e);
      this.assets = [
        { symbol: 'BTCUSDT', baseAsset: 'BTC', name: 'Bitcoin', price: 60000, change: 0, rank: 1 },
        { symbol: 'ETHUSDT', baseAsset: 'ETH', name: 'Ethereum', price: 3000, change: 0, rank: 2 },
        { symbol: 'SOLUSDT', baseAsset: 'SOL', name: 'Solana', price: 150, change: 0, rank: 3 }
      ];
    }
  }

  renderSkeleton() {
    this.container.innerHTML = `
      <div style="padding: 24px; padding-top: 50px; text-align: center; color: var(--ink-40);">
        <i data-lucide="loader" style="width: 32px; height: 32px; animation: spin 2s linear infinite; margin-bottom: 12px;"></i>
        <p style="font-size: 0.9rem; font-weight: 600;">Descargando Top 100 Global...</p>
      </div>
    `;
    if (typeof createIcons !== 'undefined') createIcons({ icons, nameAttr: 'data-lucide', root: this.container });
  }

  render() {
    const activeAsset = this.assets.find(a => a.symbol === this.currentSymbol) || this.assets[0];

    this.container.innerHTML = `
      <div style="padding-bottom: 130px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <div>
            <h1 style="font-size: 1.6rem; font-weight: 800; margin: 0; color: var(--ink);">Mercados</h1>
            <div style="display: flex; align-items: center; gap: 6px; margin-top: 4px;">
              <span style="display: inline-block; width: 8px; height: 8px; background: #10B981; border-radius: 50%; box-shadow: 0 0 6px rgba(16, 185, 129, 0.5);"></span>
              <span style="font-size: 0.72rem; color: var(--ink-60); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Tiempo Real · Binance 100</span>
            </div>
          </div>
        </div>

        <div style="background: #FFFFFF; border: 1px solid rgba(15, 23, 42, 0.06); border-radius: 24px; padding: 20px; margin-bottom: 24px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03); position: relative; overflow: hidden;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; position: relative; z-index: 2;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <img src="https://assets.coincap.io/assets/icons/${activeAsset.baseAsset.toLowerCase()}@2x.png" onerror="this.src='https://cryptologos.cc/logos/bitcoin-btc-logo.png'" style="width: 24px; height: 24px; border-radius: 50%;" id="chart-asset-icon">
                <span style="font-weight: 700; color: var(--ink-80); font-size: 1rem;" id="chart-asset-name">${activeAsset.name}</span>
                <span style="font-size: 0.7rem; background: var(--bg-color); padding: 2px 6px; border-radius: 6px; color: var(--ink-60); font-weight: 600;" id="chart-asset-symbol">${activeAsset.baseAsset}</span>
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

          <div id="tv-chart" style="width: 100%; height: 220px; position: relative; z-index: 2;"></div>
          <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: rgba(16, 185, 129, 0.08); border-radius: 50%; filter: blur(40px); z-index: 0;" id="chart-glow"></div>
        </div>

        <h3 style="font-size: 1.05rem; font-weight: 800; margin-bottom: 10px; color: var(--ink);">Mercado de Criptomonedas</h3>
        <div style="position: relative; margin-bottom: 12px;">
          <i data-lucide="search" style="position: absolute; left: 14px; top: 12px; width: 16px; height: 16px; color: var(--ink-40);"></i>
          <input type="text" id="crypto-search" placeholder="Buscar entre las Top 100..." style="width: 100%; padding: 12px 12px 12px 38px; border-radius: 14px; border: 1px solid rgba(15, 23, 42, 0.1); font-size: 0.85rem; background: #FFFFFF; color: var(--ink); outline: none;">
        </div>
        
        <div style="background: #FFFFFF; border: 1.5px solid rgba(15, 23, 42, 0.05); border-radius: 20px; padding: 12px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.02); margin-bottom: 24px; overflow: hidden;">
           <div style="display: flex; justify-content: space-between; padding: 0 16px 12px 16px; border-bottom: 1px solid rgba(15, 23, 42, 0.06); font-size: 0.7rem; color: var(--ink-40); font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em;">
             <span style="flex: 1.5;">Activo</span>
             <span style="flex: 1; text-align: right;">Precio</span>
             <span style="flex: 1; text-align: right;">24h %</span>
           </div>
           
           <div id="crypto-list" style="max-height: 450px; overflow-y: auto; padding: 0 8px; scrollbar-width: none;">
             ${this.assets.map((asset) => `
               <div class="crypto-row" data-symbol="${asset.symbol}" data-name="${asset.name}" style="
                 display: flex; justify-content: space-between; align-items: center; 
                 padding: 12px 8px; border-bottom: 1px solid rgba(15, 23, 42, 0.03); 
                 cursor: pointer; transition: background 0.1s; border-radius: 10px;
               " onmouseover="this.style.background='rgba(15, 23, 42, 0.02)'" onmouseout="this.style.background='transparent'">
                 <div style="flex: 1.5; display: flex; align-items: center; gap: 10px;">
                   <span style="font-size: 0.75rem; color: var(--ink-40); font-weight: 700; width: 18px; text-align: center;">${asset.rank}</span>
                   <img src="https://assets.coincap.io/assets/icons/${asset.baseAsset.toLowerCase()}@2x.png" onerror="this.src='https://cryptologos.cc/logos/bitcoin-btc-logo.png'" style="width: 28px; height: 28px; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                   <div style="display: flex; flex-direction: column;">
                     <span style="font-weight: 800; font-size: 0.85rem; color: var(--ink); line-height: 1.2;">${asset.name}</span>
                     <span style="font-size: 0.7rem; color: var(--ink-40); font-weight: 600;">${asset.baseAsset}</span>
                   </div>
                 </div>
                 <div style="flex: 1; text-align: right; font-weight: 800; font-size: 0.9rem; color: var(--ink);" id="price-${asset.symbol}">
                   ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(asset.price)}
                 </div>
                 <div style="flex: 1; text-align: right; font-weight: 700; font-size: 0.8rem; color: ${asset.change >= 0 ? '#10B981' : '#EF4444'};" id="change-${asset.symbol}">
                   ${asset.change >= 0 ? '+' : ''}${asset.change.toFixed(2)}%
                 </div>
               </div>
             `).join('')}
           </div>
        </div>

        <div style="margin-top: 10px;">
          <h3 style="font-size: 1.05rem; font-weight: 800; margin-bottom: 14px; color: var(--ink);">Acciones Globales (Screener)</h3>
          <div id="stocks-widget-container" style="background: #FFFFFF; border: 1.5px solid rgba(15, 23, 42, 0.05); border-radius: 20px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.02); height: 600px; width: 100%;">
          </div>
        </div>
      </div>
    `;

    createIcons({ icons, nameAttr: 'data-lucide', root: this.container });

    const searchInput = this.container.querySelector('#crypto-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        this.container.querySelectorAll('.crypto-row').forEach(row => {
          const symbol = row.getAttribute('data-symbol').toLowerCase();
          const name = row.getAttribute('data-name').toLowerCase();
          row.style.display = (symbol.includes(val) || name.includes(val)) ? 'flex' : 'none';
        });
      });
    }

    this.container.querySelectorAll('.crypto-row').forEach(card => {
      card.addEventListener('click', () => {
        const symbol = card.getAttribute('data-symbol');
        this.switchAsset(symbol);
        this.container.querySelectorAll('.crypto-row').forEach(c => c.style.background = 'transparent');
        card.style.background = '#EEF2FF';
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
        horzLines: { color: 'rgba(15, 23, 42, 0.05)' },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      handleScroll: { mouseWheel: false, pressedMouseMove: true },
      handleScale: { axisPressedMouseMove: false, mouseWheel: false, pinch: true },
    });

    this.lineSeries = this.chart.addAreaSeries({
      lineColor: '#10B981',
      topColor: 'rgba(16, 185, 129, 0.4)',
      bottomColor: 'rgba(16, 185, 129, 0.0)',
      lineWidth: 3,
      crosshairMarkerRadius: 6,
    });

    window.addEventListener('resize', () => {
      if (this.chart && chartContainer) {
        this.chart.applyOptions({ width: chartContainer.clientWidth });
      }
    });

    this.switchAsset(this.currentSymbol);
  }

  async fetchHistoricalData(symbol) {
    try {
      const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=15m&limit=96`);
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      
      const chartData = data.map(d => ({
        time: d[0] / 1000,
        value: parseFloat(d[4])
      }));
      
      this.lineSeries.setData(chartData);
      this.chart.timeScale().fitContent();
    } catch (e) {
      console.error('Failed to load historical data', e);
      const now = Math.floor(Date.now() / 1000);
      this.lineSeries.setData([{ time: now - 3600, value: 100 }, { time: now, value: 100 }]);
    }
  }

  initStocksWidget() {
    const container = this.container.querySelector('#stocks-widget-container');
    if (!container) return;

    const config = {
      "width": "100%",
      "height": "100%",
      "defaultColumn": "overview",
      "defaultScreen": "most_capitalized",
      "market": "america",
      "showToolbar": true,
      "colorTheme": "light",
      "locale": "es",
      "isTransparent": true
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
          <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-screener.js" async>
            ${JSON.stringify(config)}
          </script>
        </div>
      </body>
      </html>
    `;

    container.innerHTML = `<iframe srcdoc='${iframeHtml.replace(/'/g, "&#39;")}' style="width: 100%; height: 100%; border: none;" scrolling="no"></iframe>`;
  }

  initWebSocket() {
    const wsUrl = `wss://stream.binance.com/ws/!miniTicker@arr`;
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      for (const ticker of data) {
        const symbol = ticker.s;
        const price = parseFloat(ticker.c);
        const changePct = parseFloat(ticker.P);
        
        const priceEl = this.container.querySelector(`#price-${symbol}`);
        const changeEl = this.container.querySelector(`#change-${symbol}`);
        
        if (priceEl && changeEl) {
          const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
          const isPositive = changePct >= 0;
          const formattedChange = `${isPositive ? '+' : ''}${changePct.toFixed(2)}%`;
          const color = isPositive ? '#10B981' : '#EF4444';

          const oldPrice = priceEl.getAttribute('data-raw') || 0;
          if (price !== parseFloat(oldPrice)) {
            priceEl.style.color = price > oldPrice ? '#10B981' : '#EF4444';
            setTimeout(() => priceEl.style.color = '', 300);
          }
          priceEl.setAttribute('data-raw', price);
          priceEl.textContent = formattedPrice;
          changeEl.style.color = color;
          changeEl.textContent = formattedChange;
        }

        if (symbol === this.currentSymbol) {
          const livePriceEl = this.container.querySelector('#chart-live-price');
          const liveChangeEl = this.container.querySelector('#chart-live-change');
          
          if (livePriceEl && liveChangeEl) {
            const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
            const isPositive = changePct >= 0;
            const color = isPositive ? '#10B981' : '#EF4444';
            const icon = isPositive ? 'trending-up' : 'trending-down';

            livePriceEl.textContent = formattedPrice;
            liveChangeEl.style.color = color;
            liveChangeEl.innerHTML = `<i data-lucide="${icon}" style="width: 18px; height: 18px;"></i> ${isPositive ? '+' : ''}${changePct.toFixed(2)}%`;
            createIcons({ icons, nameAttr: 'data-lucide', root: liveChangeEl });
          }

          if (this.lineSeries) {
            const timestamp = Math.floor(Date.now() / 1000);
            this.lineSeries.update({ time: timestamp, value: price });
            this.lineSeries.applyOptions({
              lineColor: changePct >= 0 ? '#10B981' : '#EF4444',
              topColor: changePct >= 0 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)',
              bottomColor: changePct >= 0 ? 'rgba(16, 185, 129, 0.0)' : 'rgba(239, 68, 68, 0.0)',
            });
            const glow = this.container.querySelector('#chart-glow');
            if (glow) glow.style.background = changePct >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
          }
        }
      }
    };
    
    this.ws.onclose = () => {
      setTimeout(() => this.initWebSocket(), 3000);
    };
  }

  switchAsset(symbol) {
    this.currentSymbol = symbol;
    const asset = this.assets.find(a => a.symbol === symbol);
    if (!asset) return;

    this.container.querySelector('#chart-asset-name').textContent = asset.name;
    this.container.querySelector('#chart-asset-symbol').textContent = asset.baseAsset;
    this.container.querySelector('#chart-asset-icon').src = `https://assets.coincap.io/assets/icons/${asset.baseAsset.toLowerCase()}@2x.png`;

    this.fetchHistoricalData(symbol);
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