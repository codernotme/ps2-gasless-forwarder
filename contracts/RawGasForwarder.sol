// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RawGasForwarder is Ownable {
    using ECDSA for bytes32;

    mapping(address => uint256) public nonces;
    mapping(bytes32 => bool) public executedTxs;

    event TransactionForwarded(
        address indexed from,
        address indexed to,
        uint256 value,
        uint256 nonce
    );

    constructor() Ownable(msg.sender) {}

    struct ForwardRequest {
        address from;
        address to;
        uint256 value;
        uint256 gas;
        uint256 nonce;
        bytes data;
        uint256 deadline;
    }

    function verify(ForwardRequest calldata req, bytes calldata signature)
        public
        view
        returns (bool)
    {
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                keccak256(
                    abi.encode(
                        req.from,
                        req.to,
                        req.value,
                        req.gas,
                        req.nonce,
                        req.data,
                        req.deadline
                    )
                )
            )
        );

        address signer = digest.recover(signature);
        return signer == req.from;
    }

    function execute(ForwardRequest calldata req, bytes calldata signature)
        external
        payable
        returns (bool, bytes memory)
    {
        require(block.timestamp <= req.deadline, "Transaction expired");
        require(nonces[req.from] == req.nonce, "Invalid nonce");
        require(verify(req, signature), "Invalid signature");

        nonces[req.from]++;

        (bool success, bytes memory returndata) = req.to.call{
            gas: req.gas,
            value: req.value
        }(req.data);

        require(success, "Transaction execution failed");

        emit TransactionForwarded(req.from, req.to, req.value, req.nonce);

        return (success, returndata);
    }

    function transferERC20(
        address token,
        address from,
        address to,
        uint256 amount,
        bytes calldata signature
    ) external {
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                keccak256(abi.encode(token, from, to, amount, nonces[from]))
            )
        );

        address signer = digest.recover(signature);
        require(signer == from, "Invalid signature");

        nonces[from]++;

        require(
            IERC20(token).transferFrom(from, to, amount),
            "Transfer failed"
        );
    }
}