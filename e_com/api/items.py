import frappe
import requests

@frappe.whitelist()
def import_items_from_json():
    url = "https://fakestoreapi.com/products"  
    response = requests.get(url)
    data = response.json()

    for product in data:
        if not frappe.db.exists("Item", {"item_code": str(product["id"])}):
            item = frappe.get_doc({
                "doctype": "Item",
                "naming_series": "STO-ITEM-.YYYY.-",
                "item_code": str(product["id"]),
                "item_name": product["title"],
                "item_group": "Products",   
                "stock_uom": "Nos",        
                "standard_rate": product["price"],
                "description": product["description"],
                "image": product["image"],
                "is_stock_item": 1,
                "disabled": 0,
                "is_sales_item": 1,
                "is_purchase_item": 1
            })
            item.insert()
            frappe.db.commit()
    return "Items Imported Successfully!"

@frappe.whitelist(allow_guest=True)
def signup_user(full_name, email, password):
    if frappe.db.exists("User", {"email": email}):
        return {"status": "error", "message": "Email already registered"}

    user = frappe.get_doc({
        "doctype": "User",
        "email": email,
        "first_name": full_name.split()[0],
        "last_name": " ".join(full_name.split()[1:]) if len(full_name.split()) > 1 else "",
        "enabled": 1,
        "new_password": password
    })

    user.flags.ignore_mandatory = True
    user.flags.ignore_permissions = True
    user.flags.ignore_permissions_apply_user = True

    user.insert()
    frappe.db.commit()

    # **Assign default role (e.g., Customer)**
    user.add_roles("Customer")
    frappe.db.commit()

    return {"status": "success", "message": "Account created successfully!"}
