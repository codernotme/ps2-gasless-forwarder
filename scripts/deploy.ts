import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains';

async function main() {
  // Load environment variables
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKey) throw new Error('Missing DEPLOYER_PRIVATE_KEY');

  // Create account from private key
  const account = privateKeyToAccount(privateKey as `0x${string}`);

  // Create clients
  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http()
  });

  const walletClient = createWalletClient({
    account,
    chain: mainnet,
    transport: http()
  });

  console.log('Deploying RawGasForwarder...');

  // Deploy contract
  const hash = await walletClient.deployContract({
    abi: [], // Add contract ABI here
    bytecode: '0x', // Add contract bytecode here
    account
  });

  // Wait for deployment
  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  console.log('RawGasForwarder deployed to:', receipt.contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});