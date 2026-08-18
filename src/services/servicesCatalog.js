/* ==========================================================================
   VALO OS - COMPREHENSIVE RECURRING SERVICES & BILLS CATALOGUE
   Country-specific Utilities, Telecom, Streaming, Fintech, Health & Tech
   100% Real Brands, Official Colors, SimpleIcons Slugs & Fallbacks
   ========================================================================== */

export const SERVICE_CATEGORIES = [
  { id: 'all', name: 'Todos', icon: 'grid' },
  { id: 'entertainment', name: 'Streaming & Video', icon: 'film' },
  { id: 'services', name: 'Internet & Móvil', icon: 'wifi' },
  { id: 'home', name: 'Luz, Agua & Gas', icon: 'home' },
  { id: 'shopping', name: 'Delivery & Compras', icon: 'shopping-bag' },
  { id: 'health', name: 'Salud & Gimnasios', icon: 'heart-pulse' },
  { id: 'education', name: 'Educación & Cursos', icon: 'book-open' },
  { id: 'tech', name: 'Tech, Cloud & IA', icon: 'sparkles' },
  { id: 'finance', name: 'Tarjetas & Bancos', icon: 'credit-card' },
  { id: 'transport', name: 'Peajes & Autos', icon: 'car' },
  { id: 'housing', name: 'Vivienda & Alarmas', icon: 'building' },
];

// Universal International Services (Available in all countries)
const GLOBAL_SERVICES = [
  // Streaming & Media
  { id: 'netflix', name: 'Netflix', category: 'entertainment', defaultAmount: 44.90, icon: 'netflix', color: '#E50914', hasOfficialLogo: true },
  { id: 'spotify', name: 'Spotify', category: 'entertainment', defaultAmount: 20.90, icon: 'spotify', color: '#1DB954', hasOfficialLogo: true },
  { id: 'disney', name: 'Disney+', category: 'entertainment', defaultAmount: 38.90, icon: 'disneyplus', color: '#113CCF', hasOfficialLogo: true },
  { id: 'max', name: 'Max (HBO)', category: 'entertainment', defaultAmount: 29.90, icon: 'max', color: '#002BE7', hasOfficialLogo: true },
  { id: 'prime_video', name: 'Amazon Prime Video', category: 'entertainment', defaultAmount: 19.90, icon: 'amazonprime', color: '#00A8E1', hasOfficialLogo: true },
  { id: 'youtube_prem', name: 'YouTube Premium', category: 'entertainment', defaultAmount: 24.90, icon: 'youtube', color: '#FF0000', hasOfficialLogo: true },
  { id: 'apple_tv', name: 'Apple TV+', category: 'entertainment', defaultAmount: 29.90, icon: 'apple', color: '#000000', hasOfficialLogo: true },
  { id: 'apple_music', name: 'Apple Music', category: 'entertainment', defaultAmount: 18.90, icon: 'applemusic', color: '#FA243C', hasOfficialLogo: true },
  { id: 'apple_one', name: 'Apple One', category: 'entertainment', defaultAmount: 39.90, icon: 'apple', color: '#000000', hasOfficialLogo: true },
  { id: 'crunchyroll', name: 'Crunchyroll', category: 'entertainment', defaultAmount: 19.00, icon: 'crunchyroll', color: '#F47521', hasOfficialLogo: true },
  { id: 'paramount', name: 'Paramount+', category: 'entertainment', defaultAmount: 19.90, icon: 'paramountplus', color: '#0064FF', hasOfficialLogo: true },
  { id: 'deezer', name: 'Deezer', category: 'entertainment', defaultAmount: 18.90, icon: 'deezer', color: '#A238FF', hasOfficialLogo: true },
  { id: 'tidal', name: 'Tidal', category: 'entertainment', defaultAmount: 19.90, icon: 'tidal', color: '#000000', hasOfficialLogo: true },
  { id: 'soundcloud', name: 'SoundCloud Go', category: 'entertainment', defaultAmount: 15.00, icon: 'soundcloud', color: '#FF5500', hasOfficialLogo: true },
  { id: 'twitch', name: 'Twitch Sub', category: 'entertainment', defaultAmount: 14.90, icon: 'twitch', color: '#9146FF', hasOfficialLogo: true },
  { id: 'kick', name: 'Kick Sub', category: 'entertainment', defaultAmount: 15.00, icon: 'kick', color: '#53FC18', hasOfficialLogo: true },
  { id: 'ps_plus', name: 'PlayStation Plus', category: 'entertainment', defaultAmount: 35.00, icon: 'playstation', color: '#003791', hasOfficialLogo: true },
  { id: 'xbox_gamepass', name: 'Xbox Game Pass', category: 'entertainment', defaultAmount: 39.90, icon: 'xbox', color: '#107C10', hasOfficialLogo: true },
  { id: 'nintendo_switch', name: 'Nintendo Switch Online', category: 'entertainment', defaultAmount: 12.00, icon: 'nintendoswitch', color: '#E60012', hasOfficialLogo: true },
  { id: 'steam_sub', name: 'Steam / EA Play', category: 'entertainment', defaultAmount: 20.00, icon: 'steam', color: '#000000', hasOfficialLogo: true },

  // Tech, IA & Productividad
  { id: 'chatgpt', name: 'ChatGPT Plus (OpenAI)', category: 'tech', defaultAmount: 76.00, icon: 'openai', color: '#10A37F', hasOfficialLogo: true },
  { id: 'claude_pro', name: 'Claude Pro (Anthropic)', category: 'tech', defaultAmount: 76.00, icon: 'anthropic', color: '#D97706', hasOfficialLogo: true },
  { id: 'midjourney', name: 'Midjourney', category: 'tech', defaultAmount: 38.00, icon: 'midjourney', color: '#000000', hasOfficialLogo: true },
  { id: 'google_one', name: 'Google One / Drive', category: 'tech', defaultAmount: 6.90, icon: 'google', color: '#4285F4', hasOfficialLogo: true },
  { id: 'apple_icloud', name: 'Apple iCloud', category: 'tech', defaultAmount: 3.90, icon: 'icloud', color: '#3699F2', hasOfficialLogo: true },
  { id: 'microsoft_365', name: 'Microsoft 365 (Office)', category: 'tech', defaultAmount: 26.00, icon: 'microsoft', color: '#0078D4', hasOfficialLogo: true },
  { id: 'canva_pro', name: 'Canva Pro', category: 'tech', defaultAmount: 34.90, icon: 'canva', color: '#00C4CC', hasOfficialLogo: true },
  { id: 'adobe_cc', name: 'Adobe Creative Cloud', category: 'tech', defaultAmount: 120.00, icon: 'adobe', color: '#FF0000', hasOfficialLogo: true },
  { id: 'notion_plus', name: 'Notion Plus', category: 'tech', defaultAmount: 38.00, icon: 'notion', color: '#000000', hasOfficialLogo: true },
  { id: 'github_pro', name: 'GitHub Pro / Copilot', category: 'tech', defaultAmount: 38.00, icon: 'github', color: '#181717', hasOfficialLogo: true },
  { id: 'dropbox', name: 'Dropbox Plus', category: 'tech', defaultAmount: 42.00, icon: 'dropbox', color: '#0061FF', hasOfficialLogo: true },
  { id: 'zoom_pro', name: 'Zoom Pro', category: 'tech', defaultAmount: 55.00, icon: 'zoom', color: '#0B5CFF', hasOfficialLogo: true },
  { id: 'linkedin_prem', name: 'LinkedIn Premium', category: 'tech', defaultAmount: 110.00, icon: 'linkedin', color: '#0A66C2', hasOfficialLogo: true },
  { id: 'onepassword', name: '1Password / Bitwarden', category: 'tech', defaultAmount: 15.00, icon: '1password', color: '#175DDC', hasOfficialLogo: true },
  { id: 'starlink', name: 'Starlink Satelital', category: 'services', defaultAmount: 210.00, icon: 'starlink', color: '#000000', hasOfficialLogo: true },

  // Cursos & Educación Global
  { id: 'duolingo', name: 'Duolingo Super', category: 'education', defaultAmount: 24.90, icon: 'duolingo', color: '#58CC02', hasOfficialLogo: true },
  { id: 'platzi', name: 'Platzi Expert', category: 'education', defaultAmount: 89.00, icon: 'platzi', color: '#0C1526', hasOfficialLogo: true },
  { id: 'coursera', name: 'Coursera Plus', category: 'education', defaultAmount: 149.00, icon: 'coursera', color: '#0056D2', hasOfficialLogo: true },
  { id: 'udemy', name: 'Udemy Pro', category: 'education', defaultAmount: 69.00, icon: 'udemy', color: '#A435F0', hasOfficialLogo: true },
  { id: 'crehana', name: 'Crehana Premium', category: 'education', defaultAmount: 49.00, icon: 'book-open', color: '#7A00FF', hasOfficialLogo: false },
];

