// api/push-subscribe.js
// Vercel Serverless Function to receive VAPID Subscriptions

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const subscription = req.body;
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Suscripción inválida' });
    }

    // En un entorno de producción, almacenaríamos la suscripción de forma segura en Base de Datos
    return res.status(201).json({ message: 'Suscripción registrada correctamente en VALO OS.' });
  }
  
  return res.status(405).json({ error: 'Method Not Allowed' });
}
