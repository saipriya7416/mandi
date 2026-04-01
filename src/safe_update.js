const fs = require('fs');
const p = 'c:/Users/sailo/Desktop/mandi-frontend/src/App.jsx';
let s = fs.readFileSync(p, 'utf8');

// 1. ADD renderRegisteredLotCard
const renderReg = `
  const renderRegisteredLotCard = (l, idx) => {
    const selectedSupplier = suppliers.find(s => (s._id || s.id) === (l.supplierId?._id || l.supplierId) || s.name === l.farmerName);
    const supplierName = selectedSupplier?.name || l.farmerName || "N/A";
    const supplierId = getSupplierIdValue(selectedSupplier) || "N/A";
    const phone = selectedSupplier?.phone || "N/A";

    return (
      <PremiumActionCard
        key={l._id || idx}
        title={<div style={{ fontSize: "16.5px", fontWeight: "900", color: COLORS.sidebar }}>{l.lotId}</div>}
        subtitle=""
        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>}
        status={{ text: "Active", color: "#166534", bg: "#dcfce7" }}
        details={[
          { icon: null, text: <div style={{ fontSize: "14px", fontWeight: "850", color: "#1e293b", marginTop: "4px" }}>{supplierName} - {supplierId}</div> },
          { icon: ICON_PHONE, text: <div style={{ fontSize: "12px", fontWeight: "750", color: COLORS.sidebar, opacity: 0.8 }}>{phone}</div> }
        ]}
        secondaryActions={[
          { label: "View Details", icon: null, variant: "primary", onClick: () => setViewingEntity({ type: "LOT", data: l }) },
          { label: "Edit Details", icon: null, onClick: () => { setActiveLotTab("LOT Creation"); handleEditSelect("LOT", l); } }
        ]}
        onDelete={() => {
          const code = prompt(" SECURITY CHECK: Enter Master Deletion Code to remove this record:");
          if (code === "0000") handleDeleteLot(l._id);
          else if (code !== null) alert(" ACCESS DENIED: Invalid deletion code.");
        }}
      />
    );
  };
`;
s = s.replace(/const renderBuyerMemberCard =/g, renderReg + "\n  const renderBuyerMemberCard =");

// 2. ENHANCE ModernMultiSelectField
const funcStart = s.indexOf('function ModernMultiSelectField({');
const funcNext = s.indexOf('function PartyModernMultiSelectField({'); 