/* ── Country Specific Catalogs ─────────────────────────────────────────── */

export const COUNTRY_SERVICES = {
  // 🇵🇪 PERÚ
  'Perú': [
    // Luz, Agua, Gas
    { id: 'pe_sedapal', name: 'Sedapal (Agua Lima & Callao)', category: 'home', defaultAmount: 65.00, icon: 'droplet', color: '#0284C7', hasOfficialLogo: false },
    { id: 'pe_luzdelsur', name: 'Luz del Sur (Electricidad)', category: 'home', defaultAmount: 120.00, icon: 'zap', color: '#F59E0B', hasOfficialLogo: false },
    { id: 'pe_pluz', name: 'Pluz Energía (ex Enel Distribución)', category: 'home', defaultAmount: 115.00, icon: 'zap', color: '#0080FF', hasOfficialLogo: false },
    { id: 'pe_calidda', name: 'Cálidda Gas Natural', category: 'home', defaultAmount: 35.00, icon: 'flame', color: '#EF4444', hasOfficialLogo: false },
    { id: 'pe_quavii', name: 'Quavii Gas (Norte del Perú)', category: 'home', defaultAmount: 40.00, icon: 'flame', color: '#059669', hasOfficialLogo: false },
    { id: 'pe_seal', name: 'Seal (Sociedad Eléctrica Arequipa)', category: 'home', defaultAmount: 85.00, icon: 'zap', color: '#2563EB', hasOfficialLogo: false },
    { id: 'pe_hidrandina', name: 'Hidrandina (La Libertad/Ancash)', category: 'home', defaultAmount: 80.00, icon: 'zap', color: '#0284C7', hasOfficialLogo: false },
    { id: 'pe_electrocentro', name: 'Electrocentro (Junín/Huancayo)', category: 'home', defaultAmount: 75.00, icon: 'zap', color: '#F59E0B', hasOfficialLogo: false },
    { id: 'pe_enosa', name: 'Enosa (Piura y Tumbes)', category: 'home', defaultAmount: 90.00, icon: 'zap', color: '#D97706', hasOfficialLogo: false },
    { id: 'pe_electrooriente', name: 'Electro Oriente (Loreto/Iquitos)', category: 'home', defaultAmount: 85.00, icon: 'zap', color: '#10B981', hasOfficialLogo: false },
    { id: 'pe_electrosur', name: 'Electrosur (Tacna y Moquegua)', category: 'home', defaultAmount: 70.00, icon: 'zap', color: '#3B82F6', hasOfficialLogo: false },
    { id: 'pe_sedacusco', name: 'Seda Cusco (Agua)', category: 'home', defaultAmount: 45.00, icon: 'droplet', color: '#0EA5E9', hasOfficialLogo: false },
    { id: 'pe_sedalib', name: 'Sedalib (Agua Trujillo)', category: 'home', defaultAmount: 50.00, icon: 'droplet', color: '#0284C7', hasOfficialLogo: false },
    { id: 'pe_epsgrau', name: 'EPS Grau (Agua Piura)', category: 'home', defaultAmount: 45.00, icon: 'droplet', color: '#0284C7', hasOfficialLogo: false },

    // Telecom & Internet Perú
    { id: 'pe_movistar', name: 'Movistar Hogar / Fibra / Móvil', category: 'services', defaultAmount: 89.90, icon: 'movistar', color: '#019DF4', hasOfficialLogo: true },
    { id: 'pe_claro', name: 'Claro Hogar / Fibra / Móvil', category: 'services', defaultAmount: 85.00, icon: 'claro', color: '#DA291C', hasOfficialLogo: true },
    { id: 'pe_entel', name: 'Entel Móvil / Hogar', category: 'services', defaultAmount: 49.90, icon: 'smartphone', color: '#0055A5', hasOfficialLogo: false },
    { id: 'pe_bitel', name: 'Bitel Móvil / Fibra', category: 'services', defaultAmount: 39.90, icon: 'smartphone', color: '#FFCC00', hasOfficialLogo: false },
    { id: 'pe_win', name: 'WIN Internet Fibra Óptica', category: 'services', defaultAmount: 99.00, icon: 'wifi', color: '#FF6600', hasOfficialLogo: false },
    { id: 'pe_nubyx', name: 'Nubyx Fibra Óptica', category: 'services', defaultAmount: 89.00, icon: 'wifi', color: '#6366F1', hasOfficialLogo: false },
    { id: 'pe_wow', name: 'Wow Telecom Fibra', category: 'services', defaultAmount: 79.00, icon: 'wifi', color: '#8B5CF6', hasOfficialLogo: false },
    { id: 'pe_directv', name: 'DirecTV / DGO Perú', category: 'services', defaultAmount: 110.00, icon: 'directv', color: '#00A6E0', hasOfficialLogo: true },
    { id: 'pe_hughesnet', name: 'HughesNet Satelital', category: 'services', defaultAmount: 160.00, icon: 'wifi', color: '#003366', hasOfficialLogo: false },

    // Delivery & Compras Perú
    { id: 'pe_rappi', name: 'Rappi Prime Perú', category: 'shopping', defaultAmount: 22.90, icon: 'rappi', color: '#FF441F', hasOfficialLogo: true },
    { id: 'pe_pedidosya', name: 'PedidosYa Plus Perú', category: 'shopping', defaultAmount: 16.90, icon: 'deliveryhero', color: '#EA044E', hasOfficialLogo: true },
    { id: 'pe_uberone', name: 'Uber One Perú', category: 'shopping', defaultAmount: 19.90, icon: 'uber', color: '#000000', hasOfficialLogo: true },
    { id: 'pe_didi', name: 'Didi Club Perú', category: 'shopping', defaultAmount: 14.90, icon: 'didi', color: '#FF7D00', hasOfficialLogo: true },
    { id: 'pe_indrive', name: 'inDrive', category: 'shopping', defaultAmount: 25.00, icon: 'car', color: '#A0E000', hasOfficialLogo: false },
    { id: 'pe_cabify', name: 'Cabify Club', category: 'shopping', defaultAmount: 20.00, icon: 'cabify', color: '#7150E6', hasOfficialLogo: true },
    { id: 'pe_meliplus', name: 'Mercado Libre (Meli+)', category: 'shopping', defaultAmount: 29.90, icon: 'mercadolibre', color: '#FFE600', hasOfficialLogo: true },

    // Gimnasios & Salud Perú
    { id: 'pe_smartfit', name: 'SmartFit Perú', category: 'health', defaultAmount: 99.00, icon: 'smartfit', color: '#FFB81C', hasOfficialLogo: true },
    { id: 'pe_bodytech', name: 'Bodytech Perú', category: 'health', defaultAmount: 150.00, icon: 'dumbbell', color: '#DC2626', hasOfficialLogo: false },
    { id: 'pe_goldsgym', name: "Gold's Gym Perú", category: 'health', defaultAmount: 140.00, icon: 'dumbbell', color: '#FFD700', hasOfficialLogo: false },
    { id: 'pe_b2gym', name: 'B2 Gimnasio', category: 'health', defaultAmount: 110.00, icon: 'dumbbell', color: '#0F172A', hasOfficialLogo: false },
    { id: 'pe_sportlife', name: 'Sportlife Perú', category: 'health', defaultAmount: 130.00, icon: 'dumbbell', color: '#E11D48', hasOfficialLogo: false },
    { id: 'pe_pacifico', name: 'Pacífico Seguros / EPS', category: 'health', defaultAmount: 180.00, icon: 'heart-pulse', color: '#0D9488', hasOfficialLogo: false },
    { id: 'pe_rimac', name: 'Rímac Seguros / EPS', category: 'health', defaultAmount: 165.00, icon: 'shield', color: '#B91C1C', hasOfficialLogo: false },
    { id: 'pe_lapositiva', name: 'La Positiva Seguros', category: 'health', defaultAmount: 140.00, icon: 'shield', color: '#F97316', hasOfficialLogo: false },
    { id: 'pe_mapfre', name: 'Mapfre Perú EPS', category: 'health', defaultAmount: 160.00, icon: 'mapfre', color: '#DC2626', hasOfficialLogo: true },
    { id: 'pe_sanitas', name: 'Sanitas Perú EPS', category: 'health', defaultAmount: 150.00, icon: 'heart-pulse', color: '#0072CE', hasOfficialLogo: false },
    { id: 'pe_oncosalud', name: 'Oncosalud / Auna', category: 'health', defaultAmount: 95.00, icon: 'heart-pulse', color: '#009688', hasOfficialLogo: false },
    { id: 'pe_clinicaint', name: 'Plan Clínica Internacional', category: 'health', defaultAmount: 120.00, icon: 'heart-pulse', color: '#0284C7', hasOfficialLogo: false },

    // Bancos & Tarjetas Perú
    { id: 'pe_bcp_card', name: 'Tarjeta BCP (Membresía / Seguro)', category: 'finance', defaultAmount: 15.00, icon: 'credit-card', color: '#002A8F', hasOfficialLogo: false },
    { id: 'pe_bbva_card', name: 'Tarjeta BBVA (Membresía / Seguro)', category: 'finance', defaultAmount: 15.00, icon: 'bbva', color: '#004481', hasOfficialLogo: true },
    { id: 'pe_ibk_card', name: 'Tarjeta Interbank (Membresía / Seguro)', category: 'finance', defaultAmount: 14.00, icon: 'credit-card', color: '#009B3A', hasOfficialLogo: false },
    { id: 'pe_scotia_card', name: 'Tarjeta Scotiabank (Membresía)', category: 'finance', defaultAmount: 15.00, icon: 'scotiabank', color: '#EC111A', hasOfficialLogo: true },
    { id: 'pe_cmr_card', name: 'Tarjeta Falabella CMR', category: 'finance', defaultAmount: 12.00, icon: 'credit-card', color: '#76BC21', hasOfficialLogo: false },
    { id: 'pe_ripley_card', name: 'Tarjeta Ripley (Membresía / Seguro)', category: 'finance', defaultAmount: 12.00, icon: 'credit-card', color: '#4F008C', hasOfficialLogo: false },
    { id: 'pe_cenco_card', name: 'Tarjeta Cencosud (Wong/Metro)', category: 'finance', defaultAmount: 12.00, icon: 'credit-card', color: '#005696', hasOfficialLogo: false },
    { id: 'pe_oh_card', name: 'Tarjeta Oh! (Plaza Vea/Oechsle)', category: 'finance', defaultAmount: 11.90, icon: 'credit-card', color: '#FF0036', hasOfficialLogo: false },
    { id: 'pe_agora', name: 'Agora Club', category: 'finance', defaultAmount: 9.90, icon: 'credit-card', color: '#00D09C', hasOfficialLogo: false },
    { id: 'pe_prex', name: 'Prex Perú', category: 'finance', defaultAmount: 5.00, icon: 'credit-card', color: '#6A1B9A', hasOfficialLogo: false },

    // Educación & Universidades Perú
    { id: 'pe_icpna', name: 'ICPNA (Pensión Mensual)', category: 'education', defaultAmount: 280.00, icon: 'book-open', color: '#002B49', hasOfficialLogo: false },
    { id: 'pe_britanico', name: 'Británico (Pensión Mensual)', category: 'education', defaultAmount: 290.00, icon: 'book-open', color: '#C8102E', hasOfficialLogo: false },
    { id: 'pe_upc', name: 'UPC (Pensión Universitaria)', category: 'education', defaultAmount: 1800.00, icon: 'graduation-cap', color: '#D00000', hasOfficialLogo: false },
    { id: 'pe_pucp', name: 'PUCP (Pensión Universitaria)', category: 'education', defaultAmount: 1950.00, icon: 'graduation-cap', color: '#002F6C', hasOfficialLogo: false },
    { id: 'pe_ulima', name: 'Universidad de Lima (Pensión)', category: 'education', defaultAmount: 1900.00, icon: 'graduation-cap', color: '#E65100', hasOfficialLogo: false },
    { id: 'pe_usil', name: 'USIL (Pensión Universitaria)', category: 'education', defaultAmount: 1500.00, icon: 'graduation-cap', color: '#003366', hasOfficialLogo: false },
    { id: 'pe_utec', name: 'UTEC (Pensión Universitaria)', category: 'education', defaultAmount: 2100.00, icon: 'graduation-cap', color: '#00A3E0', hasOfficialLogo: false },
    { id: 'pe_usmp', name: 'USMP (San Martín de Porres)', category: 'education', defaultAmount: 1100.00, icon: 'graduation-cap', color: '#780016', hasOfficialLogo: false },
    { id: 'pe_utp', name: 'UTP (Tecnológica del Perú)', category: 'education', defaultAmount: 750.00, icon: 'graduation-cap', color: '#ED1C24', hasOfficialLogo: false },
    { id: 'pe_ucv', name: 'UCV (César Vallejo)', category: 'education', defaultAmount: 550.00, icon: 'graduation-cap', color: '#003087', hasOfficialLogo: false },
    { id: 'pe_cibertec', name: 'Cibertec (Pensión)', category: 'education', defaultAmount: 620.00, icon: 'book-open', color: '#E30613', hasOfficialLogo: false },
    { id: 'pe_isil', name: 'ISIL (Pensión)', category: 'education', defaultAmount: 720.00, icon: 'book-open', color: '#002B49', hasOfficialLogo: false },
    { id: 'pe_tls', name: 'Toulouse Lautrec (Pensión)', category: 'education', defaultAmount: 850.00, icon: 'book-open', color: '#E40046', hasOfficialLogo: false },

    // Vivienda, Seguridad & Arbitrios
    { id: 'pe_mantenimiento', name: 'Mantenimiento Edificio / Condominio', category: 'housing', defaultAmount: 180.00, icon: 'building-2', color: '#475569', hasOfficialLogo: false },
    { id: 'pe_alquiler', name: 'Alquiler Vivienda / Dpto', category: 'housing', defaultAmount: 1200.00, icon: 'home', color: '#0F172A', hasOfficialLogo: false },
    { id: 'pe_arbitrios', name: 'Arbitrios & Predial (SAT / Muni)', category: 'housing', defaultAmount: 90.00, icon: 'landmark', color: '#0284C7', hasOfficialLogo: false },
    { id: 'pe_verisure', name: 'Verisure Alarmas Perú', category: 'housing', defaultAmount: 140.00, icon: 'shield-check', color: '#DC2626', hasOfficialLogo: false },
    { id: 'pe_prosegur', name: 'Prosegur Alarmas Perú', category: 'housing', defaultAmount: 135.00, icon: 'shield-check', color: '#FACC15', hasOfficialLogo: false },

    // Peajes & Autos Perú
    { id: 'pe_pex', name: 'PEX (Peaje Lima Expresa)', category: 'transport', defaultAmount: 50.00, icon: 'car', color: '#FFDD00', hasOfficialLogo: false },
    { id: 'pe_epass', name: 'e-pass (Peaje Rutas de Lima)', category: 'transport', defaultAmount: 50.00, icon: 'car', color: '#00A3E0', hasOfficialLogo: false },
    { id: 'pe_soat', name: 'SOAT Vehicular (Cuota / Anual)', category: 'transport', defaultAmount: 85.00, icon: 'shield', color: '#059669', hasOfficialLogo: false },
    { id: 'pe_cochera', name: 'Cochera / Estacionamiento Mensual', category: 'transport', defaultAmount: 200.00, icon: 'warehouse', color: '#64748B', hasOfficialLogo: false },
    { id: 'pe_cuota_auto', name: 'Cuota Crédito Vehicular', category: 'transport', defaultAmount: 950.00, icon: 'car', color: '#2563EB', hasOfficialLogo: false }
  ],

  // 🇲🇽 MÉXICO
  'México': [
    { id: 'mx_cfe', name: 'CFE (Electricidad México)', category: 'home', defaultAmount: 450.00, icon: 'zap', color: '#00853F', hasOfficialLogo: false },
    { id: 'mx_sacmex', name: 'SACMEX / Agua CDMX', category: 'home', defaultAmount: 280.00, icon: 'droplet', color: '#0072CE', hasOfficialLogo: false },
    { id: 'mx_naturgy', name: 'Naturgy Gas México', category: 'home', defaultAmount: 320.00, icon: 'flame', color: '#EF4444', hasOfficialLogo: false },
    { id: 'mx_telmex', name: 'Telmex / Infinitum Fibra', category: 'services', defaultAmount: 449.00, icon: 'wifi', color: '#0055A5', hasOfficialLogo: false },
    { id: 'mx_totalplay', name: 'Totalplay Fibra', category: 'services', defaultAmount: 559.00, icon: 'wifi', color: '#FF6900', hasOfficialLogo: false },
    { id: 'mx_izzi', name: 'Izzi Telecom', category: 'services', defaultAmount: 480.00, icon: 'wifi', color: '#FF0055', hasOfficialLogo: false },
    { id: 'mx_megacable', name: 'Megacable', category: 'services', defaultAmount: 420.00, icon: 'wifi', color: '#0033A0', hasOfficialLogo: false },
    { id: 'mx_telcel', name: 'Telcel Plan Móvil', category: 'services', defaultAmount: 299.00, icon: 'smartphone', color: '#002B49', hasOfficialLogo: false },
    { id: 'mx_att', name: 'AT&T México Móvil', category: 'services', defaultAmount: 349.00, icon: 'att', color: '#00A8E0', hasOfficialLogo: true },
    { id: 'mx_rappi', name: 'Rappi Prime México', category: 'shopping', defaultAmount: 99.00, icon: 'rappi', color: '#FF441F', hasOfficialLogo: true },
    { id: 'mx_uberone', name: 'Uber One México', category: 'shopping', defaultAmount: 70.00, icon: 'uber', color: '#000000', hasOfficialLogo: true },
    { id: 'mx_meliplus', name: 'Mercado Libre (Meli+)', category: 'shopping', defaultAmount: 130.00, icon: 'mercadolibre', color: '#FFE600', hasOfficialLogo: true },
    { id: 'mx_smartfit', name: 'SmartFit México', category: 'health', defaultAmount: 399.00, icon: 'smartfit', color: '#FFB81C', hasOfficialLogo: true },
    { id: 'mx_gnp', name: 'GNP Seguros', category: 'health', defaultAmount: 850.00, icon: 'shield', color: '#002855', hasOfficialLogo: false },
    { id: 'mx_liverpool', name: 'Tarjeta Liverpool', category: 'finance', defaultAmount: 60.00, icon: 'credit-card', color: '#E4007C', hasOfficialLogo: false },
    { id: 'mx_bbva', name: 'Tarjeta BBVA México', category: 'finance', defaultAmount: 75.00, icon: 'bbva', color: '#004481', hasOfficialLogo: true },
    { id: 'mx_banamex', name: 'Tarjeta Citibanamex', category: 'finance', defaultAmount: 70.00, icon: 'credit-card', color: '#002D62', hasOfficialLogo: false },
    { id: 'mx_tagpase', name: 'Tag PASE / I+D Peajes', category: 'transport', defaultAmount: 300.00, icon: 'car', color: '#00853F', hasOfficialLogo: false }
  ],

  // 🇨🇴 COLOMBIA
  'Colombia': [
    { id: 'co_epm', name: 'EPM (Servicios Públicos Medellín)', category: 'home', defaultAmount: 160000, icon: 'zap', color: '#007A33', hasOfficialLogo: false },
    { id: 'co_enel', name: 'Enel Colombia / Codensa', category: 'home', defaultAmount: 120000, icon: 'zap', color: '#0080FF', hasOfficialLogo: false },
    { id: 'co_acueducto', name: 'Acueducto de Bogotá', category: 'home', defaultAmount: 85000, icon: 'droplet', color: '#0055A5', hasOfficialLogo: false },
    { id: 'co_vanti', name: 'Gas Natural Vanti', category: 'home', defaultAmount: 40000, icon: 'flame', color: '#EF4444', hasOfficialLogo: false },
    { id: 'co_claro', name: 'Claro Hogar / Móvil Colombia', category: 'services', defaultAmount: 95000, icon: 'claro', color: '#DA291C', hasOfficialLogo: true },
    { id: 'co_tigo', name: 'Tigo Hogar / Móvil Colombia', category: 'services', defaultAmount: 85000, icon: 'wifi', color: '#0033A0', hasOfficialLogo: false },
    { id: 'co_movistar', name: 'Movistar Colombia Fibra', category: 'services', defaultAmount: 80000, icon: 'movistar', color: '#019DF4', hasOfficialLogo: true },
    { id: 'co_etb', name: 'ETB Fibra Óptica', category: 'services', defaultAmount: 75000, icon: 'wifi', color: '#004B87', hasOfficialLogo: false },
    { id: 'co_wom', name: 'WOM Móvil Colombia', category: 'services', defaultAmount: 38000, icon: 'smartphone', color: '#6A1B9A', hasOfficialLogo: false },
    { id: 'co_rappi', name: 'Rappi Prime Colombia', category: 'shopping', defaultAmount: 19900, icon: 'rappi', color: '#FF441F', hasOfficialLogo: true },
    { id: 'co_uberone', name: 'Uber One Colombia', category: 'shopping', defaultAmount: 14900, icon: 'uber', color: '#000000', hasOfficialLogo: true },
    { id: 'co_smartfit', name: 'SmartFit Colombia', category: 'health', defaultAmount: 89000, icon: 'smartfit', color: '#FFB81C', hasOfficialLogo: true },
    { id: 'co_bodytech', name: 'Bodytech Colombia', category: 'health', defaultAmount: 140000, icon: 'dumbbell', color: '#DC2626', hasOfficialLogo: false },
    { id: 'co_sura', name: 'Sura EPS / Póliza de Salud', category: 'health', defaultAmount: 210000, icon: 'heart-pulse', color: '#0033A0', hasOfficialLogo: false },
    { id: 'co_sanitas', name: 'Sanitas EPS Colombia', category: 'health', defaultAmount: 180000, icon: 'heart-pulse', color: '#0072CE', hasOfficialLogo: false },
    { id: 'co_flypass', name: 'Flypass Peajes Colombia', category: 'transport', defaultAmount: 60000, icon: 'car', color: '#FFB81C', hasOfficialLogo: false }
  ],

  // 🇦🇷 ARGENTINA
  'Argentina': [
    { id: 'ar_edenor', name: 'Edenor / Edesur (Electricidad)', category: 'home', defaultAmount: 18000, icon: 'zap', color: '#0055A5', hasOfficialLogo: false },
    { id: 'ar_metrogas', name: 'Metrogas / Naturgy', category: 'home', defaultAmount: 9500, icon: 'flame', color: '#EF4444', hasOfficialLogo: false },
    { id: 'ar_aysa', name: 'AySA (Agua y Saneamiento)', category: 'home', defaultAmount: 11000, icon: 'droplet', color: '#0072CE', hasOfficialLogo: false },
    { id: 'ar_personal', name: 'Personal Flow (ex Fibertel)', category: 'services', defaultAmount: 28000, icon: 'wifi', color: '#00A3E0', hasOfficialLogo: false },
    { id: 'ar_telecentro', name: 'Telecentro Fibra', category: 'services', defaultAmount: 24000, icon: 'wifi', color: '#FF0055', hasOfficialLogo: false },
    { id: 'ar_movistar', name: 'Movistar Argentina Fibra', category: 'services', defaultAmount: 22000, icon: 'movistar', color: '#019DF4', hasOfficialLogo: true },
    { id: 'ar_claro', name: 'Claro Argentina Móvil', category: 'services', defaultAmount: 18000, icon: 'claro', color: '#DA291C', hasOfficialLogo: true },
    { id: 'ar_mercadopago', name: 'Mercado Pago (Meli+)', category: 'shopping', defaultAmount: 4999, icon: 'mercadolibre', color: '#009EE3', hasOfficialLogo: true },
    { id: 'ar_pedidosya', name: 'PedidosYa Plus Argentina', category: 'shopping', defaultAmount: 2900, icon: 'deliveryhero', color: '#EA044E', hasOfficialLogo: true },
    { id: 'ar_megatlon', name: 'Megatlon / SportClub', category: 'health', defaultAmount: 45000, icon: 'dumbbell', color: '#DC2626', hasOfficialLogo: false },
    { id: 'ar_osde', name: 'OSDE / Swiss Medical Prepaga', category: 'health', defaultAmount: 95000, icon: 'heart-pulse', color: '#002B49', hasOfficialLogo: false },
    { id: 'ar_telepase', name: 'Telepase Peajes', category: 'transport', defaultAmount: 12000, icon: 'car', color: '#007A33', hasOfficialLogo: false }
  ],

  // 🇨🇱 CHILE
  'Chile': [
    { id: 'cl_enel', name: 'Enel Chile / CGE (Luz)', category: 'home', defaultAmount: 38000, icon: 'zap', color: '#0080FF', hasOfficialLogo: false },
    { id: 'cl_aguas', name: 'Aguas Andinas / Esval', category: 'home', defaultAmount: 22000, icon: 'droplet', color: '#0072CE', hasOfficialLogo: false },
    { id: 'cl_metrogas', name: 'Metrogas Chile / Gasco', category: 'home', defaultAmount: 28000, icon: 'flame', color: '#EF4444', hasOfficialLogo: false },
    { id: 'cl_vtr', name: 'VTR Fibra & Televisión', category: 'services', defaultAmount: 29990, icon: 'wifi', color: '#DA291C', hasOfficialLogo: false },
    { id: 'cl_movistar', name: 'Movistar Chile Fibra', category: 'services', defaultAmount: 25990, icon: 'movistar', color: '#019DF4', hasOfficialLogo: true },
    { id: 'cl_entel', name: 'Entel Chile Fibra / Móvil', category: 'services', defaultAmount: 26990, icon: 'smartphone', color: '#0055A5', hasOfficialLogo: false },
    { id: 'cl_wom', name: 'WOM Chile Móvil', category: 'services', defaultAmount: 14990, icon: 'smartphone', color: '#6A1B9A', hasOfficialLogo: false },
    { id: 'cl_uberone', name: 'Uber One Chile', category: 'shopping', defaultAmount: 3990, icon: 'uber', color: '#000000', hasOfficialLogo: true },
    { id: 'cl_smartfit', name: 'SmartFit Chile', category: 'health', defaultAmount: 24900, icon: 'smartfit', color: '#FFB81C', hasOfficialLogo: true },
    { id: 'cl_isapre', name: 'Isapre Banmédica / Colmena', category: 'health', defaultAmount: 95000, icon: 'heart-pulse', color: '#0033A0', hasOfficialLogo: false },
    { id: 'cl_autopase', name: 'Autopase / TAG Peajes', category: 'transport', defaultAmount: 25000, icon: 'car', color: '#00853F', hasOfficialLogo: false }
  ],

  // 🇪🇸 ESPAÑA
  'España': [
    { id: 'es_iberdrola', name: 'Iberdrola (Luz y Gas)', category: 'home', defaultAmount: 65.00, icon: 'zap', color: '#00853F', hasOfficialLogo: false },
    { id: 'es_endesa', name: 'Endesa Energía', category: 'home', defaultAmount: 60.00, icon: 'zap', color: '#0055A5', hasOfficialLogo: false },
    { id: 'es_naturgy', name: 'Naturgy Luz & Gas', category: 'home', defaultAmount: 55.00, icon: 'flame', color: '#EF4444', hasOfficialLogo: false },
    { id: 'es_canal', name: 'Canal de Isabel II (Agua)', category: 'home', defaultAmount: 28.00, icon: 'droplet', color: '#0072CE', hasOfficialLogo: false },
    { id: 'es_movistar', name: 'Movistar España (O2 Fibra)', category: 'services', defaultAmount: 45.00, icon: 'movistar', color: '#019DF4', hasOfficialLogo: true },
    { id: 'es_vodafone', name: 'Vodafone España / Lowi', category: 'services', defaultAmount: 38.00, icon: 'vodafone', color: '#E60000', hasOfficialLogo: true },
    { id: 'es_orange', name: 'Orange España / Jazztel', category: 'services', defaultAmount: 39.00, icon: 'orange', color: '#FF7900', hasOfficialLogo: true },
    { id: 'es_digi', name: 'Digi Mobil Fibra Pro', category: 'services', defaultAmount: 25.00, icon: 'wifi', color: '#004B93', hasOfficialLogo: false },
    { id: 'es_glovo', name: 'Glovo Prime España', category: 'shopping', defaultAmount: 6.99, icon: 'shopping-bag', color: '#FFC400', hasOfficialLogo: false },
    { id: 'es_uberone', name: 'Uber One España', category: 'shopping', defaultAmount: 4.99, icon: 'uber', color: '#000000', hasOfficialLogo: true },
    { id: 'es_basicfit', name: 'Basic-Fit España', category: 'health', defaultAmount: 24.99, icon: 'dumbbell', color: '#FF6200', hasOfficialLogo: false },
    { id: 'es_sanitas', name: 'Sanitas / Adeslas Seguro', category: 'health', defaultAmount: 55.00, icon: 'heart-pulse', color: '#0072CE', hasOfficialLogo: false },
    { id: 'es_viat', name: 'Bip&Drive / Vía-T Peajes', category: 'transport', defaultAmount: 18.00, icon: 'car', color: '#00853F', hasOfficialLogo: false }
  ],

  // 🇺🇸 UNITED STATES & GLOBAL ENGLISH
  'United States': [
    { id: 'us_coned', name: 'ConEdison / Electric & Gas', category: 'home', defaultAmount: 140.00, icon: 'zap', color: '#0055A5', hasOfficialLogo: false },
    { id: 'us_pge', name: 'PG&E Power & Gas', category: 'home', defaultAmount: 160.00, icon: 'zap', color: '#007A33', hasOfficialLogo: false },
    { id: 'us_xfinity', name: 'Comcast Xfinity Internet', category: 'services', defaultAmount: 75.00, icon: 'wifi', color: '#90278E', hasOfficialLogo: false },
    { id: 'us_spectrum', name: 'Spectrum Internet', category: 'services', defaultAmount: 69.99, icon: 'wifi', color: '#0055A5', hasOfficialLogo: false },
    { id: 'us_att_fiber', name: 'AT&T Fiber / Wireless', category: 'services', defaultAmount: 80.00, icon: 'att', color: '#00A8E0', hasOfficialLogo: true },
    { id: 'us_verizon', name: 'Verizon Fios / 5G Wireless', category: 'services', defaultAmount: 85.00, icon: 'verizon', color: '#CD040B', hasOfficialLogo: true },
    { id: 'us_tmobile', name: 'T-Mobile Magenta Wireless', category: 'services', defaultAmount: 70.00, icon: 'tmobile', color: '#E20074', hasOfficialLogo: true },
    { id: 'us_hulu', name: 'Hulu + Live TV', category: 'entertainment', defaultAmount: 17.99, icon: 'hulu', color: '#1CE783', hasOfficialLogo: true },
    { id: 'us_peacock', name: 'Peacock Premium', category: 'entertainment', defaultAmount: 7.99, icon: 'peacock', color: '#000000', hasOfficialLogo: true },
    { id: 'us_dashpass', name: 'DoorDash DashPass', category: 'shopping', defaultAmount: 9.99, icon: 'doordash', color: '#FF3008', hasOfficialLogo: true },
    { id: 'us_uberone', name: 'Uber One', category: 'shopping', defaultAmount: 9.99, icon: 'uber', color: '#000000', hasOfficialLogo: true },
    { id: 'us_instacart', name: 'Instacart+', category: 'shopping', defaultAmount: 9.99, icon: 'instacart', color: '#43B02A', hasOfficialLogo: true },
    { id: 'us_amazonprime', name: 'Amazon Prime Membership', category: 'shopping', defaultAmount: 14.99, icon: 'amazon', color: '#FF9900', hasOfficialLogo: true },
    { id: 'us_costco', name: 'Costco Gold Star', category: 'shopping', defaultAmount: 5.40, icon: 'shopping-bag', color: '#E31837', hasOfficialLogo: false },
    { id: 'us_planetfitness', name: 'Planet Fitness Black Card', category: 'health', defaultAmount: 24.99, icon: 'dumbbell', color: '#5B2C6F', hasOfficialLogo: false },
    { id: 'us_equinox', name: 'Equinox Fitness Club', category: 'health', defaultAmount: 280.00, icon: 'dumbbell', color: '#000000', hasOfficialLogo: false },
    { id: 'us_geico', name: 'GEICO Auto Insurance', category: 'transport', defaultAmount: 120.00, icon: 'shield', color: '#003366', hasOfficialLogo: false },
    { id: 'us_ezpass', name: 'E-ZPass Tolls', category: 'transport', defaultAmount: 45.00, icon: 'car', color: '#90278E', hasOfficialLogo: false }
  ]
};

/**
 * Returns complete list of services for a given country (Country-specific + Global)
 */
export function getServicesForCountry(countryName = 'Perú') {
  const specific = COUNTRY_SERVICES[countryName] || [];
  
  // Combine specific first, then global (deduplicating by id)
  const combined = [...specific, ...GLOBAL_SERVICES];
  const seen = new Set();
  return combined.filter(item => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

/**
 * Gets the list of available countries with rich specialized catalogues
 */
export const AVAILABLE_CATALOG_COUNTRIES = [
  'Perú',
  'México',
  'Colombia',
  'Argentina',
  'Chile',
  'España',
  'United States',
  'Internacional'
];
