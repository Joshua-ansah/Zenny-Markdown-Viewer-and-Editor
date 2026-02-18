#!/usr/bin/env node

/**
 * Generate a simple placeholder icon for Zenny Markdown Viewer
 * Creates a 1024x1024 PNG with a gradient background
 */

const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const SIZE = 1024;
const iconDir = path.join(__dirname, '..', 'build', 'icons');

// Ensure directory exists
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Create PNG
const png = new PNG({ width: SIZE, height: SIZE });

// Fill with gradient (purple to blue)
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const idx = (SIZE * y + x) << 2;
    
    // Gradient from purple-ish to blue-ish
    const ratio = (x + y) / (SIZE * 2);
    png.data[idx] = Math.floor(102 + ratio * (118 - 102));     // R: 102->118
    png.data[idx + 1] = Math.floor(126 + ratio * (75 - 126));  // G: 126->75  
    png.data[idx + 2] = Math.floor(234 + ratio * (162 - 234)); // B: 234->162
    png.data[idx + 3] = 255; // Alpha
  }
}

// Draw a simple rounded square outline for "document" look
const drawRect = (x1, y1, x2, y2, color) => {
  for (let y = y1; y < y2; y++) {
    for (let x = x1; x < x2; x++) {
      if ((y === y1 || y === y2 - 1 || x === x1 || x === x2 - 1) && 
          x >= 0 && x < SIZE && y >= 0 && y < SIZE) {
        const idx = (SIZE * y + x) << 2;
        png.data[idx] = color[0];     // R
        png.data[idx + 1] = color[1]; // G
        png.data[idx + 2] = color[2]; // B
        png.data[idx + 3] = color[3]; // A
      }
    }
  }
};

// Draw white document outline
const white = [255, 255, 255, 255];
const margin = 200;
const thickness = 30;

for (let t = 0; t < thickness; t++) {
  drawRect(margin + t, margin + t, SIZE - margin - t, SIZE - margin - t, white);
}

// Save PNG
const pngPath = path.join(iconDir, 'icon.png');
png.pack().pipe(fs.createWriteStream(pngPath));

console.log('✓ Creating PNG icon:', pngPath);
console.log('\nNext step: Run electron-icon-builder to generate all icon formats');
console.log('Command: npx electron-icon-builder --input=./build/icons/icon.png --output=./build/icons --flatten');
