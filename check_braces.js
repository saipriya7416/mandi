const fs = require('fs');
const content = fs.readFileSync('c:/Users/sailo/Desktop/mandi-frontend/src/App.jsx', 'utf8');

let braceCount = 0;
let tagCount = 0;
let lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    for (let char of line) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
    }
    // Very simple tag counting (won't handle strings correctly but might show a trend)
    let openTags = line.match(/<[a-zA-Z]/g);
    let closeTags = line.match(/<\/[a-zA-Z]/g);
    if (openTags) tagCount += openTags.length;
    if (closeTags) tagCount -= closeTags.length;
    
    if (braceCount < 0 || tagCount < 0) {
        console.log(`Mismatch at line ${i + 1}: Braces ${braceCount}, Tags ${tagCount}`);
    }
}
console.log(`Final counts: Braces ${braceCount}, Tags ${tagCount}`);