const enhancedMMSF = `function ModernMultiSelectField({
  label,
  value,
  onChange,
  options = [],
  disabled,
  hideLabel = false,
  showRemoveIcon = true,
  placeholder,
}) {
  const [open, setOpen] = useState(false);
  const [internalValues, setInternalValues] = useState([]);
  const [searchText, setSearchText] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    setInternalValues(parseMultiValue(value));
  }, [value]);

  const normalizedOptions = [...new Set((options || []).map(o => String(o || "").trim()).filter(Boolean))];
  const filteredOptions = normalizedOptions.filter(o => 
    o.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleValue = (val) => {
    if (internalValues.includes(val)) {
      setInternalValues(internalValues.filter(v => v !== val));
    } else {
      setInternalValues([...internalValues, val]);
    }
  };

  const handleApply = () => {
    onChange?.({ target: { value: internalValues.join(" / ") } });
    setOpen(false);
    setSearchText("");
  };

  const handleManualAdd = () => {
    if (searchText.trim()) {
      const trimmed = searchText.trim();
      if (!internalValues.includes(trimmed)) {
        setInternalValues([...internalValues, trimmed]);
      }
      setSearchText("");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: "relative", width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
      {!hideLabel && (
        <label style={{ fontSize: "12px", fontWeight: "750", color: "#64748B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{label}</span>
          {internalValues.length > 0 && (
            <span style={{ fontSize: "10px", background: "#E2E8F0", padding: "2px 8px", borderRadius: "10px", color: COLORS.sidebar, fontWeight: "800" }}>
              {internalValues.length} Selected
            </span>
          )}
        </label>
      )}
      
      <div 
        onClick={() => !disabled && setOpen(!open)}
        style={{
          minHeight: "48px",
          padding: "8px 16px",
          borderRadius: "12px",
          border: "1.5px solid #EBE9E1",
          background: "#FFFFFF",
          color: COLORS.sidebar,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: open ? "0 0 0 2px rgba(0,0,0,0.05)" : "none",
          opacity: disabled ? 0.6 : 1
        }}
      >
        <div style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "13.5px", fontWeight: "600" }}>
          {internalValues.length > 0 ? (
            <div style={{ display: "flex", gap: "6px", overflow: "hidden" }}>
               {internalValues.slice(0, 3).map(v => (
                 <span key={v} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#F1F5F9", padding: "2px 10px", borderRadius: "8px", fontSize: "11.5px", border: "1.5px solid #E2E8F0", color: COLORS.sidebar }}>
                   {v}
                   {showRemoveIcon && (
                     <span 
                       onClick={(e) => { 
                         e.stopPropagation(); 
                         const next = internalValues.filter(x => x !== v);
                         setInternalValues(next);
                         onChange?.({ target: { value: next.join(" / ") } });
                       }}
                       style={{ cursor: "pointer", color: "#64748B", fontSize: "16px", fontWeight: "900", transition: "all 0.2s", opacity: 0.7 }}
                       onMouseEnter={(e) => { e.currentTarget.style.color = "#FF3B30"; e.currentTarget.style.transform = "scale(1.2)"; }}
                       onMouseLeave={(e) => { e.currentTarget.style.color = "#64748B"; e.currentTarget.style.transform = "scale(1)"; }}
                     >x</span>
                   )}
                 </span>
               ))}
               {internalValues.length > 3 && <span style={{ color: "#888", fontSize: "11px", alignSelf: "center" }}>+{internalValues.length - 3} more</span>}
            </div>
          ) : (
            <span style={{ color: "#666" }}>{placeholder || \`Select \${label}...\`}</span>
          )}
        </div>
        <span style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s", color: "#666", fontSize: "10px" }}>▼</span>
      </div>

      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          left: 0,
          right: 0,
          zIndex: 1000,
          background: COLORS.sidebar,
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "14px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.45)",
          padding: "14px",
          minWidth: "300px",
          animation: "slideUp 0.2s ease-out"
        }}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <input 
                autoFocus
                placeholder="Search or type new..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    searchText ? handleManualAdd() : handleApply();
                  }
                }}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  color: "#fff",
                  fontSize: "13px",
                  outline: "none",
                  transition: "border-color 0.2s"
                }}
              />
            </div>
            {searchText && !normalizedOptions.some(o => o.toLowerCase() === searchText.toLowerCase()) && (
              <button 
                onClick={handleManualAdd}
                style={{ background: "rgba(255, 255, 255, 0.2)", color: "#fff", border: "1px solid rgba(255, 255, 255, 0.2)", borderRadius: "10px", padding: "8px 16px", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}
              >Add</button>
            )}
          </div>

          <div style={{ maxHeight: "250px", overflowY: "auto", paddingRight: "4px" }} className="custom-scrollbar">
            {filteredOptions.length > 0 || searchText ? (
              <>
                {filteredOptions.map(opt => {
                  const isSelected = internalValues.includes(opt);
                  return (
                    <div 
                      key={opt}
                      onClick={() => toggleValue(opt)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        background: isSelected ? "rgba(255,255,255,0.15)" : "transparent",
                        transition: "all 0.2s",
                        marginBottom: "2px"
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = isSelected ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)"}
                      onMouseLeave={e => e.currentTarget.style.background = isSelected ? "rgba(255,255,255,0.15)" : "transparent"}
                    >
                      <div style={{
                        width: "20px",
                        height: "20px",
                        border: isSelected ? "none" : "2px solid rgba(255,255,255,0.35)",
                        background: isSelected ? COLORS.primary : "transparent",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: "900",
                        transition: "all 0.2s"
                      }}>
                        {isSelected && "\u2713"}
                      </div>
                      <span style={{ fontSize: "13.5px", fontWeight: isSelected ? "800" : "500", color: "#ffffff" }}>{opt}</span>
                    </div>
                  );
                })}
              </>
            ) : (
              <div style={{ padding: "30px 10px", textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>
                No options available.
              </div>
            )}
          </div>
          
          <div style={{ marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "12px", display: "flex", justifyContent: "center" }}>
            <button 
              onClick={handleApply}
              style={{ 
                width: "100%",
                background: COLORS.primary, 
                color: "#fff", 
                border: "none", 
                borderRadius: "10px", 
                padding: "10px", 
                fontSize: "13px", 
                fontWeight: "900", 
                cursor: "pointer", 
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
              onMouseLeave={e => e.currentTarget.style.opacity = 1}
            >Apply</button>
          </div>
        </div>
      )}
    </div>
  );
}
`;

s = s.substring(0, funcStart) + enhancedMMSF + s.substring(funcNext);

