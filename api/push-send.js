// api/push-send.js
// Endpoint to trigger a Web Push Notification using Vercel Serverless

import webpush from 'web-push';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { subscription, payload } = req.body;
    
    // Configurar claves VAPID (Deberían estar en Vercel Environment Variables)
    webpush.setVapidDetails(
      'mailto:soporte@aurorafinanzix.com',
      process.env.VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U',
      process.env.VAPID_PRIVATE_KEY || 'dummy_private_key_para_pruebas_locales_1234'
    );

    try {
      // Si recibiéramos la suscripción real de la base de datos, la usaríamos aquí.
      if (!subscription) {
        return res.status(400).json({ error: 'Falta objeto de suscripción' });
      }

      await webpush.sendNotification(subscription, JSON.stringify(payload || {
        title: '¡Actualización Disponible!',
        body: 'Nueva versión de Aurora Finanzix lista. Toca para actualizar.',
        icon: '/icon.png'
      }));

      return res.status(200).json({ message: 'Notificación enviada con éxito.' });
    } catch (error) {
      console.error('Error enviando push:', error);
      return res.status(500).json({ error: 'Error enviando notificación push' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
