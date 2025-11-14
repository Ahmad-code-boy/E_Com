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
    # Check if user already exists
    if frappe.db.exists("User", {"email": email}):
        return {"status": "error", "message": "Email already registered"}

    # Create new User
    user = frappe.get_doc({
        "doctype": "User",
        "email": email,
        "first_name": full_name,
        "enabled": 1,
        "new_password": password  # Frappe will hash and save automatically
    })
    user.insert(ignore_permissions=True)

    return {"status": "success", "message": "User created successfully"}

