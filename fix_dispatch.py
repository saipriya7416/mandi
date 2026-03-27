import sys

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Confirm the anchor exists
ANCHOR = 'Qty Tracking</label>'
idx = content.find(ANCHOR)
if idx == -1:
    print("ERROR: Anchor not found - file may already be updated")
    sys.exit(0)

print(f"Found 'Qty Tracking' at char {idx}")

# Find the opening <div> of the 4-col grid (just before Qty Tracking label)
# Look backwards from idx for the nearest <div style={{ display: "grid", gridTemplateColumns: "repeat(4
GRID_DIV = '<div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginTop: "16px" }}>'
idx_div = content.rfind(GRID_DIV, 0, idx)
if idx_div == -1:
    print("ERROR: Grid div not found")
    sys.exit(1)
print(f"Grid div start at char {idx_div}")

# The section ends at the </div> that closes the 4-col grid.
# Structure: outer grid </div> is followed by \r\n or \n then </Card>
# Count: after Quality & Storage we have: </div></div>(closes quality label div) </div>(closes flex) </div>(closes outer col div) </div>(closes grid)
# Find "Quality & Storage" label - it's the last label in the grid
QUALITY_ANCHOR = '>Quality & Storage</label>'
idx_quality = content.find(QUALITY_ANCHOR, idx)
if idx_quality == -1:
    print("ERROR: Quality anchor not found")
    sys.exit(1)
print(f"Quality anchor at char {idx_quality}")

# After Quality & Storage, count forward through the selects and closing tags
# Find the pattern: </div>\r\n                     </Card>  OR  </div>\n                     </Card>
END_PATTERN_CRLF = '</div>\r\n                     </Card>'
END_PATTERN_LF   = '</div>\n                     </Card>'

idx_end_crlf = content.find(END_PATTERN_CRLF, idx_quality)
idx_end_lf   = content.find(END_PATTERN_LF, idx_quality)

if idx_end_crlf == -1 and idx_end_lf == -1:
    print("ERROR: End pattern not found")
    sys.exit(1)

if idx_end_crlf != -1:
    idx_end = idx_end_crlf + len('</div>')
    print(f"Using CRLF end at {idx_end}")
else:
    idx_end = idx_end_lf + len('</div>')
    print(f"Using LF end at {idx_end}")

print(f"Replacing from {idx_div} to {idx_end}")
print(f"Old section length: {idx_end - idx_div} chars")

# Detect line ending style
if '\r\n' in content:
    NL = '\r\n'
else:
    NL = '\n'

