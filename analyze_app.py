import re

content = open(r'c:\Users\sailo\Desktop\mandi-frontend\src\App.jsx', 'r', encoding='utf-8', errors='replace').read()
lines = content.split('\n')

# Find activeSection comparisons
pattern = re.compile(r'activeSection\s*===\s*["\']([^"\']+)["\']')
secs = set()
for line in lines:
    for m in pattern.finditer(line):
        secs.add(m.group(1))
print("=== SECTIONS ===")
for s in sorted(secs):
    print(s)

# Find key component names / function declarations
print("\n=== COMPONENT FUNCTIONS ===")
fn_pattern = re.compile(r'^(function|const)\s+([A-Z][A-Za-z]+)\s*[=(]')
for i, line in enumerate(lines, 1):
    m = fn_pattern.match(line.strip())
    if m:
        print(f"Line {i}: {m.group(2)}")

# Find specific field references
print("\n=== PARTY/LOT/ALLOCATION REFERENCES ===")
keywords = ['Registered Lots', 'Lot Allocation', 'Record Allocation', 'Party Management', 'registerLot', 'RegisterLot', 'lotAlloc', 'LotAlloc', 'partyForm', 'PartyForm', 'buyerForm', 'BuyerForm', 'memberForm']
for kw in keywords:
    for i, line in enumerate(lines, 1):
        if kw in line:
            print(f"Line {i} [{kw}]: {line.strip()[:120]}")
