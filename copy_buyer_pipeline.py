import codecs
import re

content = codecs.open("src/App.jsx", "r", "utf-8").read()

start_marker = '{/* Supplier Role Module (Handles both direct "Supplier" and nested "User Role") */}'
end_marker = '{/* 15.5 PRODUCT MASTER & CONFIGURATION */}'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Could not find module blocks")
    exit(1)

supplier_module = content[start_idx:end_idx]

buyer_module = supplier_module.replace('Supplier Role Module (Handles both direct "Supplier" and nested "User Role")', 'Buyer Role Module (Handles both direct "Buyer" and nested "User Role")')
buyer_module = buyer_module.replace('activeSection === "Supplier"', 'activeSection === "Buyer"')
buyer_module = buyer_module.replace('activeUserRoleTab === "Supplier"', 'activeUserRoleTab === "Buyer"')
buyer_module = buyer_module.replace('activeSupplierTab', 'activeBuyerTab')
buyer_module = buyer_module.replace('setActiveSupplierTab', 'setActiveBuyerTab')
buyer_module = buyer_module.replace('Supplier Registration', 'Buyer Registration')
buyer_module = buyer_module.replace('Supplier Accounts', 'Buyer Accounts')
buyer_module = buyer_module.replace('Dispatch Entry', 'Purchase Entry')

buyer_module = buyer_module.replace('supplierForm', 'buyerForm')
buyer_module = buyer_module.replace('setSupplierForm', 'setBuyerForm')
buyer_module = buyer_module.replace('handleRegisterSupplier', 'handleRegisterBuyer')

buyer_module = buyer_module.replace('Supplier ID', 'Buyer ID')
buyer_module = buyer_module.replace('Supplier Category', 'Buyer Category')

buyer_module = buyer_module.replace('Submit Details', 'Register Buyer')
buyer_module = buyer_module.replace('handleSaveDispatch', 'handleSavePurchase')
buyer_module = buyer_module.replace('Dispatch ID', 'Purchase ID')

# We replace intakeForm with buyerPurchaseForm
buyer_module = buyer_module.replace('intakeForm', 'buyerPurchaseForm')
buyer_module = buyer_module.replace('setIntakeForm', 'setBuyerPurchaseForm')

new_content = content[:end_idx] + buyer_module + content[end_idx:]

# Also define buyerPurchaseForm state copying intakeForm state
state_match = re.search(r'const \[intakeForm, setIntakeForm\] = useState\(\{(.*?)\}\);', new_content, re.DOTALL)
if state_match:
    intake_state_str = state_match.group(0)
    buyer_state_str = intake_state_str.replace('intakeForm', 'buyerPurchaseForm').replace('setIntakeForm', 'setBuyerPurchaseForm')
    new_content = new_content.replace(intake_state_str, intake_state_str + "\n  " + buyer_state_str)

# define handleSavePurchase
stub_func = """
  const handleSavePurchase = async () => {
    alert("📦 PURCHASE ENTRY RECORDED (Stub)");
  };
"""
handle_match = re.search(r'const handleSaveDispatch = async \(\) => \{.+?fetchData\(\);\s+\}\s+else\s+\{[\s\S]+?\}\s+\};', new_content, re.DOTALL)
if handle_match:
    dispatch_func_str = handle_match.group(0)
    buyer_func_str = dispatch_func_str.replace('handleSaveDispatch', 'handleSavePurchase').replace('intakeForm', 'buyerPurchaseForm').replace('setIntakeForm', 'setBuyerPurchaseForm').replace('supplierId', 'buyerId')
    new_content = new_content.replace(dispatch_func_str, dispatch_func_str + "\n" + buyer_func_str)


with codecs.open("src/App.jsx", "w", "utf-8") as f:
    f.write(new_content)
    print("Modifications successfully applied!")
