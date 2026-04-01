import re

def refactor_app():
    with open(r'c:\Users\sailo\Desktop\mandi-frontend\src\App.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # Step 1: Insert functions right after where the states are defined (around line 2056)
    insertion_point_str = "  const [lotCreationForm, setLotCreationForm] = useState({"
    if insertion_point_str not in content:
        print("Could not find insertion point!")
        return

    insertion_idx = content.find("  const handleRegisterSupplier = async () => {")
    if insertion_idx == -1:
        print("Could not find insertion point 2!")
        return
        
    functions_code = """
  // --- UNIFIED PROFILE SECTIONS FOR REUSABILITY ACROSS MODULES ---
  const getSupplierProfileSections = () => [
    {
      title: "Supplier Profile (Linked from Party Management)",
      fields: [
        { label: "Supplier ID", placeholder: "Auto-generated", value: isEditingSupplier ? supplierForm.supplierId : `${suppliers.length + 1}`, disabled: true },
        { label: "Name *", placeholder: "Full name as per ID", value: supplierForm.name, onChange: (e) => setSupplierForm({ ...supplierForm, name: e.target.value }) },
        { label: "Mobile Number *", type: "tel", placeholder: "Primary + optional alternate", value: supplierForm.phone, onChange: (e) => setSupplierForm({ ...supplierForm, phone: e.target.value }) },
        { label: "Location Type *", type: "dropdown", options: ["Village", "Town", "City"], value: supplierForm.villageOrTown, onChange: (e) => setSupplierForm({ ...supplierForm, villageOrTown: e.target.value }) },
        { label: `${supplierForm.villageOrTown || "Location"} Name *`, placeholder: `Enter ${supplierForm.villageOrTown || "Location"} Name`, value: supplierForm.villageOrTownName, onChange: (e) => setSupplierForm({ ...supplierForm, villageOrTownName: e.target.value }) },
        { label: "District *", placeholder: "Manual typing of district", value: supplierForm.district, onChange: (e) => setSupplierForm({ ...supplierForm, district: e.target.value }) },
        { label: "State *", type: "dropdown", options: ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"], value: supplierForm.state, onChange: (e) => setSupplierForm({ ...supplierForm, state: e.target.value }) },
        { label: "Product *", type: "select", options: Object.keys(PRODUCT_DATA).filter((k) => k !== "default"), value: supplierForm.product, onChange: (e) => setSupplierForm({ ...supplierForm, product: e.target.value }) },
      ],
    },
    {
      title: "KYC Details",
      fields: [
        { label: "ID Type", type: "dropdown", options: ["Aadhaar", "PAN", "GSTIN"], value: supplierForm.idType, onChange: (e) => setSupplierForm({ ...supplierForm, idType: e.target.value }) },
        { label: "Government ID", placeholder: "Aadhaar / PAN / GSTIN", value: supplierForm.govIdNumber, onChange: (e) => setSupplierForm({ ...supplierForm, govIdNumber: e.target.value }) },
      ],
    },
    {
      title: "Bank Details",
      fields: [
        { label: "Bank Account No.", type: "number", placeholder: "For direct bank settlements", value: supplierForm.bankAccount, onChange: (e) => setSupplierForm({ ...supplierForm, bankAccount: e.target.value }) },
        { label: "IFSC Code", placeholder: "Bank branch code", value: supplierForm.ifsc, onChange: (e) => setSupplierForm({ ...supplierForm, ifsc: e.target.value }) },
        { label: "Bank Location", placeholder: "Bank City/Location", value: supplierForm.bankLocation, onChange: (e) => setSupplierForm({ ...supplierForm, bankLocation: e.target.value }) },
        { label: "Bank Branch", placeholder: "Branch Name", value: supplierForm.bankBranch, onChange: (e) => setSupplierForm({ ...supplierForm, bankBranch: e.target.value }) },
        { label: "Advance Balance (\u20B9)", type: "number", placeholder: "Running advance", value: supplierForm.advanceBalance, onChange: (e) => setSupplierForm({ ...supplierForm, advanceBalance: e.target.value }) },
        { label: "Notes", placeholder: "Free form notes", value: supplierForm.notes, onChange: (e) => setSupplierForm({ ...supplierForm, notes: e.target.value }) },
      ],
    },
  ];

  const getCustomerProfileSections = () => [
    {
      title: "Customer Profile (Linked from Party Management)",
      fields: [
        { label: "Customer ID", placeholder: "Auto-generated", value: isEditingBuyer ? buyerForm.buyerId : `${buyers.length + 1}`, disabled: true },
        { label: "Customer Name *", placeholder: "Individual or business name", value: buyerForm.name, onChange: (e) => setBuyerForm({ ...buyerForm, name: e.target.value }) },
        { label: "Mobile Number *", type: "tel", placeholder: "Mobile Number", value: buyerForm.phone, onChange: (e) => setBuyerForm({ ...buyerForm, phone: e.target.value }) },
        { label: "Address *", placeholder: "Delivery / shop address", value: buyerForm.address, onChange: (e) => setBuyerForm({ ...buyerForm, address: e.target.value }) },
        { label: "Location Type *", type: "dropdown", options: ["Village", "Town", "City"], value: buyerForm.villageOrTown, onChange: (e) => setBuyerForm({ ...buyerForm, villageOrTown: e.target.value }) },
        { label: `${buyerForm.villageOrTown || "Location"} Name *`, placeholder: `Enter ${buyerForm.villageOrTown || "Location"} Name`, value: buyerForm.villageOrTownName, onChange: (e) => setBuyerForm({ ...buyerForm, villageOrTownName: e.target.value }) },
        { label: "District *", placeholder: "Manual typing of district", value: buyerForm.district, onChange: (e) => setBuyerForm({ ...buyerForm, district: e.target.value }) },
        { label: "State *", type: "dropdown", options: ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"], value: buyerForm.state, onChange: (e) => setBuyerForm({ ...buyerForm, state: e.target.value }) },
        { label: "Product *", type: "select", options: Object.keys(PRODUCT_DATA).filter((k) => k !== "default"), value: buyerForm.product, onChange: (e) => setBuyerForm({ ...buyerForm, product: e.target.value }) },
      ],
    },
    {
      title: "KYC Details",
      fields: [
        { label: "ID Type", type: "dropdown", options: ["Aadhaar", "PAN", "GSTIN"], value: buyerForm.idType, onChange: (e) => setBuyerForm({ ...buyerForm, idType: e.target.value }) },
        { label: "Government ID", placeholder: "Aadhaar / PAN / GSTIN", value: buyerForm.govIdNumber, onChange: (e) => setBuyerForm({ ...buyerForm, govIdNumber: e.target.value }) },
      ],
    },
    {
      title: "Bank Details",
      fields: [
        { label: "Bank Account No.", type: "number", placeholder: "For bank settlements", value: buyerForm.bankAccount, onChange: (e) => setBuyerForm({ ...buyerForm, bankAccount: e.target.value }) },
        { label: "IFSC Code", placeholder: "Bank branch code", value: buyerForm.ifsc, onChange: (e) => setBuyerForm({ ...buyerForm, ifsc: e.target.value }) },
        { label: "Bank Location", placeholder: "Bank City/Location", value: buyerForm.bankLocation, onChange: (e) => setBuyerForm({ ...buyerForm, bankLocation: e.target.value }) },
        { label: "Bank Branch", placeholder: "Branch Name", value: buyerForm.bankBranch, onChange: (e) => setBuyerForm({ ...buyerForm, bankBranch: e.target.value }) },
        { label: "Advance Payment (\u20B9)", type: "number", placeholder: "Advance payment received?", value: buyerForm.advanceBalance, onChange: (e) => setBuyerForm({ ...buyerForm, advanceBalance: e.target.value }) },
        { label: "Notes", placeholder: "Free-form notes", value: buyerForm.notes, onChange: (e) => setBuyerForm({ ...buyerForm, notes: e.target.value }) },
      ],
    },
    {
      title: "Credit Details",
      fields: [
        { label: "Credit Limit (\u20B9) *", type: "number", placeholder: "Max credit allowed; 0 = cash only", value: buyerForm.creditLimit, onChange: (e) => setBuyerForm({ ...buyerForm, creditLimit: e.target.value }) },
        { label: "Payment Terms *", type: "dropdown", options: ["Immediate", "7 Days", "15 Days", "30 Days"], value: buyerForm.paymentTerms, onChange: (e) => setBuyerForm({ ...buyerForm, paymentTerms: e.target.value }) },
        { label: "Notes", placeholder: "Free form notes", value: buyerForm.notes, onChange: (e) => setBuyerForm({ ...buyerForm, notes: e.target.value }) },
      ],
    }
  ];\n\n"""
  
    content = content[:insertion_idx] + functions_code + content[insertion_idx:]
    
    # Step 2: Replace Party Management instances
    search_supplier = """                  <FormGrid
                    sections={[
                      {
                        title: "Supplier Profile",
                        fields: [
                          { label: "Supplier ID", placeholder: "Auto-generated", value: isEditingSupplier ? supplierForm.supplierId : `${suppliers.length + 1}`, disabled: true },
                          { label: "Name *", placeholder: "Full name as per ID", value: supplierForm.name, onChange: (e) => setSupplierForm({ ...supplierForm, name: e.target.value }) },
                          { label: "Mobile Number *", type: "tel", placeholder: "Primary + optional alternate", value: supplierForm.phone, onChange: (e) => setSupplierForm({ ...supplierForm, phone: e.target.value }) },
                          { label: "Location Type *", type: "dropdown", options: ["Village", "Town", "City"], value: supplierForm.villageOrTown, onChange: (e) => setSupplierForm({ ...supplierForm, villageOrTown: e.target.value }) },
                          { label: `${supplierForm.villageOrTown || "Location"} Name *`, placeholder: `Enter ${supplierForm.villageOrTown || "Location"} Name`, value: supplierForm.villageOrTownName, onChange: (e) => setSupplierForm({ ...supplierForm, villageOrTownName: e.target.value }) },
                          { label: "District *", placeholder: "Manual typing of district", value: supplierForm.district, onChange: (e) => setSupplierForm({ ...supplierForm, district: e.target.value }) },
                          { label: "State *", type: "dropdown", options: ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"], value: supplierForm.state, onChange: (e) => setSupplierForm({ ...supplierForm, state: e.target.value }) },
                          { label: "Product *", type: "select", options: Object.keys(PRODUCT_DATA).filter((k) => k !== "default"), value: supplierForm.product, onChange: (e) => setSupplierForm({ ...supplierForm, product: e.target.value }) },
                        ],
                      },
                      {
                        title: "KYC Details",
                        fields: [
                          { label: "ID Type", type: "dropdown", options: ["Aadhaar", "PAN", "GSTIN"], value: supplierForm.idType, onChange: (e) => setSupplierForm({ ...supplierForm, idType: e.target.value }) },
                          { label: "Government ID", placeholder: "Aadhaar / PAN / GSTIN", value: supplierForm.govIdNumber, onChange: (e) => setSupplierForm({ ...supplierForm, govIdNumber: e.target.value }) },
                        ],
                      },
                      {
                        title: "Bank Details",
                        fields: [
                          { label: "Bank Account No.", type: "number", placeholder: "For direct bank settlements", value: supplierForm.bankAccount, onChange: (e) => setSupplierForm({ ...supplierForm, bankAccount: e.target.value }) },
                          { label: "IFSC Code", placeholder: "Bank branch code", value: supplierForm.ifsc, onChange: (e) => setSupplierForm({ ...supplierForm, ifsc: e.target.value }) },
                          { label: "Bank Location", placeholder: "Bank City/Location", value: supplierForm.bankLocation, onChange: (e) => setSupplierForm({ ...supplierForm, bankLocation: e.target.value }) },
                          { label: "Bank Branch", placeholder: "Branch Name", value: supplierForm.bankBranch, onChange: (e) => setSupplierForm({ ...supplierForm, bankBranch: e.target.value }) },
                          { label: "Advance Balance (\u20B9)", type: "number", placeholder: "Running advance", value: supplierForm.advanceBalance, onChange: (e) => setSupplierForm({ ...supplierForm, advanceBalance: e.target.value }) },
                          { label: "Notes", placeholder: "Free form notes", value: supplierForm.notes, onChange: (e) => setSupplierForm({ ...supplierForm, notes: e.target.value }) },
                        ],
                      },
                    ]}
                  />"""
    content = content.replace(search_supplier, "                  <FormGrid sections={getSupplierProfileSections()} />")

    search_customer = """                  <FormGrid
                    sections={[
                      {
                        title: "Customer Profile",
                        fields: [
                          { label: "Customer ID", placeholder: "Auto-generated", value: isEditingBuyer ? buyerForm.buyerId : `${buyers.length + 1}`, disabled: true },
                          { label: "Customer Name *", placeholder: "Individual or business name", value: buyerForm.name, onChange: (e) => setBuyerForm({ ...buyerForm, name: e.target.value }) },
                          { label: "Mobile Number *", type: "tel", placeholder: "Mobile Number", value: buyerForm.phone, onChange: (e) => setBuyerForm({ ...buyerForm, phone: e.target.value }) },
                          { label: "Address *", placeholder: "Delivery / shop address", value: buyerForm.address, onChange: (e) => setBuyerForm({ ...buyerForm, address: e.target.value }) },
                          { label: "Location Type *", type: "dropdown", options: ["Village", "Town", "City"], value: buyerForm.villageOrTown, onChange: (e) => setBuyerForm({ ...buyerForm, villageOrTown: e.target.value }) },
                          { label: `${buyerForm.villageOrTown || "Location"} Name *`, placeholder: `Enter ${buyerForm.villageOrTown || "Location"} Name`, value: buyerForm.villageOrTownName, onChange: (e) => setBuyerForm({ ...buyerForm, villageOrTownName: e.target.value }) },
                          { label: "District *", placeholder: "Manual typing of district", value: buyerForm.district, onChange: (e) => setBuyerForm({ ...buyerForm, district: e.target.value }) },
                          { label: "State *", type: "dropdown", options: ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"], value: buyerForm.state, onChange: (e) => setBuyerForm({ ...buyerForm, state: e.target.value }) },
                          { label: "Product *", type: "select", options: Object.keys(PRODUCT_DATA).filter((k) => k !== "default"), value: buyerForm.product, onChange: (e) => setBuyerForm({ ...buyerForm, product: e.target.value }) },
                        ],
                      },
                      {
                        title: "KYC Details",
                        fields: [
                          { label: "ID Type", type: "dropdown", options: ["Aadhaar", "PAN", "GSTIN"], value: buyerForm.idType, onChange: (e) => setBuyerForm({ ...buyerForm, idType: e.target.value }) },
                          { label: "Government ID", placeholder: "Aadhaar / PAN / GSTIN", value: buyerForm.govIdNumber, onChange: (e) => setBuyerForm({ ...buyerForm, govIdNumber: e.target.value }) },
                        ],
                      },
                      {
                        title: "Bank Details",
                        fields: [
                          { label: "Bank Account No.", type: "number", placeholder: "For bank settlements", value: buyerForm.bankAccount, onChange: (e) => setBuyerForm({ ...buyerForm, bankAccount: e.target.value }) },
                          { label: "IFSC Code", placeholder: "Bank branch code", value: buyerForm.ifsc, onChange: (e) => setBuyerForm({ ...buyerForm, ifsc: e.target.value }) },
                          { label: "Bank Location", placeholder: "Bank City/Location", value: buyerForm.bankLocation, onChange: (e) => setBuyerForm({ ...buyerForm, bankLocation: e.target.value }) },
                          { label: "Bank Branch", placeholder: "Branch Name", value: buyerForm.bankBranch, onChange: (e) => setBuyerForm({ ...buyerForm, bankBranch: e.target.value }) },
                          { label: "Advance Payment (\u20B9)", type: "number", placeholder: "Advance payment received?", value: buyerForm.advanceBalance, onChange: (e) => setBuyerForm({ ...buyerForm, advanceBalance: e.target.value }) },
                          { label: "Notes", placeholder: "Free-form notes", value: buyerForm.notes, onChange: (e) => setBuyerForm({ ...buyerForm, notes: e.target.value }) },
                        ],
                      },
                      {
                        title: "Credit Details",
                        fields: [
                          { label: "Credit Limit (\u20B9) *", type: "number", placeholder: "Max credit allowed; 0 = cash only", value: buyerForm.creditLimit, onChange: (e) => setBuyerForm({ ...buyerForm, creditLimit: e.target.value }) },
                          { label: "Payment Terms *", type: "dropdown", options: ["Immediate", "7 Days", "15 Days", "30 Days"], value: buyerForm.paymentTerms, onChange: (e) => setBuyerForm({ ...buyerForm, paymentTerms: e.target.value }) },
                          { label: "Notes", placeholder: "Free form notes", value: buyerForm.notes, onChange: (e) => setBuyerForm({ ...buyerForm, notes: e.target.value }) },
                        ],
                      }
                    ]}
                  />"""
    content = content.replace(search_customer, "                  <FormGrid sections={getCustomerProfileSections()} />")

    # Step 3: Inject FormGrid logic into Lot Intake (Lot Creation)
    search_lot_intake_dropdown = """                          {
                            label: "Supplier Name *",
                            type: "othersDropdown",
                            options: suppliers.map((s) => formatNameWithId(s.name, getSupplierIdValue(s))),
                            value: suppliers.find(s => (s._id || s.id) === lotCreationForm.farmerId) 
                              ? formatNameWithId(suppliers.find(s => (s._id || s.id) === lotCreationForm.farmerId).name, getSupplierIdValue(suppliers.find(s => (s._id || s.id) === lotCreationForm.farmerId)))
                              : lotCreationForm.farmerId,
                            onChange: (e) => {
                              const val = e.target.value;
                              const foundS = suppliers.find((s) => formatNameWithId(s.name, getSupplierIdValue(s)) === val);
                              setLotCreationForm({
                                ...lotCreationForm,
                                farmerId: foundS?._id || foundS?.id || val,
                                origin: foundS
                                  ? foundS.village || foundS.state || ""
                                  : "",
                              });
                            },
                          },"""
    
    replace_lot_intake_dropdown = """                          {
                            label: "Supplier Name *",
                            type: "othersDropdown",
                            options: suppliers.map((s) => formatNameWithId(s.name, getSupplierIdValue(s))),
                            value: suppliers.find(s => (s._id || s.id) === lotCreationForm.farmerId) 
                              ? formatNameWithId(suppliers.find(s => (s._id || s.id) === lotCreationForm.farmerId).name, getSupplierIdValue(suppliers.find(s => (s._id || s.id) === lotCreationForm.farmerId)))
                              : lotCreationForm.farmerId,
                            onChange: (e) => {
                              const val = e.target.value;
                              const foundS = suppliers.find((s) => formatNameWithId(s.name, getSupplierIdValue(s)) === val || s.name === val || s._id === val);
                              setLotCreationForm({
                                ...lotCreationForm,
                                farmerId: foundS?._id || foundS?.id || val,
                                origin: foundS
                                  ? foundS.village || foundS.state || ""
                                  : "",
                              });
                              // UNIFIED PROFILE: Auto-fill supplier form
                              if (foundS) {
                                handleEditSelect("Supplier", foundS);
                              } else {
                                // Clear form for manual entry
                                setSupplierForm({
                                  supplierId: "", name: val, phone: "", villageOrTown: "", villageOrTownName: "", district: "", state: "", product: "", idType: "", govIdNumber: "", bankAccount: "", bankLocation: "", bankBranch: "", ifsc: "", advanceBalance: "", notes: "",
                                });
                                setIsEditingSupplier(false);
                                setEditingSupplierId(null);
                              }
                            },
                          },"""
    content = content.replace(search_lot_intake_dropdown, replace_lot_intake_dropdown)

    # Insert Supplier Form below Intake Details in Lot Creation
    search_lot_intake_render = """                      {
                        title: "Intake Details",
                        fields: ["""
    
    # We find where FormGrid ends in Lot Creation
    lot_sync_btn = """                        if (
                          !lotCreationForm.farmerId ||
                          !lotCreationForm.vehicleNumber ||
                          !lotCreationForm.origin
                        ) {
                          alert("Please complete all Intake Details first!");
                          return;
                        }"""
    
    replace_lot_sync_btn = """                        if (
                          !lotCreationForm.farmerId ||
                          !lotCreationForm.vehicleNumber ||
                          !lotCreationForm.origin
                        ) {
                          alert("Please complete all Intake Details first!");
                          return;
                        }
                        
                        // SYNC: Auto-save supplier inline if modified
                        if (supplierForm.name && supplierForm.phone) {
                            handleRegisterSupplier();
                        }"""
    content = content.replace(lot_sync_btn, replace_lot_sync_btn)
    
    search_lot_formgrid_end = """                        ],
                      },
                    ]}
                  />"""
    replace_lot_formgrid_end = """                        ],
                      },
                      ...getSupplierProfileSections()
                    ]}
                  />"""
    content = content.replace(search_lot_formgrid_end, replace_lot_formgrid_end, 1)

    # Step 4: Record Allocation Customer Mapping
    alloc_customer_search = """                      {
                        label: "Customer Name *",
                        type: "dropdown",
                        options: ["", ...buyers.map((b) => b.name)],
                        value: allocationForm.buyerId,
                        onChange: (e) => {
                          const selectedName = e.target.value;
                          setAllocationForm({
                            ...allocationForm,
                            buyerId: selectedName,
                          });
                        },
                      },"""
    alloc_customer_replace = """                      {
                        label: "Customer Name *",
                        type: "othersDropdown",
                        options: buyers.map((b) => formatNameWithId(b.name, getCustomerIdValue(b))),
                        value: allocationForm.buyerId,
                        onChange: (e) => {
                          const val = e.target.value;
                          const foundB = buyers.find((b) => formatNameWithId(b.name, getCustomerIdValue(b)) === val || b.name === val);
                          setAllocationForm({
                            ...allocationForm,
                            buyerId: foundB?.name || val,
                          });
                          
                          // UNIFIED PROFILE: Auto-fill buyer form
                          if (foundB) {
                            handleEditSelect("Customer", foundB);
                          } else {
                            // Clear form for manual entry
                            setBuyerForm({
                                buyerId: "", name: val, shopName: "", phone: "", address: "", villageOrTown: "", villageOrTownName: "", district: "", state: "", product: "", idType: "", govIdNumber: "", creditLimit: "", paymentTerms: "Immediate", bankAccount: "", bankLocation: "", bankBranch: "", ifsc: "", advanceBalance: "", notes: "",
                            });
                            setIsEditingBuyer(false);
                            setEditingBuyerId(null);
                          }
                        },
                      },"""
    content = content.replace(alloc_customer_search, alloc_customer_replace)
    
    alloc_formgrid_end = """                    ],
                  },
                ]}
              />"""
    alloc_formgrid_replace = """                    ],
                  },
                  ...getCustomerProfileSections()
                ]}
              />"""
    content = content.replace(alloc_formgrid_end, alloc_formgrid_replace, 1)

    # Sync Allocation Save
    alloc_handle_search = """                  onClick={async () => {
                    await handleAllocate();
                    setAllocationSaveBtn({"""
    alloc_handle_replace = """                  onClick={async () => {
                    // SYNC: Auto-save buyer inline if modified
                    if (buyerForm.name && buyerForm.phone) {
                        handleRegisterBuyer();
                    }
                    await handleAllocate();
                    setAllocationSaveBtn({"""
    content = content.replace(alloc_handle_search, alloc_handle_replace)
    
    with open(r'c:\Users\sailo\Desktop\mandi-frontend\src\App.jsx', 'w', encoding='utf-8') as f:
        f.write(content)

refactor_app()
