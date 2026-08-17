// api/push-subscribe.js
// Vercel Serverless Function to receive VAPID Subscriptions

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const subscription = req.body;
    // En un entorno de producción real, guardaríamos esta 'subscription' en una Base de Datos (ej. Vercel KV, Supabase, o Firebase)
    // Para propósitos de este despliegue sin base de datos, lo simulamos con un 201 Created.
    console.log('Nueva suscripción Push recibida:', subscription);
    
    return res.status(201).json({ message: 'Suscripción guardada correctamente en Aurora Finanzix.' });
  }
  
  return res.status(405).json({ error: 'Method Not Allowed' });
}
