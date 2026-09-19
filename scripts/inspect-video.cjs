const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const videoPath = 'D:\\Home-Designers-1\\Create_continuous_house_tour_video_202608261611.mp4';
try {
  const probe = execSync(`ffmpeg -i "${videoPath}" 2>&1`, { encoding: 'utf8' });
  console.log(probe);
} catch (e) {
  console.log(e.stdout || e.stderr || e.message);
}

const framesDir = 'D:\\Home-Designers-1\\public\\cabinet_frames_600fps';
const files = fs.readdirSync(framesDir).filter(f => f.endsWith('.jpg')).sort();
console.log(`Total extracted frames in folder: ${files.length}`);
console.log(`First frame: ${files[0]}, Last frame: ${files[files.length - 1]}`);
