const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');
const lines = content.split('\n');

console.log(`Line 4786: [${lines[4785]}]`);
console.log(`Line 4787: [${lines[4786]}]`);
console.log(`Line 4788: [${lines[4787]}]`);
