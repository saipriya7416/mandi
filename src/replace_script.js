const fs = require('fs');
let content = fs.readFileSync('c:/Users/sailo/Desktop/mandi-frontend/src/App.jsx', 'utf-8');

// Replacement for corrupted icon lines
content = content.replace(/ðŸ“±/g, 'Phone:');
content = content.replace(/â€¢/g, '•');
content = content.replace(/ðŸ“ /g, 'Village:');

// Replacement for Save labels starting with ?
content = content.replace(/label: "\? Saved successfully"/g, 'label: "✅ Saved successfully"');
content = content.replace(/"\? Settings saved successfully."/g, '"✅ Settings saved successfully."');

// Mass rename leftover Buyer/Farmer strings with spaces/quotes
content = content.replace(/Farmer Info/ig, 'Supplier Info');
content = content.replace(/Buyer Info/ig, 'Customer Info');
content = content.replace(/Farmer Identity/ig, 'Supplier Identity');
content = content.replace(/Buyer Identity/ig, 'Customer Identity');

// Final compact grid check
content = content.replace(/minmax\(290px, 1fr\)/g, 'minmax(270px, 1fr)');

fs.writeFileSync('c:/Users/sailo/Desktop/mandi-frontend/src/App.jsx', content, 'utf-8');
console.log('Final clean DONE');
