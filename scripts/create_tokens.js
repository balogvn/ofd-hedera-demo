// scripts/create_tokens.js
import dotenv from "dotenv";
import { Client, TokenCreateTransaction, PrivateKey } from "@hashgraph/sdk";

dotenv.config();

async function main() {
  console.log("🚀 Script started...");

  const operatorId = process.env.HEDERA_OPERATOR_ID;
  const operatorKey = PrivateKey.fromString(process.env.HEDERA_OPERATOR_KEY);

  if (!operatorId || !operatorKey) {
    console.log("❌ Missing .env variables. Check HEDERA_OPERATOR_ID and HEDERA_OPERATOR_KEY.");
    return;
  }

  console.log("🧩 Connecting to Hedera testnet...");
  const client = Client.forTestnet().setOperator(operatorId, operatorKey);

  // ✅ Use your wallet key as the supply key
  const supplyKey = operatorKey;

  console.log("🪙 Creating token (this may take 10–30 seconds)...");

  try {
    const tokenCreateTx = new TokenCreateTransaction()
      .setTokenName("OracleFreeDollar")
      .setTokenSymbol("OFD")
      .setDecimals(2)
      .setInitialSupply(0)
      .setTreasuryAccountId(operatorId)
      .setSupplyKey(supplyKey)
      .freezeWith(client);

    const signedTx = await tokenCreateTx.sign(operatorKey);
    const txResponse = await signedTx.execute(client);
    const receipt = await txResponse.getReceipt(client);

    console.log("✅ Token created successfully!");
    console.log("🆔 Token ID:", receipt.tokenId.toString());
  } catch (err) {
    console.error("❌ Error creating token:", err);
  }
}

main();
