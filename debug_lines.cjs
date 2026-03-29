const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

let line = 1;
for (let i = 0; i < content.length; i++) {
  if (content[i] === '\n') line++;
  if (line === 4080) {
      console.log(`Character ${i} is on line 4080: [${content[i]}]`);
      break;
  }
}
