content = open(r'c:\Users\sailo\Desktop\mandi-frontend\src\App.jsx', 'r', encoding='utf-8', errors='replace').read()
lines = content.split('\n')

# Find supplierForm, memberForm state declarations
import re
keywords = ['supplierForm', 'memberForm', 'memberFields', 'MEMBER_FIELDS', 'PARTY_FIELDS', 'partyFields', 'supplierFields', 'SUPPLIER_FIELDS', 'buyerFields', 'BUYER_FIELDS', 'lotForm', 'LOT_FORM', 'lotFields', 'LOT_FIELDS', 'allocationForm', 'ALLOCATION', 'lotProfile', 'LotProfile', 'setSupplierForm', 'handleRegisterMember', 'handleAddSupplier', 'handleSaveMember']
found = {}
for kw in keywords:
    for i, line in enumerate(lines, 1):
        if kw in line:
            if kw not in found:
                found[kw] = []
            found[kw].append(i)

for kw, line_nums in found.items():
    print(f'\n=== {kw} (lines: {line_nums[:8]}) ===')

# Show the Party Management render area
print('\n\n=== PARTY MANAGEMENT RENDER (searching for section render) ===')
for i, line in enumerate(lines, 1):
    if 'activeSection === "User Role"' in line or 'User Role' in line and 'activeSection' in line:
        print(f'Line {i}: {line[:120]}')
        # Show surrounding context
        for j in range(i, min(i+40, len(lines))):
            print(f'  {j}: {lines[j-1][:100]}')
        break

print('\n\n=== LOT ALLOCATION RENDER ===')
for i, line in enumerate(lines, 1):
    if 'activeSection === "Lot Allocation"' in line:
        print(f'Line {i}: {line[:120]}')
        for j in range(i, min(i+20, len(lines))):
            print(f'  {j}: {lines[j-1][:100]}')
        break
