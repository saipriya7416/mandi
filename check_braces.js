const fs = require('fs');
const code = fs.readFileSync('src/App.jsx', 'utf8');
let depth = 0;
const lines = code.split('\n');
let prevDepth = 0;
// Find where this extra brace was introduced - check where depth becomes non-zero after file starts
// and scan for lines with large depth changes
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const startDepth = depth;
  for (const ch of line) {
    if (ch === '{') depth++;
    if (ch === '}') depth--;
  }
  const change = depth - startDepth;
  // Log every line with big swings or where depth hits an odd number
  if (Math.abs(change) > 3) {
    console.log('Line ' + (i + 1) + ': BIG CHANGE depth went from ' + startDepth + ' to ' + depth + ' | ' + line.trim().substring(0, 100));
  }
  prevDepth = depth;
}
console.log('Final depth: ' + depth);
