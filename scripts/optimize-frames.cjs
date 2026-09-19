const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ffmpeg = 'C:\\Users\\123\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0-full_build\\bin\\ffmpeg.exe';
const framesDir = path.join(__dirname, '../public/cabinet_frames_600fps');
const files = fs.readdirSync(framesDir).filter(f => f.endsWith('.jpg'));

console.log(`Optimizing ${files.length} frames in public/cabinet_frames_600fps...`);
const startTime = Date.now();

const tempDir = path.join(__dirname, '../public/cabinet_frames_opt');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

// Batch convert using 1280x720 with q:v 8 for ultra crisp visuals and compact size
let totalOriginal = 0;
let totalOptimized = 0;

for (let i = 0; i < files.length; i++) {
  const f = files[i];
  const src = path.join(framesDir, f);
  const dst = path.join(tempDir, f);
  totalOriginal += fs.statSync(src).size;

  execSync(`"${ffmpeg}" -v error -y -i "${src}" -vf scale=1280:720 -q:v 8 "${dst}"`);
  totalOptimized += fs.statSync(dst).size;

  if ((i + 1) % 100 === 0 || i === files.length - 1) {
    console.log(`Processed ${i + 1}/${files.length} frames...`);
  }
}

console.log(`Original Size: ${(totalOriginal / (1024 * 1024)).toFixed(2)} MB`);
console.log(`Optimized Size: ${(totalOptimized / (1024 * 1024)).toFixed(2)} MB`);
console.log(`Savings: ${(((totalOriginal - totalOptimized) / totalOriginal) * 100).toFixed(1)}%`);
console.log(`Time taken: ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
