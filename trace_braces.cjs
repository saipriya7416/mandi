const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

let lineNum = 1;
let stack = [];

for (let i = 0; i < content.length; i++) {
  const char = content[i];
  if (char === '\n') lineNum++;
  
  if (char === '{') {
    stack.push(lineNum);
  } else if (char === '}') {
    const openerLine = stack.pop();
    if (lineNum >= 3218 && lineNum <= 3224) {
       console.log(`Line ${lineNum}: } closes { from line ${openerLine}`);
    }
  }
}
