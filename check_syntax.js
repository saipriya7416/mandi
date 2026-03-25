const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\sailo\\Desktop\\mandi-frontend\\src\\App.jsx', 'utf8');

let parenCount = 0;
let braceCount = 0;
let bracketCount = 0;
let jsxTagCount = 0;

const lines = content.split('\n');
lines.forEach((line, i) => {
    const l = i + 1;
    for (let char of line) {
        if (char === '(') parenCount++;
        if (char === ')') parenCount--;
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
        if (char === '[') bracketCount++;
        if (char === ']') bracketCount--;
    }
    if (parenCount < 0) console.log(`Extra ) at line ${l}`);
    if (braceCount < 0) console.log(`Extra } at line ${l}`);
    if (bracketCount < 0) console.log(`Extra ] at line ${l}`);
});

console.log(`Final Parenthood: ${parenCount}`);
console.log(`Final Braces: ${braceCount}`);
console.log(`Final Brackets: ${bracketCount}`);
