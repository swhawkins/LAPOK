const sharp = require('sharp');

const src = 'public/icons/icon-192.png';
const targets = [
  { size: 180, out: 'public/icons/icon-180.png' },
  { size: 152, out: 'public/icons/icon-152.png' },
  { size: 167, out: 'public/icons/icon-167.png' },
];

(async () => {
  for (const { size, out } of targets) {
    await sharp(src)
      .resize(size, size)
      .toFile(out);
    console.log(`Generated ${out}`);
  }
})(); 