from web3 import Web3
from eth_account import Account
from eth_account.signers.local import LocalAccount
from eth_account.messages import encode_defunct
import json
import os


# Initialize Web3 connection
INFURA_URL = os.getenv("INFURA_RPC_URL")
w3 = Web3(Web3.HTTPProvider(INFURA_URL))

# Get the current nonce for the Ethereum address
def get_nonce(address: str) -> int:
    try:
        nonce = w3.eth.get_transaction_count(address, 'pending')
        return nonce
    except Exception as e:
        raise Exception(f"Failed to get nonce: {e}")

# Get the chain ID
def get_chain_id() -> int:
    try:
        chain_id = w3.eth.chain_id
        return chain_id
    except Exception as e:
        raise Exception(f"Failed to fetch chain ID: {e}")

# Send a signed transaction
def send_transaction(from_address: str, to_address: str, value: int, data: str = "") -> str:
    try:
        private_key = os.getenv("PRIVATE_KEY")
        account = Account.from_key(private_key)

        nonce = get_nonce(from_address)
        chain_id = get_chain_id()
        gas_price = w3.eth.gas_price

        tx = {
            'nonce': nonce,
            'to': to_address,
            'value': w3.to_wei(value, 'ether'),
            'gas': 21000,
            'gasPrice': gas_price,
            'chainId': chain_id,
            'data': bytes.fromhex(data)
        }

        signed_tx = w3.eth.account.sign_transaction(tx, private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)

        print(f"Transaction sent: {tx_hash.hex()}")
        return tx_hash.hex()

    except Exception as e:
        raise Exception(f"Failed to send transaction: {e}")

# Send an ERC-20 transaction
def send_erc20_transaction(from_address: str, to_address: str, value: int) -> str:
    try:
        private_key = os.getenv("PRIVATE_KEY")
        account = Account.from_key(private_key)

        token_address = os.getenv("ERC20_CONTRACT_ADDRESS")
        token_contract = w3.eth.contract(address=Web3.to_checksum_address(token_address), abi=json.loads('[{"constant":false,"inputs":[{"name":"recipient","type":"address"},{"name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]'))

        nonce = get_nonce(from_address)
        chain_id = get_chain_id()
        gas_price = w3.eth.gas_price

        tx = token_contract.functions.transfer(Web3.to_checksum_address(to_address), value).build_transaction({
            'nonce': nonce,
            'gasPrice': gas_price,
            'from': from_address,
            'chainId': chain_id
        })

        signed_tx = w3.eth.account.sign_transaction(tx, private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)

        print(f"ERC-20 Transaction sent: {tx_hash.hex()}")
        return tx_hash.hex()

    except Exception as e:
        raise Exception(f"Failed to send ERC-20 transaction: {e}")

# Fetch transaction history
def get_transaction_history(address: str):
    try:
        api_key = os.getenv("ETHERSCAN_API_KEY")
        etherscan_url = f"https://api-sepolia.etherscan.io/api?module=account&action=txlist&address={address}&startblock=0&endblock=99999999&sort=desc&apikey={api_key}"

        response = requests.get(etherscan_url)
        response_data = response.json()

        if response_data["status"] != "1":
            raise Exception(f"Error fetching transactions: {response_data['message']}")

        return response_data["result"]

    except Exception as e:
        raise Exception(f"Failed to fetch transactions: {e}")

# Send a signed transaction directly
def send_signed_transaction(signed_tx: str) -> str:
    try:
        tx_hash = w3.eth.send_raw_transaction(signed_tx)
        return tx_hash.hex()
    except Exception as e:
        raise Exception(f"Failed to send signed transaction: {e}")

# Fetch ERC-20 token balance
def get_erc20_balance(address: str) -> int:
    try:
        contract_address = Web3.to_checksum_address("0x8336Fe9c782C385D888DA4C3549Aa3AADb801FAC")
        erc20_abi = '[{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]'

        token_contract = w3.eth.contract(address=contract_address, abi=json.loads(erc20_abi))
        balance = token_contract.functions.balanceOf(Web3.to_checksum_address(address)).call()
        return balance
    except Exception as e:
        raise Exception(f"Failed to get ERC-20 balance: {e}")
