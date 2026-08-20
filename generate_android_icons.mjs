import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';

const svgPath = path.resolve('public/icon.svg');
const svgContent = fs.readFileSync(svgPath, 'utf8');

// Render SVG to PNG at specific size
function renderSvgToPng(svgStr, width, height) {
  const resvg = new Resvg(svgStr, {
    fitTo: {
      mode: 'width',
      value: width
    }
  });
  const pngData = resvg.render();
  return pngData.asPng();
}

const resDir = path.resolve('android/app/src/main/res');

const iconSizes = [
  { folder: 'mipmap-mdpi', size: 48 },
  { folder: 'mipmap-hdpi', size: 72 },
  { folder: 'mipmap-xhdpi', size: 96 },
  { folder: 'mipmap-xxhdpi', size: 144 },
  { folder: 'mipmap-xxxhdpi', size: 192 }
];

console.log('Generating Android App Icons...');

for (const { folder, size } of iconSizes) {
  const targetDir = path.join(resDir, folder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const png = renderSvgToPng(svgContent, size, size);

  fs.writeFileSync(path.join(targetDir, 'ic_launcher.png'), png);
  fs.writeFileSync(path.join(targetDir, 'ic_launcher_round.png'), png);
  fs.writeFileSync(path.join(targetDir, 'ic_launcher_foreground.png'), png);
  console.log(`✓ ${folder} (${size}x${size})`);
}

// Splash screens
const splashSizes = [
  { folder: 'drawable', w: 480, h: 800 },
  { folder: 'drawable-port-mdpi', w: 320, h: 480 },
  { folder: 'drawable-port-hdpi', w: 480, h: 800 },
  { folder: 'drawable-port-xhdpi', w: 720, h: 1280 },
  { folder: 'drawable-port-xxhdpi', w: 960, h: 1600 },
  { folder: 'drawable-port-xxxhdpi', w: 1280, h: 1920 }
];

for (const { folder, w, h } of splashSizes) {
  const targetDir = path.join(resDir, folder);
  if (fs.existsSync(targetDir)) {
    const png = renderSvgToPng(svgContent, w, w);
    fs.writeFileSync(path.join(targetDir, 'splash.png'), png);
  }
}

console.log('All Android icons and splashes updated with VALO logo!');
