/* ==========================================================================
   VALO OS - REAL-TIME FOREIGN EXCHANGE (FX) ENGINE
   Live Interbank Rates, Auto-Caching, Multi-Currency & Offline Fallback
   ========================================================================== */

const CACHE_KEY = 'valo_fx_rates_cache_v1';

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', name: 'Dólar Estadounidense', symbol: '$', flag: '🇺🇸' },
  { code: 'PEN', name: 'Sol Peruano', symbol: 'S/', flag: '🇵🇪' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'Libra Esterlina', symbol: '£', flag: '🇬🇧' },
  { code: 'BRL', name: 'Real Brasileño', symbol: 'R$', flag: '🇧🇷' },
  { code: 'MXN', name: 'Peso Mexicano', symbol: '$', flag: '🇲🇽' },
  { code: 'CLP', name: 'Peso Chileno', symbol: '$', flag: '🇨🇱' },
  { code: 'COP', name: 'Peso Colombiano', symbol: '$', flag: '🇨🇴' },
  { code: 'ARS', name: 'Peso Argentino', symbol: '$', flag: '🇦🇷' },
  { code: 'CAD', name: 'Dólar Canadiense', symbol: '$', flag: '🇨🇦' },
  { code: 'JPY', name: 'Yen Japonés', symbol: '¥', flag: '🇯🇵' },
];

const FALLBACK_RATES = {
  USD: 1,
  PEN: 3.74,
  EUR: 0.92,
  GBP: 0.79,
  BRL: 5.65,
  MXN: 19.80,
  CLP: 940.0,
  COP: 4150.0,
  ARS: 980.0,
  CAD: 1.38,
  JPY: 152.0
};

class FxService {
  constructor() {
    this.rates = this.loadCachedRates() || FALLBACK_RATES;
    this.lastUpdated = this.loadCachedTimestamp() || Date.now();
    this.isLive = false;
    this.fetchLiveRates();
  }

  loadCachedRates() {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.rates) return parsed.rates;
      }
    } catch (_) {}
    return null;
  }

  loadCachedTimestamp() {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.timestamp) return parsed.timestamp;
      }
    } catch (_) {}
    return null;
  }

  async fetchLiveRates() {
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) throw new Error('API fetch failed');
      const data = await res.json();
      if (data && data.rates) {
        this.rates = { ...FALLBACK_RATES, ...data.rates };
        this.lastUpdated = Date.now();
        this.isLive = true;
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            rates: this.rates,
            timestamp: this.lastUpdated
          }));
        } catch (_) {}
        window.dispatchEvent(new CustomEvent('valo:fx-updated', { detail: { rates: this.rates } }));
      }
    } catch (e) {
      this.isLive = false;
    }
  }

  convert(amount, fromCode = 'USD', toCode = 'PEN') {
    const num = Number(amount) || 0;
    if (fromCode === toCode) return num;

    const fromRate = this.rates[fromCode] || 1;
    const toRate = this.rates[toCode] || 1;

    // Convert from -> USD -> to
    const inUSD = num / fromRate;
    const result = inUSD * toRate;
    return Number(result.toFixed(2));
  }

  getRate(fromCode = 'USD', toCode = 'PEN') {
    if (fromCode === toCode) return 1;
    const fromRate = this.rates[fromCode] || 1;
    const toRate = this.rates[toCode] || 1;
    return (1 / fromRate) * toRate;
  }

  getStatus() {
    return {
      isLive: this.isLive,
      lastUpdated: this.lastUpdated,
      rates: this.rates
    };
  }
}

export const fxService = new FxService();
