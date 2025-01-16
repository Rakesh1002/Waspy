const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function generateIcons() {
  const outputDir = path.join(__dirname, '../client/public/logos');

  // Create output directory if it doesn't exist
  try {
    await fs.mkdir(outputDir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }

  // Create SVG with centered chat bubble
  const svg = `
    <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#9333EA" />
          <stop offset="50%" style="stop-color:#3B82F6" />
          <stop offset="100%" style="stop-color:#14B8A6" />
        </linearGradient>
      </defs>
      
      <!-- Perfectly centered chat bubble -->
      <g transform="translate(256, 256)">
        <g transform="scale(16)">
          <!-- Move anchor point to center of the bubble -->
          <g transform="translate(-20, -20)">
            <path d="M20 8C13.373 8 8 12.373 8 18C8 21.084 9.574 23.834 12 25.562V32L18.438 28.562C18.946 28.654 19.466 28.75 20 28.75C26.627 28.75 32 24.377 32 18.75C32 13.123 26.627 8 20 8Z" fill="url(#gradient)"/>
          </g>
        </g>
      </g>
    </svg>
  `;

  const tempSvgPath = path.join(outputDir, 'temp-icon.svg');
  
  try {
    // Write temporary SVG file
    await fs.writeFile(tempSvgPath, svg);

    // Generate both sizes
    const sizes = [512, 1024];
    
    for (const size of sizes) {
      await sharp(tempSvgPath)
        .resize(size, size)
        .png()
        .toFile(path.join(outputDir, `logo-icon-${size}x${size}.png`));

      console.log(`Generated ${size}x${size} icon`);
    }
  } finally {
    // Clean up temporary file
    await fs.unlink(tempSvgPath);
  }
}

generateIcons().catch(console.error); 