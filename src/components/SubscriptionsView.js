/* ==========================================================================
   VALO OS - RECURRING BILLS & SUBSCRIPTIONS RADAR
   Real User Subscriptions, Real Logos, Dynamic Days to Renewal & Total Monthly Sum
   ========================================================================== */

import { storage, PAYMENT_METHODS } from '../services/storage.js';
import { t, formatCurrency, getPaymentMethodName } from '../services/i18n.js';
import { showSubscriptionModal } from './SubscriptionModal.js';
import { createIcons, icons } from 'lucide';

export function renderSubscriptions(container) {
  const subscriptions = storage.getSubscriptions() || [];
  const settings = storage.getSettings() || {};
  const symbol = settings.currencySymbol || 'S/';

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Calculate total monthly commitment
  const totalMonthlyCommitment = subscriptions.reduce((sum, sub) => {
    const amt = Number(sub.amount) || 0;
    return sub.billingPeriod === 'yearly' ? sum + (amt / 12) : sum + amt;
  }, 0);

  container.innerHTML = `
    <div class="view-transition-wrap" style="padding: 16px;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 20px; padding-top: 6px;">
        <div style="display: inline-flex; align-items: center; justify-content: center; width: 52px; height: 52px; background: #0F172A; border-radius: 16px; color: #FFFFFF; margin-bottom: 12px; box-shadow: 0 8px 16px rgba(15, 23, 42, 0.15);">
          <i data-lucide="calendar-clock" style="width: 26px; height: 26px;"></i>
        </div>
        <h2 style="font-family: var(--font-display); font-weight: 800; font-size: 1.35rem; color: var(--ink); letter-spacing: -0.5px;">
          ${t('sub_title')}
        </h2>
        <p style="color: var(--ink-60); font-size: 0.82rem; margin-top: 4px;">${t('sub_desc')}</p>
      </div>

      <!-- Total Commitment Summary Card -->
      <div class="glass-card" style="background: #FFFFFF; border: 1px solid rgba(15, 23, 42, 0.08); margin-bottom: 16px; box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03); display: flex; justify-content: space-between; align-items: center; padding: 14px 18px;">
        <div>
          <span style="font-size: 0.70rem; color: var(--ink-60); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">Compromiso Mensual</span>
          <div style="font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; color: #0F172A; margin-top: 2px;">
            ${formatCurrency(totalMonthlyCommitment)}
          </div>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 0.70rem; color: var(--ink-60); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">Servicios Activos</span>
          <div style="font-family: var(--font-mono); font-size: 1.2rem; font-weight: 800; color: #059669; margin-top: 2px;">
            ${subscriptions.length}
          </div>
        </div>
      </div>

      <!-- Add Subscription Button -->
      <button type="button" id="btn-add-new-sub" class="btn btn-primary" style="width: 100%; margin-bottom: 18px; font-weight: 700; font-size: 0.88rem; padding: 12px;">
        <i data-lucide="plus" style="width: 16px; height: 16px; margin-right: 6px;"></i>
        ${t('sub_add_btn')}
      </button>

      <!-- Subscriptions List -->
      <div style="display: flex; flex-direction: column; gap: 12px;" id="subs-list-container">
        ${subscriptions.length === 0 ? `
          <div style="text-align: center; padding: 36px 16px; color: var(--ink-60); background: #FFFFFF; border-radius: 16px; border: 1.5px dashed rgba(15, 23, 42, 0.1);">
            <div style="font-weight: 800; color: var(--ink); margin-bottom: 4px;">${t('sub_empty_title')}</div>
            <p style="font-size: 0.78rem;">${t('sub_empty_desc')}</p>
          </div>
        ` : subscriptions.map(sub => {
          const renewalDay = sub.renewalDay || 1;
          let daysLeft = renewalDay - currentDay;
          if (daysLeft < 0) {
            daysLeft += daysInCurrentMonth;
          }

          const pm = PAYMENT_METHODS.find(p => p.id === sub.paymentMethod) || { name: 'Efectivo', icon: 'banknote' };
          const pmName = getPaymentMethodName(pm);

          return `
            <div class="glass-card sub-item-card" data-id="${sub.id}" style="background: #FFFFFF; border: 1px solid rgba(15, 23, 42, 0.08); border-radius: 16px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.02);">
              <div style="display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1;">
                <div style="width: 44px; height: 44px; border-radius: 12px; background: ${sub.color || '#0F172A'}15; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid ${sub.color || '#0F172A'}30; flex-shrink: 0;">
                  ${sub.hasOfficialLogo && sub.icon ? `
                    <img src="https://cdn.simpleicons.org/${sub.icon}/${(sub.color || '000000').replace('#','')}" alt="${sub.name}" style="width: 24px; height: 24px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                    <div style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; color: ${sub.color || '#0F172A'}; font-weight: 800; font-size: 0.85rem;">
                      ${sub.name.substring(0, 2).toUpperCase()}
                    </div>
                  ` : `
                    <div style="color: ${sub.color || '#0F172A'}; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; justify-content: center;">
                      ${sub.name.substring(0, 2).toUpperCase()}
                    </div>
                  `}
                </div>

                <div style="min-width: 0; overflow: hidden;">
                  <div style="font-weight: 800; color: var(--ink); font-size: 0.95rem; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                    ${sub.name}
                  </div>
                  <div style="color: var(--ink-60); font-size: 0.72rem; display: flex; align-items: center; gap: 6px; margin-top: 2px;">
                    <span style="display: flex; align-items: center; gap: 3px; color: ${daysLeft <= 3 ? '#DC2626' : 'var(--ink-60)'}; font-weight: ${daysLeft <= 3 ? '700' : '500'};">
                      <i data-lucide="clock" style="width: 11px; height: 11px;"></i>
                      ${daysLeft === 0 ? '¡Vence Hoy!' : `${t('sub_renews_in')} ${daysLeft} ${t('sub_days')}`}
                    </span>
                    <span>•</span>
                    <span style="font-size: 0.70rem;">${pmName}</span>
                  </div>
                </div>
              </div>

              <div style="display: flex; flex-direction: column; align-items: flex-end; flex-shrink: 0; margin-left: 10px;">
                <div style="font-weight: 800; font-family: var(--font-mono); color: var(--ink); font-size: 1.05rem;">
                  ${formatCurrency(sub.amount)}
                </div>
                <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
                  <span style="color: var(--ink-60); font-size: 0.68rem; font-weight: 600;">
                    ${sub.billingPeriod === 'yearly' ? t('sub_per_year') : t('sub_per_month')}
                  </span>
                  <button type="button" class="btn-delete-sub" data-id="${sub.id}" style="background: none; border: none; color: var(--ink-40); cursor: pointer; padding: 2px;" title="${t('goals_delete')}">
                    <i data-lucide="trash-2" style="width: 12px; height: 12px;"></i>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Attach Event Listeners
  container.querySelector('#btn-add-new-sub')?.addEventListener('click', () => {
    showSubscriptionModal({
      onSave: () => renderSubscriptions(container)
    });
  });

  container.querySelectorAll('.btn-delete-sub').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      if (confirm('¿Eliminar este pago fijo o suscripción?')) {
        storage.deleteSubscription(id);
        renderSubscriptions(container);
      }
    });
  });

  container.querySelectorAll('.sub-item-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      const sub = subscriptions.find(s => s.id === id);
      if (sub) {
        showSubscriptionModal({
          subscriptionToEdit: sub,
          onSave: () => renderSubscriptions(container)
        });
      }
    });
  });

  createIcons({ icons, nameAttr: 'data-lucide', root: container });
}
