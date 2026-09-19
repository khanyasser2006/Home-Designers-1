const fs = require('fs');
const path = require('path');

const framesDir = path.join(__dirname, '..', 'public', 'cabinet_frames_600fps');
const manifestPath = path.join(__dirname, '..', 'src', 'components', 'frames.json');

const files = fs.readdirSync(framesDir)
  .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
  .sort();

fs.writeFileSync(manifestPath, JSON.stringify(files, null, 2), 'utf8');
console.log(`Generated manifest with ${files.length} frames`);
