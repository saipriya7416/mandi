content = open(r'c:\Users\sailo\Desktop\mandi-frontend\src\App.jsx', 'r', encoding='utf-8', errors='replace').read()
lines = content.split('\n')
for i, line in enumerate(lines, 1):
    if 'viewingEntity' in line or 'ViewEntity' in line:
        print(f'{i}: {line[:140]}')
