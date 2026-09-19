const fs = require('fs');
const path = require('path');

function getDirSize(dirPath) {
  let size = 0;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    try {
      if (entry.isDirectory()) {
        size += getDirSize(fullPath);
      } else {
        size += fs.statSync(fullPath).size;
      }
    } catch {}
  }
  return size;
}

function analyzeDir(dir) {
  console.log(`\n=== Analyzing ${dir} ===`);
  const items = fs.readdirSync(dir, { withFileTypes: true });
  const results = [];
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    let s = 0;
    if (item.isDirectory()) {
      s = getDirSize(fullPath);
      results.push({ name: item.name + '/', sizeMB: (s / (1024 * 1024)).toFixed(2) });
    } else {
      s = fs.statSync(fullPath).size;
      results.push({ name: item.name, sizeMB: (s / (1024 * 1024)).toFixed(2) });
    }
  }
  results.sort((a, b) => parseFloat(b.sizeMB) - parseFloat(a.sizeMB));
  console.table(results);
}

analyzeDir('scripts');
analyzeDir('public');
