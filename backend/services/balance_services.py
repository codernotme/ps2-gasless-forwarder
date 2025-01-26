from web3 import Web3
import os

def fetch_balance(address):
    """
    Fetch the balance of an Ethereum address.
    :param address: Ethereum address as a string.
    :return: Balance in Ether as a string, or raises an exception on error.
    """
    # Get the Ethereum RPC URL from environment variables
    infura_rpc_url = os.getenv("INFURA_RPC_URL")
    if not infura_rpc_url:
        raise ValueError("INFURA_RPC_URL environment variable is not set")

    # Connect to the Ethereum node
    web3 = Web3(Web3.HTTPProvider(infura_rpc_url))
    if not web3.is_connected():
        raise ConnectionError("Failed to connect to Ethereum node")

    # Validate the Ethereum address

    if not web3.is_address(address):
        raise ValueError(f"Invalid Ethereum address: {address}")

    # Convert address to checksum format
    checksum_address = web3.to_checksum_address(address)

    # Fetch the balance in Wei (smallest unit of Ether)
    try:
        balance_wei = web3.eth.get_balance(checksum_address)
    except Exception as e:
        raise RuntimeError(f"Failed to fetch balance: {str(e)}")

    # Convert Wei to Ether
    balance_ether = Web3.from_wei(balance_wei, 'ether')

    # Format the Ether balance to 6 decimal places as a string
    return f"{balance_ether:.6f}"
