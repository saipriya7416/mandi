with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the exact anchor - the </Card> followed by </div> followed by Export comment
ANCHOR = '</Card>\r\n                   </div>\r\n\r\n                   {/* Export & Sharing Center */}'
if ANCHOR not in content:
    # Try LF
    ANCHOR = '</Card>\n                   </div>\n\n                   {/* Export & Sharing Center */}'

if ANCHOR not in content:
    print("ERROR: anchor not found - checking what's there...")
    idx = content.find('Export & Sharing Center')
    if idx != -1:
        print(repr(content[idx-200:idx+50]))
    import sys; sys.exit(1)

NL = '\r\n' if '\r\n' in content else '\n'

INSERT = (
    '</Card>' + NL +
    '                   ))}' + NL +
    NL +
    '                   <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: COLORS.sidebar, padding: "24px", borderRadius: "20px", color: "#fff" }}>' + NL +
    '                      <div>' + NL +
    '                         <Button style={{ background: "#fff", color: COLORS.sidebar, fontWeight: "900" }} onClick={() => {' + NL +
    '                            const newItem = { itemGuid: Math.random().toString(36).substr(2, 9), category: "Fruits", product: "", variety: "", grade: "A Grade", size: "Medium", color: "Standard", unit: "KG", grossWeight: 0, packages: 0, packagingType: "Plastic Crates", rate: 0, batchNo: "", qualityStatus: "Passed", storageType: "Ambient", remarks: "" };' + NL +
    '                            setIntakeForm({...intakeForm, lineItems: [...intakeForm.lineItems, newItem]});' + NL +
    '                         }}>\u2295 Add Product Record</Button>' + NL +
    '                      </div>' + NL +
    '                      <div style={{ textAlign: "right" }}>' + NL +
    '                         <p style={{ margin: 0, fontSize: "12px", opacity: 0.7, fontWeight: "700" }}>DISPATCH TRANSACTION TOTAL</p>' + NL +
    '                         <h2 style={{ margin: 0, fontSize: "32px", fontWeight: "900" }}>{formatCurrency(intakeForm.lineItems.reduce((acc, cur) => acc + (cur.rate * cur.grossWeight), 0))}</h2>' + NL +
    '                      </div>' + NL +
    '                   </div>' + NL +
    NL +
    '                   <div style={{ marginTop: "24px", display: "flex", gap: "16px" }}>' + NL +
    '                      <Button style={{ flex: 1, background: COLORS.success, height: "60px", fontSize: "18px" }} onClick={handleSaveDispatch}>\U0001f680 Commit Dispatch & Log Inventory</Button>' + NL +
    '                      <Button variant="outline" style={{ background: "#fff", height: "60px" }} onClick={() => alert("\U0001f4be Draft saved.")}>\U0001f4be Save Draft</Button>' + NL +
    '                   </div>' + NL +
    NL +
    '                   <div style={{ marginTop: "40px" }}>' + NL +
    '                     <h3 style={{ fontSize: "16px", fontWeight: "800", color: COLORS.sidebar, marginBottom: "16px", borderBottom: "1px solid #EBE9E1", paddingBottom: "12px" }}>Recent Dispatches</h3>' + NL +
    '                     <div style={{ overflowX: "auto", background: "#FFFFFF", borderRadius: "12px", border: "1px solid #EBE9E1" }}>' + NL +
    '                       <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>' + NL +
    '                         <thead><tr style={{ background: "#FDFBF4", textAlign: "left", color: COLORS.muted }}>' + NL +
    '                           <th style={{ padding: "14px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Dispatch ID</th>' + NL +
    '                           <th style={{ padding: "14px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Supplier</th>' + NL +
    '                           <th style={{ padding: "14px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Buyer</th>' + NL +
    '                           <th style={{ padding: "14px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Product / Grade</th>' + NL +
    '                           <th style={{ padding: "14px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Vehicle</th>' + NL +
    '                           <th style={{ padding: "14px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Total</th>' + NL +
    '                           <th style={{ padding: "14px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Status</th>' + NL +
    '                         </tr></thead>' + NL +
    '                         <tbody>' + NL +
    '                           {[' + NL +
    '                             { id: "DSP-55920", supplier: "Priya Reddy", buyer: "Harsha Wholesale", product: "Apple \u00b7 Premium", vehicle: "TS09 EU 1234", amount: "\u20b945,000", status: "In Transit" },' + NL +
    '                             { id: "DSP-55919", supplier: "Srinivas Rao", buyer: "Reliance Retail", product: "Mango \u00b7 A Grade", vehicle: "AP28 BW 9091", amount: "\u20b982,500", status: "Delivered" },' + NL +
    '                             { id: "DSP-55918", supplier: "Mohan Chandra", buyer: "Metro Cash", product: "Tomato \u00b7 Standard", vehicle: "TS07 CD 4455", amount: "\u20b918,000", status: "Delivered" }' + NL +
    '                           ].map((d, i) => (' + NL +
    '                             <tr key={i} style={{ borderBottom: i === 2 ? "none" : "1px solid #EBE9E1" }}>' + NL +
    '                               <td style={{ padding: "14px", fontWeight: "700", color: COLORS.sidebar }}>{d.id}</td>' + NL +
    '                               <td style={{ padding: "14px" }}>{d.supplier}</td>' + NL +
    '                               <td style={{ padding: "14px" }}>{d.buyer}</td>' + NL +
    '                               <td style={{ padding: "14px" }}>{d.product}</td>' + NL +
    '                               <td style={{ padding: "14px" }}>{d.vehicle}</td>' + NL +
    '                               <td style={{ padding: "14px", fontWeight: "700", color: COLORS.sidebar }}>{d.amount}</td>' + NL +
    '                               <td style={{ padding: "14px" }}><span style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", background: d.status === "Delivered" ? "#DCFCE7" : "#FEF3C7", color: d.status === "Delivered" ? "#166534" : "#92400E" }}>{d.status}</span></td>' + NL +
    '                             </tr>' + NL +
    '                           ))}' + NL +
    '                         </tbody>' + NL +
    '                       </table>' + NL +
    '                     </div>' + NL +
    '                   </div>' + NL +
    '                 </div>' + NL +
    '               )}' + NL +
    NL +
    '               {/* Export & Sharing Center */}'
)

new_content = content.replace(ANCHOR, INSERT)
if new_content == content:
    print("ERROR: replacement had no effect")
    import sys; sys.exit(1)

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("SUCCESS: Dispatch form footer restored.")
