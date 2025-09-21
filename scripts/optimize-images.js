#!/usr/bin/env node
/* eslint-env node */
/* eslint-disable no-process-exit */

/**
 * Image Optimization Script
 * Converts images to WebP format and generates multiple sizes
 *
 * Usage: node scripts/optimize-images.js
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const __filename = fileURLToPath(import.meta.url);

// Configuration
const INPUT_DIR = 'public/images';
const OUTPUT_DIR = 'public/images';
const SIZES = [480, 800, 1200, 1600]; // Responsive image sizes

/**
 * Check if ImageMagick or cwebp is available
 */
function commandExists(cmd, args = ['--version']) {
  try {
    execSync(`${cmd} ${args.join(' ')}`, { stdio: 'ignore' });
    return true;
  } catch {
    try {
      const locator = process.platform === 'win32' ? 'where' : 'which';
      execSync(`${locator} ${cmd}`, { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }
}

let SELECTED_TOOL = null;
function checkDependencies() {
  if (SELECTED_TOOL) return SELECTED_TOOL;

  if (commandExists('cwebp', ['-version'])) {
    SELECTED_TOOL = 'cwebp';
    return SELECTED_TOOL;
  }
  // Prefer 'magick' on Windows for ImageMagick, fallback to 'convert' on Unix
  if (commandExists('magick', ['-version'])) {
    SELECTED_TOOL = 'magick';
    return SELECTED_TOOL;
  }
  if (commandExists('convert', ['-version'])) {
    SELECTED_TOOL = 'convert';
    return SELECTED_TOOL;
  }

  console.error('❌ No image tool found. Please install one of them:');
  console.error('   - cwebp (recommended): https://developers.google.com/speed/webp/download');
  console.error('   - ImageMagick: https://imagemagick.org (use "magick" on Windows)');
  process.exit(1);
}

/**
 * Get all image files from input directory
 */
function getImageFiles() {
  if (!fs.existsSync(INPUT_DIR)) {
    console.log(`📁 Creating directory: ${INPUT_DIR}`);
    fs.mkdirSync(INPUT_DIR, { recursive: true });
    return [];
  }

  const files = fs.readdirSync(INPUT_DIR);
  return files.filter(file =>
    /\.(jpg|jpeg|png|gif|bmp)$/i.test(file) &&
    !file.includes('.webp')
  );
}

/**
 * Convert image to WebP format
 */
function convertToWebP(inputPath, outputPath, quality = 85) {
  const tool = checkDependencies();

  try {
    if (tool === 'cwebp') {
      execSync(`cwebp -q ${quality} "${inputPath}" -o "${outputPath}"`, { stdio: 'pipe' });
    } else if (tool === 'magick') {
      execSync(`magick "${inputPath}" -quality ${quality} "${outputPath}"`, { stdio: 'pipe' });
    } else {
      execSync(`convert "${inputPath}" -quality ${quality} "${outputPath}"`, { stdio: 'pipe' });
    }
    console.log(`✅ Converted: ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`❌ Failed to convert ${inputPath}:`, error.message);
  }
}

/**
 * Generate responsive images
 */
function generateResponsiveImages(imagePath) {
  const baseName = path.basename(imagePath, path.extname(imagePath));
  const inputPath = path.join(INPUT_DIR, imagePath);

  console.log(`\n🔄 Processing: ${baseName}`);

  // Generate WebP versions for different sizes
  SIZES.forEach(size => {
    const outputPath = path.join(OUTPUT_DIR, `${baseName}-${size}.webp`);

    try {
      const tool = checkDependencies();
      if (tool === 'cwebp') {
        execSync(`cwebp -q 85 -resize ${size} 0 "${inputPath}" -o "${outputPath}"`, { stdio: 'pipe' });
      } else if (tool === 'magick') {
        execSync(`magick "${inputPath}" -resize ${size}x -quality 85 "${outputPath}"`, { stdio: 'pipe' });
      } else {
        execSync(`convert "${inputPath}" -resize ${size}x -quality 85 "${outputPath}"`, { stdio: 'pipe' });
      }
      console.log(`  📏 Generated: ${size}px version`);
    } catch (error) {
      console.error(`  ❌ Failed to generate ${size}px version:`, error.message);
    }
  });

  // Generate main WebP version
  const mainWebPPath = path.join(OUTPUT_DIR, `${baseName}.webp`);
  convertToWebP(inputPath, mainWebPPath);
}

/**
 * Main execution function
 */
function main() {
  console.log('🖼️  Image Optimization Script');
  console.log('==============================\n');

  const imageFiles = getImageFiles();

  if (imageFiles.length === 0) {
    console.log('📁 No images found to optimize in', INPUT_DIR);
    return;
  }

  console.log(`📂 Found ${imageFiles.length} image(s) to optimize:\n`);

  imageFiles.forEach((file, index) => {
    console.log(`  ${index + 1}. ${file}`);
  });

  console.log('\n🚀 Starting optimization...\n');

  imageFiles.forEach(generateResponsiveImages);

  console.log('\n✅ Image optimization completed!');
  console.log('\n💡 Tips:');
  console.log('   - Use the OptimizedImage component for lazy loading');
  console.log('   - WebP images will be served automatically to supporting browsers');
  console.log('   - Fallback images are preserved for older browsers');
}

// Run the script
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  main();
}

export {
  convertToWebP,
  generateResponsiveImages,
  getImageFiles
};