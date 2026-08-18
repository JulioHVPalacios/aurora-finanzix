const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const svgPath = path.join(__dirname, '../public/icon.svg');
const svgCode = fs.readFileSync(svgPath, 'utf8');

// Generate 192x192
const resvg192 = new Resvg(svgCode, {
  fitTo: { mode: 'width', value: 192 }
});
const png192 = resvg192.render().asPng();
fs.writeFileSync(path.join(__dirname, '../public/icon-192.png'), png192);
console.log('Created public/icon-192.png (192x192)');

// Generate 512x512
const resvg512 = new Resvg(svgCode, {
  fitTo: { mode: 'width', value: 512 }
});
const png512 = resvg512.render().asPng();
fs.writeFileSync(path.join(__dirname, '../public/icon-512.png'), png512);
fs.writeFileSync(path.join(__dirname, '../public/icon-maskable-512.png'), png512);
console.log('Created public/icon-512.png (512x512)');

// Generate high quality screenshots for PWABuilder / Store
// Wide Desktop (1280x720)
const wideSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <radialGradient id="bg" cx="50%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </radialGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#bg)"/>
  <circle cx="640" cy="300" r="140" fill="#10B981" opacity="0.15" filter="blur(40px)"/>
  <g transform="translate(540, 160) scale(0.4)">
    ${svgCode.replace(/<\/?svg[^>]*>/g, '')}
  </g>
  <text x="640" y="440" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="42" font-weight="800" text-anchor="middle" letter-spacing="-1">VALO OS</text>
  <text x="640" y="480" fill="#94A3B8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="600" text-anchor="middle">Financial Intelligence &amp; Personal Expense Engine</text>
</svg>
`;

const resvgWide = new Resvg(wideSvg, { fitTo: { mode: 'width', value: 1280 } });
fs.writeFileSync(path.join(__dirname, '../public/screenshot-desktop.png'), resvgWide.render().asPng());
console.log('Created public/screenshot-desktop.png (1280x720)');

// Mobile Narrow (720x1280)
const mobileSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280" viewBox="0 0 720 1280">
  <defs>
    <radialGradient id="bgM" cx="50%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </radialGradient>
  </defs>
  <rect width="720" height="1280" fill="url(#bgM)"/>
  <circle cx="360" cy="500" r="180" fill="#10B981" opacity="0.15" filter="blur(50px)"/>
  <g transform="translate(235, 360) scale(0.5)">
    ${svgCode.replace(/<\/?svg[^>]*>/g, '')}
  </g>
  <text x="360" y="700" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="800" text-anchor="middle" letter-spacing="-1">VALO OS</text>
  <text x="360" y="745" fill="#94A3B8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="600" text-anchor="middle">Control de Gastos &amp; Pagos Fijos</text>
</svg>
`;

const resvgMobile = new Resvg(mobileSvg, { fitTo: { mode: 'width', value: 720 } });
fs.writeFileSync(path.join(__dirname, '../public/screenshot-mobile.png'), resvgMobile.render().asPng());
console.log('Created public/screenshot-mobile.png (720x1280)');
