// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title RawGasForwarder
 * @dev A meta-transaction forwarder contract that enables gasless transactions
 * for ERC20 and ERC721 tokens.
 */
contract RawGasForwarder is Ownable, Pausable, ReentrancyGuard {
    using ECDSA for bytes32;

    // Structs
    struct ERC20ForwardRequest {
        address from;
        address token;
        address to;
        uint256 amount;
        uint256 nonce;
        uint256 deadline;
    }

    struct ERC721ForwardRequest {
        address from;
        address token;
        address to;
        uint256 tokenId;
        uint256 nonce;
        uint256 deadline;
    }

    struct BatchRequest {
        address[] tokens;
        address[] recipients;
        uint256[] amounts;
        bool[] isERC721;
        uint256[] tokenIds;
    }

    // State variables
    mapping(address => uint256) public nonces;
    mapping(bytes32 => bool) public executedTxs;
    uint256 public maxGasPrice;
    
    // Events
    event ERC20TransferForwarded(
        address indexed from,
        address indexed token,
        address indexed to,
        uint256 amount,
        uint256 nonce
    );

    event ERC721TransferForwarded(
        address indexed from,
        address indexed token,
        address indexed to,
        uint256 tokenId,
        uint256 nonce
    );

    event BatchTransferExecuted(
        address indexed from,
        uint256 batchSize,
        uint256 nonce
    );

    constructor() Ownable(msg.sender) {
        maxGasPrice = 100 gwei;
    }

    // Admin functions
    function setMaxGasPrice(uint256 _maxGasPrice) external onlyOwner {
        maxGasPrice = _maxGasPrice;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Verification functions
    function verifyERC20Request(
        ERC20ForwardRequest calldata req,
        bytes calldata signature
    ) public view returns (bool) {
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                keccak256(
                    abi.encode(
                        req.from,
                        req.token,
                        req.to,
                        req.amount,
                        req.nonce,
                        req.deadline
                    )
                )
            )
        );

        address signer = digest.recover(signature);
        return signer == req.from;
    }

    function verifyERC721Request(
        ERC721ForwardRequest calldata req,
        bytes calldata signature
    ) public view returns (bool) {
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                keccak256(
                    abi.encode(
                        req.from,
                        req.token,
                        req.to,
                        req.tokenId,
                        req.nonce,
                        req.deadline
                    )
                )
            )
        );

        address signer = digest.recover(signature);
        return signer == req.from;
    }

    // Execution functions
    function executeERC20Transfer(
        ERC20ForwardRequest calldata req,
        bytes calldata signature
    ) external whenNotPaused nonReentrant returns (bool) {
        require(tx.gasprice <= maxGasPrice, "Gas price too high");
        require(block.timestamp <= req.deadline, "Transaction expired");
        require(nonces[req.from] == req.nonce, "Invalid nonce");
        require(verifyERC20Request(req, signature), "Invalid signature");

        bytes32 txHash = keccak256(abi.encode(req, signature));
        require(!executedTxs[txHash], "Transaction already executed");

        executedTxs[txHash] = true;
        nonces[req.from]++;

        require(
            IERC20(req.token).transferFrom(req.from, req.to, req.amount),
            "Transfer failed"
        );

        emit ERC20TransferForwarded(
            req.from,
            req.token,
            req.to,
            req.amount,
            req.nonce
        );

        return true;
    }

    function executeERC721Transfer(
        ERC721ForwardRequest calldata req,
        bytes calldata signature
    ) external whenNotPaused nonReentrant returns (bool) {
        require(tx.gasprice <= maxGasPrice, "Gas price too high");
        require(block.timestamp <= req.deadline, "Transaction expired");
        require(nonces[req.from] == req.nonce, "Invalid nonce");
        require(verifyERC721Request(req, signature), "Invalid signature");

        bytes32 txHash = keccak256(abi.encode(req, signature));
        require(!executedTxs[txHash], "Transaction already executed");

        executedTxs[txHash] = true;
        nonces[req.from]++;

        IERC721(req.token).safeTransferFrom(req.from, req.to, req.tokenId);

        emit ERC721TransferForwarded(
            req.from,
            req.token,
            req.to,
            req.tokenId,
            req.nonce
        );

        return true;
    }

    function executeBatchTransfer(
        BatchRequest calldata batch,
        uint256 deadline,
        bytes calldata signature
    ) external whenNotPaused nonReentrant returns (bool) {
        require(tx.gasprice <= maxGasPrice, "Gas price too high");
        require(block.timestamp <= deadline, "Transaction expired");
        
        uint256 currentNonce = nonces[msg.sender];
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                keccak256(abi.encode(batch, deadline, currentNonce))
            )
        );

        address signer = digest.recover(signature);
        require(signer == msg.sender, "Invalid signature");

        nonces[msg.sender]++;

        for (uint256 i = 0; i < batch.tokens.length; i++) {
            if (batch.isERC721[i]) {
                IERC721(batch.tokens[i]).safeTransferFrom(
                    msg.sender,
                    batch.recipients[i],
                    batch.tokenIds[i]
                );
            } else {
                require(
                    IERC20(batch.tokens[i]).transferFrom(
                        msg.sender,
                        batch.recipients[i],
                        batch.amounts[i]
                    ),
                    "ERC20 transfer failed"
                );
            }
        }

        emit BatchTransferExecuted(
            msg.sender,
            batch.tokens.length,
            currentNonce
        );

        return true;
    }
}