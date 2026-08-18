/* ==========================================================================
   VALO OS - SPONSORED DEALS & AFFILIATE OPPORTUNITIES CARD
   High-Converting, Non-Intrusive, Luxury Glassmorphism Affiliate Engine
   ========================================================================== */

export const AFFILIATE_DEALS = [
  {
    id: 'deal_savings',
    tag: 'Ahorro Inteligente',
    title: 'Gana hasta 7.0% TREA en tus Ahorros',
    desc: 'Compara cuentas de ahorro de alto rendimiento y depósitos a plazo fijo protegidos por el Fondo de Seguro.',
    icon: 'trending-up',
    color: '#059669',
    ctaText: 'Ver Cuentas de Alto Rendimiento →',
    ctaUrl: 'https://www.google.com/search?q=mejores+cuentas+de+ahorro+alto+rendimiento+peru+trea'
  },
  {
    id: 'deal_cards',
    tag: 'Tarjetas & Beneficios',
    title: 'Tarjetas de Crédito con S/ 0 Membresía',
    desc: 'Descubre tarjetas sin comisiones ocultas, con acumulación de millas y cashback en todas tus compras.',
    icon: 'credit-card',
    color: '#4F46E5',
    ctaText: 'Comparar Tarjetas Sin Comisión →',
    ctaUrl: 'https://www.google.com/search?q=tarjetas+de+credito+sin+membresia+peru'
  },
  {
    id: 'deal_soat',
    tag: 'Seguros Digitales',
    title: 'SOAT Digital con hasta 30% de Descuento',
    desc: 'Cotiza tu SOAT vehicular 100% online al instante con entrega inmediata a tu correo.',
    icon: 'shield-check',
    color: '#D97706',
    ctaText: 'Cotizar SOAT al Mejor Precio →',
    ctaUrl: 'https://www.google.com/search?q=cotizar+soat+digital+peru+descuento'
  },
  {
    id: 'deal_exchange',
    tag: 'Tipo de Cambio',
    title: 'Cambia Dólares al Mejor Precio Online',
    desc: 'Ahorra en cada compra y venta de dólares con casas de cambio digitales reguladas por la SBS.',
    icon: 'dollar-sign',
    color: '#0284C7',
    ctaText: 'Comparar Tipo de Cambio →',
    ctaUrl: 'https://www.google.com/search?q=mejor+tipo+de+cambio+dolares+online+peru'
  }
];

const DISMISS_KEY = 'valo_deal_dismissed_v1';

export function renderSponsoredDealsCard() {
  if (sessionStorage.getItem(DISMISS_KEY) === 'true') {
    return '';
  }

  // Pick random deal or cycle
  const activeIndex = Math.floor(Math.random() * AFFILIATE_DEALS.length);
  const deal = AFFILIATE_DEALS[activeIndex];

  return `
    <div id="sponsored-deal-card" class="glass-card" style="
      background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%);
      border: 1px solid rgba(79, 70, 229, 0.18);
      border-radius: 18px;
      padding: 14px 16px;
      margin-bottom: 16px;
      box-shadow: 0 4px 16px rgba(79, 70, 229, 0.04);
      position: relative;
      overflow: hidden;
    ">
      <!-- Glow effect -->
      <div style="position: absolute; right: -20px; top: -20px; width: 80px; height: 80px; background: ${deal.color}15; border-radius: 50%; filter: blur(20px); pointer-events: none;"></div>

      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="display: inline-flex; align-items: center; gap: 3px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; background: ${deal.color}15; color: ${deal.color}; padding: 3px 8px; border-radius: 999px;">
            ✦ ${deal.tag}
          </span>
          <span style="font-size: 0.60rem; color: var(--ink-40); font-weight: 600;">Patrocinado</span>
        </div>
        <button type="button" id="btn-dismiss-deal" style="background: none; border: none; color: var(--ink-40); cursor: pointer; padding: 2px;" title="Cerrar">
          <i data-lucide="x" style="width: 13px; height: 13px;"></i>
        </button>
      </div>

      <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 10px;">
        <div style="width: 38px; height: 38px; border-radius: 12px; background: ${deal.color}15; color: ${deal.color}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
          <i data-lucide="${deal.icon}" style="width: 20px; height: 20px;"></i>
        </div>
        <div>
          <div style="font-weight: 800; font-size: 0.88rem; color: #0F172A; line-height: 1.25; margin-bottom: 3px;">
            ${deal.title}
          </div>
          <p style="font-size: 0.74rem; color: #64748B; margin: 0; line-height: 1.4;">
            ${deal.desc}
          </p>
        </div>
      </div>

      <a href="${deal.ctaUrl}" target="_blank" rel="noopener noreferrer" style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        background: #0F172A;
        color: #FFFFFF;
        padding: 9px 12px;
        border-radius: 12px;
        font-size: 0.78rem;
        font-weight: 700;
        text-decoration: none;
        box-sizing: border-box;
        transition: transform 0.15s, opacity 0.15s;
      ">
        ${deal.ctaText}
      </a>
    </div>
  `;
}

export function attachSponsoredDealEvents(container) {
  container.querySelector('#btn-dismiss-deal')?.addEventListener('click', () => {
    sessionStorage.setItem(DISMISS_KEY, 'true');
    const card = container.querySelector('#sponsored-deal-card');
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(-10px)';
      card.style.transition = 'all 0.25s ease';
      setTimeout(() => card.remove(), 250);
    }
  });
}
