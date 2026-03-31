import re

file_path = r"c:\Users\sailo\Desktop\mandi-frontend\src\App.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

original_length = len(content)

# Fix patterns: use raw bytes representation for problematic chars
# Pattern: garbled multi-byte sequences that should be emojis

# Most common: garbled "dY..." prefix sequences (mojibake from emoji bytes)
# These appear because UTF-8 emoji bytes were read as latin-1/windows-1252

# Batch replace using regex for the dY prefix garbage patterns
import re

# Replace all remaining "dY..." garbage alert/prompt strings with clean versions
# First, find all dY + something patterns and check surrounding context
def fix_line(line):
    # Trash icon contexts -> keep the action word only
    line = re.sub(r'dY[^\s"]*\s*SECURITY CHECK', '\U0001f510 SECURITY CHECK', line)
    line = re.sub(r'dY[^\s"]*\s*ACCESS DENIED', '\U0001f6ab ACCESS DENIED', line)
    line = re.sub(r'dY[^\s"]*\s*LOT CREATED', '\u2705 LOT CREATED', line)
    line = re.sub(r'dY[^\s"]*\s*ORDER RECORDED', '\u2705 ORDER RECORDED', line)
    line = re.sub(r'dY[^\s"]*\s*KYC AUDIT', '\U0001f6e1 KYC AUDIT', line)
    line = re.sub(r'dY[^\s"]*\s*INWARD LOG', '\U0001f69a INWARD LOG', line)
    line = re.sub(r'dY[^\s"]*\s*OUTWARD DISPATCH', '\u2705 OUTWARD DISPATCH', line)
    line = re.sub(r'dY[^\s"]*\s*PAYMENT RECORDED', '\U0001f4b0 PAYMENT RECORDED', line)
    line = re.sub(r'dY[^\s"]*\s*DISBURSEMENT', '\u2705 DISBURSEMENT', line)
    line = re.sub(r'dY[^\s"]*\s*EXPENSE COMMITTED', '\u2705 EXPENSE COMMITTED', line)
    line = re.sub(r'dY[^\s"]*\s*Variety', '\u2705 Variety', line)
    line = re.sub(r'dY[^\s"]*\s*Core Product', '\u2705 Core Product', line)
    line = re.sub(r'dY[^\s"]*\s*Expense Category', '\u2705 Expense Category', line)
    line = re.sub(r'dY[^\s"]*\s*Staff Identity', '\u2705 Staff Identity', line)
    line = re.sub(r'dY[^\s"]*\s*Allocation', '\u2705 Allocation', line)
    line = re.sub(r'dY[^\s"]*\s*ALLOCATION', '\u2705 ALLOCATION', line)
    line = re.sub(r'dY[^\s"]*\s*BILL FINALIZED', '\u2705 BILL FINALIZED', line)
    line = re.sub(r'dY[^\s"]*\s*View details', '\U0001f441 View details', line)
    line = re.sub(r'dY[^\s"]*\s*${type}', '\U0001f4c4 ${type}', line)
    line = re.sub(r'dY[^\s"]*\s*Deductions', '\U0001f4ca Deductions', line)
    # Permanently delete patterns
    line = re.sub(r'dY[^\s"]*\s*Are you sure you want to PERMANENTLY', '\U0001f5d1\ufe0f Are you sure you want to PERMANENTLY', line)
    # Catch-all for remaining dY garbage
    line = re.sub(r'\bef\x9f\x98\b', '', line)
    # Fix garbled rupee
    line = line.replace('\u00e2\u20ac\u00b9', '\u20b9')
    return line

lines = content.split('\n')
fixed_lines = [fix_line(l) for l in lines]
content = '\n'.join(fixed_lines)

print(f"Original length: {original_length}")
print(f"New length: {len(content)}")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done!")
