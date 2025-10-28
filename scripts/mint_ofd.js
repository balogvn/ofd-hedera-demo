// scripts/mint_ofd.js
import dotenv from "dotenv";
import {
  Client,
  PrivateKey,
  TokenMintTransaction,
} from "@hashgraph/sdk";

dotenv.config();

const operatorId = process.env.HEDERA_OPERATOR_ID;
const operatorKey = PrivateKey.fromString(process.env.HEDERA_OPERATOR_KEY);
const tokenId = "0.0.7146774"; // <-- replace with your token ID

async function main() {
  console.log("🚀 Starting mint script...");
  const client = Client.forTestnet().setOperator(operatorId, operatorKey);

  try {
    // Create mint transaction
    let mintTx = new TokenMintTransaction()
      .setTokenId(tokenId)
      .setAmount(1000); // mint 1000 OFD

    // Freeze the transaction with the client
    mintTx = await mintTx.freezeWith(client);

    // Sign with the operator key
    const signedTx = await mintTx.sign(operatorKey);

    // Submit the transaction to the Hedera network
    const mintSubmit = await signedTx.execute(client);

    // Wait for a receipt to confirm success
    const mintReceipt = await mintSubmit.getReceipt(client);

    console.log(`✅ Minted 1000 OFD tokens successfully!`);
    console.log(`🧾 Transaction status: ${mintReceipt.status.toString()}`);
  } catch (error) {
    console.error("❌ Error minting tokens:", error);
  }
}

main();
