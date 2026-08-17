/* ==========================================================================
   VALO OS - RECURRING BILLS & SUBSCRIPTIONS RADAR
   100% Bilingual (ES / EN) with Clean Minimalist Cards
   ========================================================================== */

import { t, formatCurrency } from '../services/i18n.js';
import { createIcons, icons } from 'lucide';

const POPULAR_SERVICES = [
  { id: 'netflix', name: 'Netflix', color: '#E50914', icon: 'netflix', amount: 44.90, days: 5 },
  { id: 'spotify', name: 'Spotify', color: '#1DB954', icon: 'spotify', amount: 20.90, days: 12 },
  { id: 'max', name: 'Max (HBO)', color: '#002BE7', icon: 'max', amount: 29.90, days: 18 },
  { id: 'gym', name: 'SmartFit', color: '#FFB81C', icon: 'smartfit', amount: 99.00, days: 22 },
  { id: 'internet', name: 'Fibra Óptica', color: '#0EA5E9', icon: 'wifi', amount: 89.00, days: 28 }
];

export function renderSubscriptions(container) {
  container.innerHTML = `
    <div class="view-transition-wrap" style="padding: 16px;">
      <div style="text-align: center; margin-bottom: 24px; padding-top: 10px;">
        <div style="display: inline-flex; align-items: center; justify-content: center; width: 52px; height: 52px; background: #0F172A; border-radius: 16px; color: #FFFFFF; margin-bottom: 14px; box-shadow: 0 8px 16px rgba(15, 23, 42, 0.15);">
          <i data-lucide="calendar-clock" style="width: 26px; height: 26px;"></i>
        </div>
        <h2 style="font-family: var(--font-display); font-weight: 800; font-size: 1.35rem; color: var(--ink); letter-spacing: -0.5px;">
          ${t('sub_title')}
        </h2>
        <p style="color: var(--ink-60); font-size: 0.82rem; margin-top: 4px;">${t('sub_desc')}</p>
      </div>

      <!-- Add Subscription Button -->
      <button class="btn btn-primary" style="width: 100%; margin-bottom: 20px; font-weight: 700; font-size: 0.85rem; padding: 12px;">
        <i data-lucide="plus" style="width: 16px; height: 16px; margin-right: 6px;"></i>
        ${t('sub_add_btn')}
      </button>

      <!-- Clean Cards -->
      <div style="display: grid; gap: 12px;">
        ${POPULAR_SERVICES.map(service => `
          <div style="background: #FFFFFF; border: 1px solid rgba(15, 23, 42, 0.08); border-radius: 16px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.02);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 42px; height: 42px; border-radius: 12px; background: ${service.color}15; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid ${service.color}30;">
                <img src="https://cdn.simpleicons.org/${service.icon}/${service.color.replace('#','')}" alt="${service.name}" style="width: 22px; height: 22px;" onerror="this.style.display='none'" />
              </div>
              <div>
                <div style="font-weight: 800; color: var(--ink); font-size: 0.95rem;">${service.name}</div>
                <div style="color: var(--ink-60); font-size: 0.72rem; display: flex; align-items: center; gap: 4px; margin-top: 2px;">
                  <i data-lucide="clock" style="width: 11px; height: 11px;"></i>
                  ${t('sub_renews_in')} ${service.days} ${t('sub_days')}
                </div>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 800; font-family: var(--font-mono); color: var(--ink); font-size: 1.05rem;">
                ${formatCurrency(service.amount)}
              </div>
              <div style="color: var(--ink-60); font-size: 0.68rem; font-weight: 600;">${t('sub_per_month')}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  createIcons({ icons });
}
