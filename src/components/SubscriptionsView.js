/* ==========================================================================
   AURORA FINANZIX - SUBSCRIPTIONS RADAR (Wallos Style)
   ========================================================================== */

import { storage } from '../services/storage.js';
import { t, formatCurrency } from '../services/i18n.js';
import { createIcons, icons } from 'lucide';

const POPULAR_SERVICES = [
  { id: 'netflix', name: 'Netflix', color: '#E50914', icon: 'netflix' },
  { id: 'spotify', name: 'Spotify', color: '#1DB954', icon: 'spotify' },
  { id: 'hbo', name: 'Max', color: '#002BE7', icon: 'max' },
  { id: 'gym', name: 'SmartFit', color: '#FFB81C', icon: 'smartfit' },
  { id: 'rent', name: 'Airbnb', color: '#FF5A5F', icon: 'airbnb' }
];

export function renderSubscriptions(container) {
  // In a real app we would load from storage, for now we will show an empty beautiful state
  // or a mock one if empty.
  
  container.innerHTML = `
    <div class="view-transition-wrap" style="padding: 16px;">
      <div style="text-align: center; margin-bottom: 24px; padding-top: 10px;">
        <div style="display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; background: linear-gradient(135deg, #EEF2FF, #E0E7FF); border-radius: 20px; color: #4F46E5; margin-bottom: 16px; box-shadow: 0 8px 16px rgba(79, 70, 229, 0.15);">
          <i data-lucide="calendar-clock" style="width: 28px; height: 28px;"></i>
        </div>
        <h2 style="font-family: var(--font-display); font-weight: 800; font-size: 1.5rem; color: var(--ink); letter-spacing: -0.5px;">${t('sub_title')}</h2>
        <p style="color: var(--ink-60); font-size: 0.9rem; margin-top: 6px;">${t('sub_desc')}</p>
      </div>

      <!-- Add Subscription Button -->
      <button class="btn btn-primary" style="width: 100%; margin-bottom: 24px; font-weight: 700;">
        <i data-lucide="plus" style="width: 18px; height: 18px; margin-right: 8px;"></i>
        ${t('sub_add')}
      </button>

      <!-- Mock Cards (Wallos Style) -->
      <div style="display: grid; gap: 16px;">
        ${POPULAR_SERVICES.slice(0, 3).map(service => `
          <div style="background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(15, 23, 42, 0.05); border-radius: 20px; padding: 16px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="width: 48px; height: 48px; border-radius: 14px; background: ${service.color}15; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                <img src="https://cdn.simpleicons.org/${service.icon}/${service.color.replace('#','')}" alt="${service.name} logo" style="width: 28px; height: 28px;" />
              </div>
              <div>
                <div style="font-weight: 700; color: var(--ink); font-size: 1.05rem;">${service.name}</div>
                <div style="color: var(--ink-40); font-size: 0.75rem; display: flex; align-items: center; gap: 4px; margin-top: 2px;">
                  <i data-lucide="clock" style="width: 12px; height: 12px;"></i>
                  ${t('sub_renews')} 5 ${t('sub_days')}
                </div>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 800; font-family: var(--font-mono); color: var(--ink); font-size: 1.1rem;">${formatCurrency(45)}</div>
              <div style="color: var(--ink-40); font-size: 0.7rem;">${t('sub_month')}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  createIcons({ icons });
}
