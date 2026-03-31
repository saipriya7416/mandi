import os

path = r'c:\Users\sailo\Desktop\mandi-frontend\src\App.jsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

replacements = {
    'â‚¹': '₹',
    'â†’': '→',
    'âž•': '➕',
    'ðŸ“…': '📅',
    'âš ï¸': '⚠️',
    'âœ…': '✅',
    'â Œ': '❌',
    'ðŸ“‹': '📋',
    'ðŸ›¡ï¸': '🛡️',
    'ðŸš›': '🚚'
}

for old, new in replacements.items():
    c = c.replace(old, new)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("Cleanup complete.")
