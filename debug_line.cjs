const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');
const lines = content.split('\n');
console.log(`Line 3222: [${lines[3221]}]`);
console.log(`Length: ${lines[3221].length}`);
for (let i = 0; i < lines[3221].length; i++) {
  console.log(`Char ${i}: [${lines[3221][i]}] (code ${lines[3221].charCodeAt(i)})`);
}
