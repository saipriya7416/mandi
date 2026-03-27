with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the narrow anchor that's definitely in the file
FIND = '</Card>\n                  </div>\n\n                   {/* Export & Sharing Center */}'
if FIND not in content:
    # Try slight indent variations  
    for spaces in [17,18,19,20,21,22]:
        pad = ' ' * spaces
        candidate = f'</Card>\n{pad}</div>\n\n{pad}' + '{/* Export & Sharing Center */}'
        if candidate in content:
            FIND = candidate
            print(f"Found with {spaces} spaces")
            break
    else:
        # Last resort - find Export comment and grab 200 chars before it
        idx = content.find('{/* Export & Sharing Center */}')
        print(f"Using fallback. Context before Export:")
        print(repr(content[idx-200:idx]))
        import sys; sys.exit(1)

NL = '\n'

REPLACE = (
    '</Card>\n'
    '                   )}\n'
    '                   )}\n'
    '\n'
    '                   <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: COLORS.sidebar, padding: "24px", borderRadius: "20px", color: "#fff" }}>\n'
    '                      <div>\n'
    '                         <Button style={{ background: "#fff", color: COLORS.sidebar, fontWeight: "900" }} onClick={() => {\n'
    '                            const newItem = { itemGuid: Math.random().toString(36).substr(2,9), category: "Fruits", product: "", variety: "", grade: "A Grade", size: "Medium", color: "Standard", unit: "KG", grossWeight: 0, packages: 0, packagingType: "Plastic Crates", rate: 0, batchNo: "", qualityStatus: "Passed", storageType: "Ambient", remarks: "" };\n'
    '                            setIntakeForm({...intakeForm, lineItems: [...intakeForm.lineItems, newItem]});\n'
    '                         }}>\u2295 Add Product</Button>\n'
    '                      </div>\n'
    '                      <div style={{ textAlign: "right" }}>\n'
    '                         <p style={{ margin: 0, fontSize: "12px", opacity: 0.7, fontWeight: "700" }}>DISPATCH TRANSACTION TOTAL</p>\n'
    '                         <h2 style={{ margin: 0, fontSize: "32px", fontWeight: "900" }}>{formatCurrency(intakeForm.lineItems.reduce((a,c) => a+(c.rate*c.grossWeight),0))}</h2>\n'
    '                      </div>\n'
    '                   </div>\n'
    '\n'
    '                   <div style={{ marginTop: "20px", display: "flex", gap: "16px" }}>\n'
    '                      <Button style={{ flex: 1, background: COLORS.success, height: "60px", fontSize: "18px" }} onClick={handleSaveDispatch}>\U0001f680 Commit Dispatch & Log Inventory</Button>\n'
    '                      <Button variant="outline" style={{ background: "#fff", height: "60px" }} onClick={() => alert("Draft saved.")}>\U0001f4be Save Draft</Button>\n'
    '                   </div>\n'
    '\n'
    '                   <div style={{ marginTop: "40px" }}>\n'
    '                     <h3 style={{ fontSize: "16px", fontWeight: "800", color: COLORS.sidebar, marginBottom: "16px", borderBottom: "1px solid #EBE9E1", paddingBottom: "12px" }}>Recent Dispatches</h3>\n'
    '                     <div style={{ overflowX: "auto", background: "#fff", borderRadius: "12px", border: "1px solid #EBE9E1" }}>\n'
    '                       <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>\n'
    '                         <thead><tr style={{ background: "#FDFBF4", textAlign: "left", color: COLORS.muted }}>\n'
    '                           <th style={{ padding: "14px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Dispatch ID</th>\n'
    '                           <th style={{ padding: "14px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Supplier</th>\n'
    '                           <th style={{ padding: "14px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Buyer</th>\n'
    '                           <th style={{ padding: "14px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Product / Grade</th>\n'
    '                           <th style={{ padding: "14px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Vehicle</th>\n'
    '                           <th style={{ padding: "14px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Total</th>\n'
    '                           <th style={{ padding: "14px", fontWeight: "700", borderBottom: "1px solid #EBE9E1" }}>Status</th>\n'
    '                         </tr></thead>\n'
    '                         <tbody>\n'
    '                           {[\n'
    '                             { id: "DSP-55920", supplier: "Priya Reddy", buyer: "Harsha Wholesale", product: "Apple \u00b7 Premium", vehicle: "TS09 EU 1234", amount: "\u20b945,000", status: "In Transit" },\n'
    '                             { id: "DSP-55919", supplier: "Srinivas Rao", buyer: "Reliance Retail", product: "Mango \u00b7 A Grade", vehicle: "AP28 BW 9091", amount: "\u20b982,500", status: "Delivered" },\n'
    '                             { id: "DSP-55918", supplier: "Mohan Chandra", buyer: "Metro Cash", product: "Tomato \u00b7 Standard", vehicle: "TS07 CD 4455", amount: "\u20b918,000", status: "Delivered" }\n'
    '                           ].map((d, i) => (\n'
    '                             <tr key={i} style={{ borderBottom: i === 2 ? "none" : "1px solid #EBE9E1" }}>\n'
    '                               <td style={{ padding: "14px", fontWeight: "700", color: COLORS.sidebar }}>{d.id}</td>\n'
    '                               <td style={{ padding: "14px" }}>{d.supplier}</td>\n'
    '                               <td style={{ padding: "14px" }}>{d.buyer}</td>\n'
    '                               <td style={{ padding: "14px" }}>{d.product}</td>\n'
    '                               <td style={{ padding: "14px" }}>{d.vehicle}</td>\n'
    '                               <td style={{ padding: "14px", fontWeight: "700", color: COLORS.sidebar }}>{d.amount}</td>\n'
    '                               <td style={{ padding: "14px" }}><span style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", background: d.status==="Delivered"?"#DCFCE7":"#FEF3C7", color: d.status==="Delivered"?"#166534":"#92400E" }}>{d.status}</span></td>\n'
    '                             </tr>\n'
    '                           ))}\n'
    '                         </tbody>\n'
    '                       </table>\n'
    '                     </div>\n'
    '                   </div>\n'
    '                 </div>\n'
    '               )}\n'
    '\n'
    '               {/* Export & Sharing Center */}'
)

new_content = content.replace(FIND, REPLACE, 1)
if new_content == content:
    print("ERROR: no change made")
    import sys; sys.exit(1)

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("SUCCESS: dispatch form footer restored.")
