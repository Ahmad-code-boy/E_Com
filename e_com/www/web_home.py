import frappe

def get_context(context):
    # Fetch all active items
    items = frappe.get_all(
        "Item",
        fields=["item_code", "item_name", "standard_rate", "description", "image", "item_group"],
        filters={"disabled": 0}
    )

    # Fetch all item groups (leaf nodes)
    item_groups = frappe.get_all(
        "Item Group",
        fields=["name"],  # "name" is the Item Group name
        filters={"is_group": 0}  # only actual groups, not parent groups
    )

    context.items = items
    context.item_groups = [g["name"] for g in item_groups]  # extract names
    return context
