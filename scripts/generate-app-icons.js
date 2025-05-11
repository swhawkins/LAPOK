import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define icon sizes for different devices
const iconSizes = [
  { size: 152, name: 'icon-152' },
  { size: 167, name: 'icon-167' },
  { size: 180, name: 'icon-180' },
  { size: 192, name: 'icon-192' },
  { size: 512, name: 'icon-512' }
];

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to create an app icon
async function createAppIcon(size) {
  const { size: iconSize, name } = size;
  const outputPath = path.join(outputDir, `${name}.png`);

  // Create a base image with the header logo
  const logo = await sharp(path.join(__dirname, '../public/images/ok-logo.svg'))
    .resize(Math.round(iconSize * 0.7), Math.round(iconSize * 0.7)) // Logo size relative to icon
    .toBuffer();

  // Create the icon with blue background
  await sharp({
    create: {
      width: iconSize,
      height: iconSize,
      channels: 4,
      background: { r: 37, g: 99, b: 235, alpha: 1 } // blue-600
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

  console.log(`Generated ${name}.png`);
}

// Generate all app icons
async function generateAllAppIcons() {
  console.log('Generating app icons...');
  
  for (const size of iconSizes) {
    await createAppIcon(size);
  }
  
  console.log('All app icons generated successfully!');
}

// Run the script
generateAllAppIcons().catch(console.error); 