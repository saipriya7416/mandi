const fs = require('fs');
let c = fs.readFileSync('c:/Users/sailo/Desktop/mandi-frontend/src/App.jsx', 'utf-8');

// Update all large grid containers for PremiumActionCard to compact sizing
// Replace 340px grids (allocations, supplier bills, buyer invoices)
c = c.split('minmax(340px, 1fr)').join('minmax(240px, 1fr)');

// Also fix gap from 24px to 16px in those containers
// Find and replace the specific pattern used in bill/invoice/allocation sections
c = c.split('minmax(240px, 1fr))\", gap: "24px"').join('minmax(240px, 1fr))\", gap: "16px"');

fs.writeFileSync('c:/Users/sailo/Desktop/mandi-frontend/src/App.jsx', c, 'utf-8');
console.log('All grids updated. 340px grids remaining:', (c.match(/minmax\(340px/g) || []).length);
console.log('240px grids now:', (c.match(/minmax\(240px/g) || []).length);
