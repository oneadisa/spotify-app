// This script will be used to download all required assets from Figma
// Run with: node scripts/fetch-assets.js

// Note: In a real scenario, we would use the Figma API to fetch these assets
// For now, we'll create placeholder images for development

import { createCanvas } from 'canvas';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { createWriteStream } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create directories if they don't exist
const directories = [
  'assets/images/home/recentlyPlayed',
  'assets/images/home/madeForYou'
];

// Create placeholder images for development
const createPlaceholderImage = async (width, height, color, text, outputPath) => {
  try {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Fill with color
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    
    // Add text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);
    
    // Save to file
    const buffer = canvas.toBuffer('image/png');
    await fs.writeFile(outputPath, buffer);
    return outputPath;
  } catch (error) {
    console.error(`Error creating placeholder image ${outputPath}:`, error);
    throw error;
  }
};

// Check if file exists (async version)
const fileExists = async (path) => {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
};

// Create all required placeholder images
const createPlaceholderAssets = async () => {
  // Create directories
  for (const dir of directories) {
    try {
      await fs.mkdir(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }

  // Recently played album covers
  const recentlyPlayedCovers = [
    { name: 'mix1.jpg', color: '#1E3264', text: 'Daily Mix 1' },
    { name: 'discover.jpg', color: '#8D67AB', text: 'Discover' },
    { name: 'chill.jpg', color: '#E8115B', text: 'Chill Hits' },
  ];

  // Made for you playlists
  const madeForYouCovers = [
    { name: 'mix2.jpg', color: '#148A08', text: 'Daily Mix 2' },
    { name: 'mix3.jpg', color: '#E91429', text: 'Daily Mix 3' },
    { name: 'releases.jpg', color: '#B49BC8', text: 'Releases' },
    { name: 'discover.jpg', color: '#8D67AB', text: 'Discover' },
  ];

  // Create placeholder images
  for (const cover of recentlyPlayedCovers) {
    const outputPath = path.join('assets/images/home/recentlyPlayed', cover.name);
    if (!(await fileExists(outputPath))) {
      await createPlaceholderImage(160, 160, cover.color, cover.text, outputPath);
      console.log(`Created placeholder: ${outputPath}`);
    }
  }

  for (const cover of madeForYouCovers) {
    const outputPath = path.join('assets/images/home/madeForYou', cover.name);
    if (!(await fileExists(outputPath))) {
      await createPlaceholderImage(160, 160, cover.color, cover.text, outputPath);
      console.log(`Created placeholder: ${outputPath}`);
    }
  }
};

// Run the script
createPlaceholderAssets()
  .then(() => console.log('Placeholder assets created successfully'))
  .catch(console.error);