NEW_SECTION = (
    '<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "14px", marginTop: "16px" }}>' + NL +
    '                           <div>' + NL +
    '                              <label style={{ fontSize: "10px", fontWeight: "800", color: COLORS.muted, display: "block", marginBottom: "4px" }}>Size</label>' + NL +
    '                              <select style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.2px solid #E2E8F0" }} value={item.size} onChange={e => { const n=[...intakeForm.lineItems]; n[index].size=e.target.value; setIntakeForm({...intakeForm,lineItems:n}); }}>' + NL +
    '                                 {getProductData(item.product).sizes.map(s => <option key={s}>{s}</option>)}' + NL +
    '                              </select>' + NL +
    '                           </div>' + NL +
    '                           <div>' + NL +
    '                              <label style={{ fontSize: "10px", fontWeight: "800", color: COLORS.muted, display: "block", marginBottom: "4px" }}>Color</label>' + NL +
    '                              <select style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.2px solid #E2E8F0" }} value={item.color} onChange={e => { const n=[...intakeForm.lineItems]; n[index].color=e.target.value; setIntakeForm({...intakeForm,lineItems:n}); }}>' + NL +
    '                                 {getProductData(item.product).colors.map(c => <option key={c}>{c}</option>)}' + NL +
    '                              </select>' + NL +
    '                           </div>' + NL +
    '                           <div>' + NL +
    '                              <label style={{ fontSize: "10px", fontWeight: "800", color: COLORS.muted, display: "block", marginBottom: "4px" }}>Quantity</label>' + NL +
    '                              <input type="number" placeholder="0" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.2px solid #E2E8F0" }} value={item.grossWeight} onChange={e => { const n=[...intakeForm.lineItems]; n[index].grossWeight=Number(e.target.value); setIntakeForm({...intakeForm,lineItems:n}); }} />' + NL +
    '                           </div>' + NL +
    '                           <div>' + NL +
    '                              <label style={{ fontSize: "10px", fontWeight: "800", color: COLORS.muted, display: "block", marginBottom: "4px" }}>Unit Type</label>' + NL +
    '                              <select style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.2px solid #E2E8F0" }} value={item.unit} onChange={e => { const n=[...intakeForm.lineItems]; n[index].unit=e.target.value; setIntakeForm({...intakeForm,lineItems:n}); }}>' + NL +
    '                                 <option>KG</option><option>Box</option><option>Crate</option><option>Ton</option><option>Packet</option>' + NL +
    '                              </select>' + NL +
    '                           </div>' + NL +
    '                           <div>' + NL +
    '                              <label style={{ fontSize: "10px", fontWeight: "800", color: COLORS.muted, display: "block", marginBottom: "4px" }}>Rate per KG (\u20b9)</label>' + NL +
    '                              <input type="number" placeholder="0.00" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.2px solid #E2E8F0" }} value={item.rate} onChange={e => { const n=[...intakeForm.lineItems]; n[index].rate=Number(e.target.value); setIntakeForm({...intakeForm,lineItems:n}); }} />' + NL +
    '                           </div>' + NL +
    '                           <div>' + NL +
    '                              <label style={{ fontSize: "10px", fontWeight: "800", color: COLORS.muted, display: "block", marginBottom: "4px" }}>Total Weight</label>' + NL +
    '                              <input disabled style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "none", background: "#f0fdf4", fontWeight: "800", color: "#166534" }} value={`${item.grossWeight || 0} ${item.unit}`} />' + NL +
    '                           </div>' + NL +
    '                           <div>' + NL +
    '                              <label style={{ fontSize: "10px", fontWeight: "800", color: COLORS.muted, display: "block", marginBottom: "4px" }}>Total Amount (\u20b9)</label>' + NL +
    '                              <input disabled style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "none", background: "#f0fdf4", fontWeight: "900", color: "#166534" }} value={formatCurrency(item.rate * item.grossWeight)} />' + NL +
    '                           </div>' + NL +
    '                        </div>' + NL +
    '                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "14px", marginTop: "14px" }}>' + NL +
    '                           <div>' + NL +
    '                              <label style={{ fontSize: "10px", fontWeight: "800", color: COLORS.muted, display: "block", marginBottom: "4px" }}>No. of Packages</label>' + NL +
    '                              <input type="number" placeholder="0" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.2px solid #E2E8F0" }} value={item.packages} onChange={e => { const n=[...intakeForm.lineItems]; n[index].packages=Number(e.target.value); setIntakeForm({...intakeForm,lineItems:n}); }} />' + NL +
    '                           </div>' + NL +
    '                           <div>' + NL +
    '                              <label style={{ fontSize: "10px", fontWeight: "800", color: COLORS.muted, display: "block", marginBottom: "4px" }}>Packaging Type</label>' + NL +
    '                              <select style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.2px solid #E2E8F0" }} value={item.packagingType} onChange={e => { const n=[...intakeForm.lineItems]; n[index].packagingType=e.target.value; setIntakeForm({...intakeForm,lineItems:n}); }}>' + NL +
    '                                 <option>Plastic Crates</option><option>Wooden Boxes</option><option>Corrugated Box</option><option>Gunny Bags</option><option>Loose Load</option>' + NL +
    '                              </select>' + NL +
    '                           </div>' + NL +
    '                           <div>' + NL +
    '                              <label style={{ fontSize: "10px", fontWeight: "800", color: COLORS.muted, display: "block", marginBottom: "4px" }}>Batch Number</label>' + NL +
    '                              <input placeholder="e.g. BCH-2026-001" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.2px solid #E2E8F0" }} value={item.batchNo} onChange={e => { const n=[...intakeForm.lineItems]; n[index].batchNo=e.target.value; setIntakeForm({...intakeForm,lineItems:n}); }} />' + NL +
    '                           </div>' + NL +
    '                           <div>' + NL +
    '                              <label style={{ fontSize: "10px", fontWeight: "800", color: COLORS.muted, display: "block", marginBottom: "4px" }}>Quality Status</label>' + NL +
    '                              <select style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.2px solid #E2E8F0" }} value={item.qualityStatus} onChange={e => { const n=[...intakeForm.lineItems]; n[index].qualityStatus=e.target.value; setIntakeForm({...intakeForm,lineItems:n}); }}>' + NL +
    '                                 <option>Passed</option><option>Quarantine</option><option>Rejected</option>' + NL +
    '                              </select>' + NL +
    '                           </div>' + NL +
    '                           <div>' + NL +
    '                              <label style={{ fontSize: "10px", fontWeight: "800", color: COLORS.muted, display: "block", marginBottom: "4px" }}>Storage Type</label>' + NL +
    '                              <select style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.2px solid #E2E8F0" }} value={item.storageType} onChange={e => { const n=[...intakeForm.lineItems]; n[index].storageType=e.target.value; setIntakeForm({...intakeForm,lineItems:n}); }}>' + NL +
    '                                 <option>Ambient</option><option>Cold Storage</option><option>Refrigerated</option><option>Hygienic Room</option>' + NL +
    '                              </select>' + NL +
    '                           </div>' + NL +
    '                           <div style={{ gridColumn: "span 2" }}>' + NL +
    '                              <label style={{ fontSize: "10px", fontWeight: "800", color: COLORS.muted, display: "block", marginBottom: "4px" }}>Dispatch Remarks</label>' + NL +
    '                              <input placeholder="e.g. Handle with care, keep dry..." style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.2px solid #E2E8F0" }} value={item.remarks || ""} onChange={e => { const n=[...intakeForm.lineItems]; n[index].remarks=e.target.value; setIntakeForm({...intakeForm,lineItems:n}); }} />' + NL +
    '                           </div>' + NL +
    '                        </div>'
)

new_content = content[:idx_div] + NEW_SECTION + content[idx_end:]
print(f"New section length: {len(NEW_SECTION)} chars")

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("SUCCESS: All 15 product fields written to Dispatch Entry.")
