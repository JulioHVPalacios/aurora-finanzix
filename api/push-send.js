// api/push-send.js
// Endpoint to trigger a Web Push Notification using Vercel Serverless

import webpush from 'web-push';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Require admin token for sending push notifications
    const adminToken = req.headers['x-admin-token'] || req.headers['authorization'];
    const expectedToken = process.env.PUSH_ADMIN_TOKEN;
    
    if (expectedToken && adminToken !== expectedToken && adminToken !== `Bearer ${expectedToken}`) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Admin Token' });
    }

    const { subscription, payload } = req.body;
    
    const vapidPublic = process.env.VAPID_PUBLIC_KEY;
    const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
    const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:soporte@aurorafinanzix.com';

    if (!vapidPublic || !vapidPrivate) {
      return res.status(500).json({ error: 'VAPID keys not configured in server environment' });
    }

    webpush.setVapidDetails(vapidSubject, vapidPublic, vapidPrivate);

    try {
      if (!subscription) {
        return res.status(400).json({ error: 'Falta objeto de suscripción' });
      }

      await webpush.sendNotification(subscription, JSON.stringify(payload || {
        title: 'VALO OS',
        body: 'Notificación de actividad financiera.',
        icon: '/icon.png'
      }));

      return res.status(200).json({ message: 'Notificación enviada con éxito.' });
    } catch (error) {
      console.error('Error enviando push notification');
      return res.status(500).json({ error: 'Error enviando notificación push' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
