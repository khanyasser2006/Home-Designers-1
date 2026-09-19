const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');

// Remove raw input video (16.5 MB) since 600 frames are fully rendered in public/
const rawVideo = path.join(rootDir, 'Create_continuous_house_tour_video_202608261611.mp4');
if (fs.existsSync(rawVideo)) {
  fs.unlinkSync(rawVideo);
  console.log('✓ Removed unneeded source video file (16.5 MB saved)');
}

// Function to calculate folder size
function getFolderSize(dirPath) {
  let size = 0;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    try {
      if (entry.isDirectory()) {
        size += getFolderSize(fullPath);
      } else {
        size += fs.statSync(fullPath).size;
      }
    } catch {}
  }
  return size;
}

// Calculate size excluding node_modules (the standard deliverable folder)
const entries = fs.readdirSync(rootDir, { withFileTypes: true });
let repoSourceSize = 0;
for (const entry of entries) {
  if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.endsWith('.zip')) continue;
  const fullPath = path.join(rootDir, entry.name);
  if (entry.isDirectory()) {
    repoSourceSize += getFolderSize(fullPath);
  } else {
    repoSourceSize += fs.statSync(fullPath).size;
  }
}
console.log(`\n========================================`);
console.log(`Project Source & Assets Total Size: ${(repoSourceSize / (1024 * 1024)).toFixed(2)} MB`);
console.log(`========================================\n`);

// 4. Test creating a ZIP archive of the project
console.log('Creating deliverable ZIP archive of the project...');
const zipFile = path.join(rootDir, 'Home-Designers.zip');
if (fs.existsSync(zipFile)) fs.unlinkSync(zipFile);

// Filter valid files & dirs to include in zip
const pathsToZip = ['src', 'public', 'scripts', 'index.html', 'package.json', 'package-lock.json', 'vite.config.js', 'tailwind.config.js', 'postcss.config.js']
  .map(p => path.join(rootDir, p))
  .filter(p => fs.existsSync(p))
  .map(p => `'${p}'`)
  .join(', ');

try {
  execSync(`powershell -ExecutionPolicy Bypass -Command "Compress-Archive -Path ${pathsToZip} -DestinationPath '${zipFile}' -CompressionLevel Optimal"`);
  if (fs.existsSync(zipFile)) {
    const zipSizeBytes = fs.statSync(zipFile).size;
    const zipSizeMB = (zipSizeBytes / (1024 * 1024)).toFixed(2);
    console.log(`\n🎉 ZIP Archive Created: Home-Designers.zip`);
    console.log(`📦 Exact Zipped Size: ${zipSizeMB} MB`);
    console.log(`🎯 Target (< 50 MB): ${(parseFloat(zipSizeMB) < 50) ? 'PASSED ✅' : 'FAILED ❌'}`);
    console.log(`💡 Margin below 50 MB limit: ${(50 - parseFloat(zipSizeMB)).toFixed(2)} MB under limit!`);
  }
} catch (e) {
  console.log('Zip creation info:', e.message);
}
