import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define splash screen sizes for different iOS devices
const splashSizes = [
  // iPad Pro 12.9"
  { width: 2048, height: 2732, name: 'splash-2048x2732' },
  // iPad Pro 11"
  { width: 1668, height: 2388, name: 'splash-1668x2388' },
  // iPad Air, iPad Mini
  { width: 1536, height: 2048, name: 'splash-1536x2048' },
  // iPhone X/XS/11 Pro
  { width: 1125, height: 2436, name: 'splash-1125x2436' },
  // iPhone XS Max/11 Pro Max
  { width: 1242, height: 2688, name: 'splash-1242x2688' },
  // iPhone XR/11
  { width: 828, height: 1792, name: 'splash-828x1792' },
  // iPhone 8 Plus
  { width: 1242, height: 2208, name: 'splash-1242x2208' },
  // iPhone 8
  { width: 750, height: 1334, name: 'splash-750x1334' },
  // iPhone SE
  { width: 640, height: 1136, name: 'splash-640x1136' }
];

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to create a splash screen image
async function createSplashScreen(size, isDark = false) {
  const { width, height, name } = size;
  const fileName = isDark ? `${name}-dark.png` : `${name}.png`;
  const outputPath = path.join(outputDir, fileName);

  // Create a base image with the app logo
  const logo = await sharp(path.join(__dirname, '../public/images/ok-logo.svg'))
    .resize(Math.round(width * 0.3), Math.round(height * 0.3)) // Logo size relative to screen, integers only
    .toBuffer();

  // Create the splash screen
  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: isDark ? { r: 31, g: 41, b: 55, alpha: 1 } : { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite([
      {
        input: logo,
        gravity: 'center'
      }
    ])
    .png()
    .toFile(outputPath);

  console.log(`Generated ${fileName}`);
}

// Generate all splash screens
async function generateAllSplashScreens() {
  console.log('Generating splash screens...');
  
  // Generate light mode splash screens
  for (const size of splashSizes) {
    await createSplashScreen(size, false);
  }
  
  // Generate dark mode splash screens
  for (const size of splashSizes) {
    await createSplashScreen(size, true);
  }
  
  console.log('All splash screens generated successfully!');
}

// Run the script
generateAllSplashScreens().catch(console.error); 