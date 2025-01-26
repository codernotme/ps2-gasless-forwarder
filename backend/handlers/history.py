from ..utils import blockchain, env_loader


def get_transaction_history(query_params):
    # Extract address from query parameters
    address = query_params.get("address")

    if not address:
        return 400, {"error": "Missing address parameter"}

    transactions, err = blockchain.get_transaction_history(address)
    if err != None:
        return 500, {"error": "Failed to fetch transaction history", "details": err}

    return 200, {"transactions": transactions}