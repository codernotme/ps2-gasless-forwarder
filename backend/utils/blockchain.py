from web3 import Web3
from eth_account import Account
import os
import json
import requests

# Initialize Web3
INFURA_RPC_URL = os.getenv("INFURA_RPC_URL")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
ERC20_CONTRACT_ADDRESS = os.getenv("ERC20_CONTRACT_ADDRESS")
ERC721_CONTRACT_ADDRESS = os.getenv("ERC721_CONTRACT_ADDRESS")
ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")

web3 = Web3(Web3.HTTPProvider(INFURA_RPC_URL))


# Get the current nonce for the given Ethereum address
def get_nonce(address):
    return web3.eth.get_transaction_count(address)


# Get Chain ID from blockchain
def get_chain_id():
    return web3.eth.chain_id


# Send a signed transaction to the Ethereum network
def send_transaction(from_address, to_address, value, nonce, data):
    try:
        private_key = PRIVATE_KEY
        gas_price = web3.eth.gas_price
        transaction = {
            'to': to_address,
            'value': web3.to_wei(value, 'ether'),
            'gas': 21000,
            'gasPrice': gas_price,
            'nonce': nonce,
            'data': data.encode('utf-8')
        }
        signed_txn = web3.eth.account.sign_transaction(transaction, private_key)
        tx_hash = web3.eth.send_raw_transaction(signed_txn.rawTransaction)
        return web3.to_hex(tx_hash)
    except Exception as e:
        return str(e)


# Send an ERC-20 token transaction
def send_erc20_transaction(from_address, to_address, value):
    try:
        private_key = PRIVATE_KEY
        contract = web3.eth.contract(address=web3.to_checksum_address(ERC20_CONTRACT_ADDRESS), abi=erc20_abi())
        nonce = get_nonce(from_address)
        amount = web3.to_wei(value, 'ether')
        data = contract.encodeABI(fn_name="transfer", args=[to_address, amount])

        gas_price = web3.eth.gas_price
        transaction = {
            'to': ERC20_CONTRACT_ADDRESS,
            'value': 0,
            'gas': 100000,
            'gasPrice': gas_price,
            'nonce': nonce,
            'data': data
        }
        signed_txn = web3.eth.account.sign_transaction(transaction, private_key)
        tx_hash = web3.eth.send_raw_transaction(signed_txn.rawTransaction)
        return web3.to_hex(tx_hash)
    except Exception as e:
        return str(e)


# Send an ERC-721 token transaction
def send_erc721_transaction(from_address, to_address, token_id):
    try:
        private_key = PRIVATE_KEY
        contract = web3.eth.contract(address=web3.to_checksum_address(ERC721_CONTRACT_ADDRESS), abi=erc721_abi())
        nonce = get_nonce(from_address)
        data = contract.encodeABI(fn_name="safeTransferFrom", args=[from_address, to_address, token_id])

        gas_price = web3.eth.gas_price
        transaction = {
            'to': ERC721_CONTRACT_ADDRESS,
            'value': 0,
            'gas': 100000,
            'gasPrice': gas_price,
            'nonce': nonce,
            'data': data
        }
        signed_txn = web3.eth.account.sign_transaction(transaction, private_key)
        tx_hash = web3.eth.send_raw_transaction(signed_txn.rawTransaction)
        return web3.to_hex(tx_hash)
    except Exception as e:
        return str(e)


# Get transaction history from Etherscan
def get_transaction_history(address):
    etherscan_url = f"https://api-sepolia.etherscan.io/api?module=account&action=txlist&address={address}&startblock=0&endblock=99999999&sort=desc&apikey={ETHERSCAN_API_KEY}"
    response = requests.get(etherscan_url)
    if response.status_code == 200:
        data = response.json()
        if data["status"] == "1":
            return data["result"]
        else:
            return f"Error fetching transactions: {data['message']}"
    else:
        return f"Failed to fetch transactions: {response.status_code}"


# Get ERC-20 token balance
def get_erc20_balance(address):
    try:
        contract = web3.eth.contract(address=web3.to_checksum_address(ERC20_CONTRACT_ADDRESS), abi=erc20_abi())
        balance = contract.functions.balanceOf(address).call()
        return balance
    except Exception as e:
        return str(e)


# Get ETH balance
def get_eth_balance(address):
    try:
        balance = web3.eth.get_balance(address)
        return balance
    except Exception as e:
        return str(e)


# Get ERC-721 token balance
def get_erc721_balance(address):
    try:
        contract = web3.eth.contract(address=web3.to_checksum_address(ERC721_CONTRACT_ADDRESS), abi=erc721_abi())
        balance = contract.functions.balanceOf(address).call()
        return balance
    except Exception as e:
        return str(e)


# ERC-20 ABI
def erc20_abi():
    return json.loads(
        '[{"constant":false,"inputs":[{"name":"recipient","type":"address"},{"name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]')


# ERC-721 ABI
def erc721_abi():
    return json.loads(
        '[{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]')


# Send a signed raw transaction
def send_signed_transaction(signed_tx):
    try:
        tx_hash = web3.eth.send_raw_transaction(signed_tx)
        return web3.to_hex(tx_hash)
    except Exception as e:
        return str(e)