// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract GaslessForwarder {
    using ECDSA for bytes32;

    address public owner;
    mapping(address => bool) public relayers;
    mapping(address => uint256) public nonces;

    event TransactionForwarded(
        address indexed from,
        address indexed to,
        uint256 value,
        bytes data
    );
    event RelayerAdded(address indexed relayer);
    event RelayerRemoved(address indexed relayer);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    struct ForwardRequest {
        address from;
        address to;
        uint256 value;
        uint256 nonce;
        bytes data;
    }

    modifier onlyRelayer() {
        require(relayers[msg.sender], "Not an authorized relayer");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addRelayer(address _relayer) external onlyOwner {
        require(!relayers[_relayer], "Relayer already added");
        relayers[_relayer] = true;
        emit RelayerAdded(_relayer);
    }

    function removeRelayer(address _relayer) external onlyOwner {
        require(relayers[_relayer], "Relayer not found");
        relayers[_relayer] = false;
        emit RelayerRemoved(_relayer);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function executeTransaction(
        ForwardRequest calldata req,
        bytes calldata signature
    ) external onlyRelayer {
        bytes32 messageHash = keccak256(
            abi.encode(req.from, req.to, req.value, req.nonce, req.data)
        );
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );

        address recoveredSigner = ethSignedMessageHash.recover(signature);

        require(recoveredSigner == req.from, "Invalid signature");
        require(nonces[req.from] == req.nonce, "Invalid nonce");

        nonces[req.from]++;
        (bool success, ) = req.to.call{value: req.value}(req.data);
        require(success, "Transaction failed");

        emit TransactionForwarded(req.from, req.to, req.value, req.data);
    }

    function getNonce(address account) external view returns (uint256) {
        return nonces[account];
    }
}