// 3. Update fields
s = s.replace(/label="Variety"\\n\\s*value={item.variety}\\n\\s*options=\\{\\["Standard", "Hybrid", "Local", "Desi", "F1", "Other"\\]\\}/, \`label="Variety"
                              value={item.variety}
                              showRemoveIcon={false}
                              options={PRODUCT_DATA[item.productId]?.varieties || ["Standard", "Hybrid", "Local", "Desi", "F1", "Other"]}\`);
s = s.replace(/label="Grade"\\n\\s*value={item.grade}\\n\\s*options=\\{\\["A", "B", "C", "Extra", "Super", "Standard"\\]\\}/, \`label="Grade"
                              value={item.grade}
                              showRemoveIcon={false}
                              placeholder="Select the grade"
                              options={["A", "B", "C", "Extra", "Super", "Standard"]}\`);
s = s.replace(/label="Product"\\n\\s*value={item.productId}\\n\\s*options=\\{\\(\(\\) => \\{/, \`label="Product"
                              value={item.productId}
                              showRemoveIcon={false}
                              options={(() => {\`);

// 4. Update Registered Lots
const targetLotsBlock = \`{activeLotTab === "Registered Lots" && (\`;
const nextLotsBlock = \`{activeLotTab === "Produce Details" && (\`;
const startIdx = s.indexOf(targetLotsBlock);
const endIdx = s.indexOf(nextLotsBlock);

const newLotsUI = \`{activeLotTab === "Registered Lots" && (
                <div style={{ animation: "fadeIn 0.4s ease-out" }}>
                  <div style={{ display: "flex", gap: "20px", marginBottom: "32px", alignItems: "flex-end", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "300px" }}>
                       <label style={{ display: "block", fontSize: "12px", fontWeight: "800", color: COLORS.muted, marginBottom: "8px", marginLeft: "4px" }}>Search by Supplier, Vehicle or Lot ID</label>
                       <div style={{ position: "relative" }}>
                          <input type="text" placeholder="Type to search..." value={lotSearchQuery} onChange={(e) => setLotSearchQuery(e.target.value)} style={{ width: "100%", padding: "14px 18px 14px 44px", borderRadius: "14px", border: "1.5px solid #EBE9E1", fontSize: "14px", color: COLORS.sidebar, fontWeight: "600", outline: "none", background: "#FFFFFF", transition: "all 0.3s" }} />
                          <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: COLORS.muted }}>🔍</span>
                       </div>
                    </div>
                    <div style={{ width: "240px" }}>
                       <label style={{ display: "block", fontSize: "12px", fontWeight: "800", color: COLORS.muted, marginBottom: "8px", marginLeft: "4px" }}>Filter by Date</label>
                       <select value={lotDateFilter} onChange={(e) => setLotDateFilter(e.target.value)} style={{ width: "100%", padding: "14px 16px", borderRadius: "14px", border: "1.5px solid #EBE9E1", background: "#FFFFFF", color: COLORS.sidebar, fontWeight: "700", fontSize: "13px", outline: "none", cursor: "pointer", height: "52px" }}>
                          <option value="">All Transactions</option>
                          <option value="Today">Today Only</option>
                          <option value="7 Days">Last 7 Days</option>
                          <option value="30 Days / One Month">Last 30 Days</option>
                          <option value="Custom Date">Custom Range</option>
                       </select>
                    </div>
                    <div style={{ width: "280px" }}>
                       <label style={{ display: "block", fontSize: "12px", fontWeight: "800", color: COLORS.muted, marginBottom: "8px", marginLeft: "4px" }}>Filter by Product</label>
                       <div style={{ width: "100%" }}>
                         <ModernMultiSelectField label="Filter Product" hideLabel={true} value={lotProductFilter} options={Object.keys(PRODUCT_DATA).filter(k => k !== "default")} onChange={(e) => setLotProductFilter(e.target.value)} placeholder="All Products" />
                       </div>
                    </div>
                  </div>

                  {lotDateFilter === "Custom Date" && (
                    <div style={{ display: "flex", gap: "16px", marginBottom: "32px", padding: "16px", background: "#FDFBF4", borderRadius: "12px", border: "1.5px solid #EBE9E1", animation: "slideDown 0.3s ease-out" }}>
                       <div style={{ flex: 1 }}>
                          <label style={{ display: "block", fontSize: "11px", fontWeight: "800", color: COLORS.muted, marginBottom: "6px" }}>Start Date</label>
                          <input type="date" value={lotCustomDateStart} onChange={e => setLotCustomDateStart(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.5px solid #EBE9E1", outline: "none", fontWeight: "600" }} />
                       </div>
                       <div style={{ flex: 1 }}>
                          <label style={{ display: "block", fontSize: "11px", fontWeight: "800", color: COLORS.muted, marginBottom: "6px" }}>End Date</label>
                          <input type="date" value={lotCustomDateEnd} onChange={e => setLotCustomDateEnd(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.5px solid #EBE9E1", outline: "none", fontWeight: "600" }} />
                       </div>
                    </div>
                  )}

                  <div style={{ height: "650px", overflowY: "auto", padding: "4px" }}>
                    {(() => {
                      const query = lotSearchQuery.trim().toLowerCase();
                      const today = new Date(); today.setHours(0,0,0,0);
                      const filteredLots = lots.filter(l => {
                        let matchesDate = true;
                        if (lotDateFilter) {
                          const lotDate = l.createdAt ? new Date(l.createdAt) : (l.entryDate ? new Date(l.entryDate) : null);
                          if (lotDate) {
                            lotDate.setHours(0,0,0,0);
                            if (lotDateFilter === "Today") matchesDate = lotDate.getTime() === today.getTime();
                            else if (lotDateFilter === "7 Days") {
                              const past = new Date(today); past.setDate(today.getDate() - 7);
                              matchesDate = lotDate >= past && lotDate <= new Date();
                            } else if (lotDateFilter === "30 Days / One Month") {
                              const past = new Date(today); past.setDate(today.getDate() - 30);
                              matchesDate = lotDate >= past && lotDate <= new Date();
                            } else if (lotDateFilter === "Custom Date") {
                              if (lotCustomDateStart) { const ds = new Date(lotCustomDateStart); ds.setHours(0,0,0,0); if (lotDate < ds) matchesDate = false; }
                              if (lotCustomDateEnd) { const de = new Date(lotCustomDateEnd); de.setHours(23,59,59,999); if (lotDate > de) matchesDate = false; }
                            }
                          }
                        }
                        let matchesProduct = true;
                        const selectedProds = parseMultiValue(lotProductFilter);
                        if (selectedProds.length > 0) {
                          const lotProds = (l.lineItems || []).map(li => li.productId || li.product);
                          matchesProduct = selectedProds.some(p => lotProds.includes(p));
                        }
                        const s_sup = suppliers.find(sup => sup._id === l.supplierId || sup.name === l.farmerName);
                        const sName = s_sup?.name || l.farmerName || "";
                        const sId = getSupplierIdValue(s_sup) || "";
                        const matchesQuery = !query ? true : (
                          sName.toLowerCase().includes(query) || sId.toLowerCase().includes(query) || l.lotId.toLowerCase().includes(query) || l.vehicleNumber?.toLowerCase().includes(query)
                        );
                        return matchesDate && matchesProduct && matchesQuery;
                      });
                      if (filteredLots.length === 0) return <div style={{ textAlign: "center", padding: "100px" }}>No lots found</div>;
                      return (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "24px" }}>
                          {filteredLots.slice().reverse().map((l, idx) => renderRegisteredLotCard(l, idx))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
\n\n`;

s = s.substring(0, startIdx) + newLotsUI + s.substring(endIdx);

// 5. Modal
const mStart = s.indexOf('{viewingEntity.type === "LOT" ? (');
const mEnd = s.indexOf(') : (', mStart);

const newModal = \`{viewingEntity.type === "LOT" ? (
                    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "32px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", background: "#fcfcfc", padding: "24px", borderRadius: "16px", border: "1.5px solid #EBE9E1" }}>
                           {[
                             { label: "LOT ID", value: viewingEntity.data.lotId || "N/A", bold: true },
                             { label: "SUPPLIER NAME", value: viewingEntity.data.farmerName || "N/A" },
                             { label: "VEHICLE NO", value: viewingEntity.data.vehicleNumber || "N/A" },
                             { label: "ORIGIN", value: viewingEntity.data.origin || "N/A", color: COLORS.primary },
                             { label: "DRIVER NAME", value: viewingEntity.data.driverName || "N/A" },
                             { label: "ENTRY DATE", value: viewingEntity.data.entryDate ? new Date(viewingEntity.data.entryDate).toLocaleDateString() : "N/A" },
                             { label: "TOTAL ITEMS", value: viewingEntity.data.lineItems?.length || 0, bold: true }
                           ].map((item, i) => (
                             <div key={i} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                               <span style={{ fontSize: "10px", fontWeight: "800", color: COLORS.muted, textTransform: "uppercase" }}>{item.label}</span>
                               <span style={{ fontSize: "15px", fontWeight: item.bold ? "900" : "800", color: item.color || COLORS.sidebar }}>{item.value}</span>
                             </div>
                           ))}
                        </div>
                    </div>
\`;
s = s.substring(0, mStart) + newModal + s.substring(mEnd);

fs.writeFileSync(p, s, 'utf8');
console.log("Safe update v3 SUCCESS.");
