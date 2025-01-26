from web3 import Web3
import os
from ..utils import blockchain
from eth_account.messages import encode_defunct

def relay_transaction(request_data):
    """
    Handle gasless transaction relay requests
    """
    try:
        # Extract request data
        from_address = request_data.get("from")
        to_address = request_data.get("to")
        value = request_data.get("value", "0")
        data = request_data.get("data", "0x")
        signature = request_data.get("signature")
        nonce = request_data.get("nonce")

        if not all([from_address, to_address, signature]):
            return 400, {"error": "Missing required parameters"}

        # Verify signature
        message_hash = Web3.solidity_keccak(
            ["address", "address", "uint256", "uint256", "bytes"],
            [from_address, to_address, int(value), int(nonce), data]
        )
        
        message = encode_defunct(message_hash)
        recovered_address = Web3().eth.account.recover_message(message, signature=signature)

        if recovered_address.lower() != from_address.lower():
            return 401, {"error": "Invalid signature"}

        # Forward the transaction
        tx_hash = blockchain.send_transaction(
            from_address=from_address,
            to_address=to_address,
            value=value,
            nonce=nonce,
            data=data
        )

        return 200, {"txHash": tx_hash}

    except Exception as e:
        return 500, {"error": "Failed to relay transaction", "details": str(e)}
