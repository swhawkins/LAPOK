const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconSizes = [192, 512];
const splashSizes = [
  { width: 640, height: 1136 },  // iPhone SE, iPod Touch
  { width: 750, height: 1334 },  // iPhone 8, 7, 6s, 6
  { width: 1242, height: 2208 }, // iPhone 8 Plus, 7 Plus, 6s Plus, 6 Plus
  { width: 1125, height: 2436 }, // iPhone X, XS
  { width: 1242, height: 2688 }, // iPhone XS Max
  { width: 828, height: 1792 },  // iPhone XR
  { width: 1242, height: 2688 }, // iPhone 11 Pro Max
  { width: 1125, height: 2436 }, // iPhone 11 Pro
  { width: 828, height: 1792 },  // iPhone 11
  { width: 1242, height: 2688 }, // iPhone 12 Pro Max
  { width: 1170, height: 2532 }, // iPhone 12 Pro
  { width: 1170, height: 2532 }, // iPhone 12
  { width: 1242, height: 2688 }, // iPhone 13 Pro Max
  { width: 1170, height: 2532 }, // iPhone 13 Pro
  { width: 1170, height: 2532 }, // iPhone 13
  { width: 1284, height: 2778 }, // iPhone 13 Pro Max
  { width: 1179, height: 2556 }, // iPhone 14 Pro
  { width: 1284, height: 2778 }, // iPhone 14 Pro Max
  { width: 1179, height: 2556 }, // iPhone 14
  { width: 1284, height: 2778 }, // iPhone 14 Plus
  { width: 1179, height: 2556 }, // iPhone 15 Pro
  { width: 1284, height: 2778 }, // iPhone 15 Pro Max
  { width: 1179, height: 2556 }, // iPhone 15
  { width: 1284, height: 2778 }, // iPhone 15 Plus
  { width: 1080, height: 1920 }, // Android devices
  { width: 1440, height: 2560 }  // Android devices
];

const inputIconSvg = path.join(__dirname, '../public/icons/icon.svg');
const inputSplashSvg = path.join(__dirname, '../public/icons/splash.svg');
const inputSplashDarkSvg = path.join(__dirname, '../public/icons/splash-dark.svg');
const outputDir = path.join(__dirname, '../public/icons');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate icon PNG files
iconSizes.forEach(size => {
  sharp(inputIconSvg)
    .resize(size, size)
    .png()
    .toFile(path.join(outputDir, `icon-${size}.png`))
    .then(() => console.log(`Generated icon-${size}.png`))
    .catch(err => console.error(`Error generating icon-${size}.png:`, err));
});

// Generate light mode splash screen PNG files
splashSizes.forEach(({ width, height }) => {
  const filename = `splash-${width}x${height}.png`;
  sharp(inputSplashSvg)
    .resize(width, height)
    .png()
    .toFile(path.join(outputDir, filename))
    .then(() => console.log(`Generated ${filename}`))
    .catch(err => console.error(`Error generating ${filename}:`, err));
});

// Generate dark mode splash screen PNG files
splashSizes.forEach(({ width, height }) => {
  const filename = `splash-dark-${width}x${height}.png`;
  sharp(inputSplashDarkSvg)
    .resize(width, height)
    .png()
    .toFile(path.join(outputDir, filename))
    .then(() => console.log(`Generated ${filename}`))
    .catch(err => console.error(`Error generating ${filename}:`, err));
}); 