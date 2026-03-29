const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');
const lines = content.split('\n');

let curlyCount = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '{') curlyCount++;
    else if (char === '}') curlyCount--;
  }
  if (i >= 233 && curlyCount === 0) {
      console.log(`Curly balanced at end of line ${i + 1}`);
      // return; // wait... I want to see how many times it happens.
  }
}
