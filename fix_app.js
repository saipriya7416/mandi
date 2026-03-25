const fs = require('fs');
const path = 'c:\\Users\\sailo\\Desktop\\mandi-frontend\\src\\App.jsx';
let content = fs.readFileSync(path, 'utf8');

// Fix the arrival block (line 1826/1827 area)
content = content.replace(/ +<p style={{ margin: 0, fontSize: "12px" }}>Arrival: 20\/03\/2026 06:15 AM<\/p>\s+<\/div>/, 
`                        <div>
                           <label style={{ fontSize: "10px", fontWeight: "800", opacity: 0.6 }}>ARRIVAL DETAILS</label>
                           <p style={{ margin: 0, fontSize: "12px" }}>Arrival: 20/03/2026 06:15 AM</p>
                        </div>`);

// Fix the debris at 2083
const debrisStart = content.indexOf('ntent: "space-between"');
if (debrisStart !== -1) {
    const nextSection = content.indexOf('{/* 10. Ledger System */}');
    if (nextSection !== -1) {
        // Find the spot just BEFORE Ledger System to keep section balance
        content = content.slice(0, debrisStart) + "\n" + content.slice(nextSection);
    }
}

fs.writeFileSync(path, content);
console.log('Fixed App.jsx');
