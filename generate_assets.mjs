import fs from 'fs';
import { Resvg } from '@resvg/resvg-js';
import path from 'path';

const outDir = 'PlayStoreAssets';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}

// 1. GENERATE FEATURE GRAPHIC (1024 x 500)
const featureSvg = `
<svg width="1024" height="500" viewBox="0 0 1024 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="15" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect width="1024" height="500" fill="url(#bg)" />
  <circle cx="200" cy="100" r="180" fill="#3b82f6" opacity="0.15" filter="url(#glow)"/>
  <circle cx="850" cy="450" r="250" fill="#60a5fa" opacity="0.1" filter="url(#glow)"/>
  
  <text x="512" y="240" font-family="sans-serif" font-size="90" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">VALO OS</text>
  <text x="512" y="320" font-family="sans-serif" font-size="34" font-weight="300" fill="#93c5fd" text-anchor="middle" letter-spacing="1">Finanzas Personales y Presupuestos</text>
</svg>`;

const featureResvg = new Resvg(featureSvg, { fitTo: { mode: 'width', value: 1024 } });
fs.writeFileSync(path.join(outDir, '01_feature_graphic_1024x500.png'), featureResvg.render().asPng());
console.log('✅ Feature graphic created');

// 2. COPY ICON (512 x 512)
if (fs.existsSync('public/icon-512.png')) {
    fs.copyFileSync('public/icon-512.png', path.join(outDir, '00_icon_512x512.png'));
    console.log('✅ Icon copied');
}

// 3. GET EXISTING SCREENSHOTS AND FRAME THEM
const rawScreenshots = [
    'public/screenshot-mobile.png',
    'public/screenshot-1.png'
];

let counter = 1;
for (const file of rawScreenshots) {
    if (fs.existsSync(file)) {
        try {
            const imgBuffer = fs.readFileSync(file);
            const base64Img = imgBuffer.toString('base64');
            const mime = file.endsWith('.png') ? 'image/png' : 'image/jpeg';
            const dataUri = 'data:' + mime + ';base64,' + base64Img;
            
            const framedSvg = `
            <svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <defs>
                    <linearGradient id="bgFrame" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#f8fafc" />
                        <stop offset="100%" stop-color="#e2e8f0" />
                    </linearGradient>
                    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
                      <feDropShadow dx="0" dy="25" stdDeviation="25" flood-color="#0f172a" flood-opacity="0.25"/>
                    </filter>
                    <clipPath id="screenClip">
                        <rect width="770" height="1470" x="15" y="15" rx="45" />
                    </clipPath>
                </defs>
                <rect width="1080" height="1920" fill="url(#bgFrame)" />
                
                <text x="540" y="200" font-family="sans-serif" font-size="60" font-weight="bold" fill="#0f172a" text-anchor="middle">Domina tus Finanzas</text>
                
                <g filter="url(#shadow)" transform="translate(140, 280)">
                    <rect width="800" height="1500" rx="60" fill="#1e293b" />
                    <rect width="770" height="1470" x="15" y="15" rx="45" fill="#ffffff" />
                    <image href="${dataUri}" x="15" y="15" width="770" height="1470" preserveAspectRatio="xMidYMid slice" clip-path="url(#screenClip)" />
                    <rect width="200" height="30" x="300" y="15" rx="15" fill="#1e293b" />
                </g>
            </svg>`;
            
            const frameResvg = new Resvg(framedSvg, { fitTo: { mode: 'width', value: 1080 } });
            fs.writeFileSync(path.join(outDir, '02_screenshot_framed_' + counter + '.png'), frameResvg.render().asPng());
            console.log('✅ Framed screenshot ' + counter + ' created');
            counter++;
        } catch (err) {
            console.log("Could not process screenshot: ", err.message);
        }
    }
}

console.log('🎉 Todo listo en la carpeta PlayStoreAssets/');
