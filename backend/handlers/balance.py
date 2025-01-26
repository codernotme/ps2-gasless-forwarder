from ..services.balance_services import fetch_balance

def get_balance(query_params):
    """
    Fetch the balance for a given address.
    :param query_params: Dictionary containing query parameters (e.g., {'address': '0x123...'})
    :return: A tuple (status_code, response_data)
    """
    # Extract address from query parameters
    address = query_params.get("address")
    if not address:
        return 400, {"error": "Missing address parameter"}

    try:
        # Fetch balance from the services module
        balance = fetch_balance(address)
        return 200, {"address": address, "balance": balance}
    except Exception as e:
        # Handle errors and return an appropriate response
        return 500, {"error": "Failed to fetch balance", "details": str(e)}
