const fs = require('fs');
let code = fs.readFileSync('src/components/MarketsView.js', 'utf8');

const newWs = \  initWebSocket() {
    // DOM Caching: Extremely fast O(1) updates to prevent browser freeze
    const rowsMap = new Map();
    this.container.querySelectorAll('.mkt-row').forEach(row => {
      const sym = row.dataset.symbol;
      rowsMap.set(sym, {
        row: row,
        priceEl: this.container.querySelector('#price-' + sym),
        changeEl: this.container.querySelector('#change-' + sym)
      });
    });

    const connect = () => {
      if (this._destroyed) return;
      // !ticker@arr is ultra-high frequency (multiple times per second) and has P natively
      const ws = new WebSocket('wss://stream.binance.com/ws/!ticker@arr');
      this.ws = ws;

      ws.onopen = () => {
        const dot   = this.container.querySelector('#ws-dot');
        const label = this.container.querySelector('#ws-label');
        if (dot)   dot.style.background = '#10B981';
        if (label) label.textContent = 'En vivo · Ultra Rápido';
      };

      ws.onmessage = (event) => {
        if (this._destroyed) return;
        let data;
        try { data = JSON.parse(event.data); } catch { return; }

        for (const ticker of data) {
          const dom = rowsMap.get(ticker.s);
          if (!dom) continue; // Skip thousands of unused pairs instantly

          const price     = parseFloat(ticker.c);
          const changePct = parseFloat(ticker.P); // Native exact 24h percentage

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
              chartChangeEl.innerHTML = '<i data-lucide=\"' + (pos ? 'trending-up' : 'trending-down') + '\" style=\"width:14px;height:14px;\"></i> ' + (pos ? '+' : '') + changePct.toFixed(2) + '%';
              createIcons({ icons, nameAttr: 'data-lucide', root: chartChangeEl });
            }

            if (this.lineSeries) {
              try { this.lineSeries.update({ time: Math.floor(Date.now() / 1000), value: price }); } catch { }
            }

            const glow = this.container.querySelector('#chart-glow');
            if (glow) glow.style.background = changePct >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)';
          }
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
  }\;

const parts = code.split('  initWebSocket() {');
const before = parts[0];
const afterParts = parts[1].split('  destroy() {');
const after = '  destroy() {' + afterParts[1];

fs.writeFileSync('src/components/MarketsView.js', before + newWs + '\\n\\n' + after);
