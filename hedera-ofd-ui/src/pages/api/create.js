// src/pages/api/create.js
import dotenv from "dotenv";
import { Client, TokenCreateTransaction, PrivateKey } from "@hashgraph/sdk";

dotenv.config();

export default async function handler(req, res) {
  console.log("🚀 Token creation API called...");

  try {
    const operatorId = process.env.HEDERA_OPERATOR_ID;
    const operatorKey = PrivateKey.fromString(process.env.HEDERA_OPERATOR_KEY);

    if (!operatorId || !operatorKey) {
      return res.status(400).json({
        error: "Missing environment variables. Check HEDERA_OPERATOR_ID and HEDERA_OPERATOR_KEY in .env.local",
      });
    }

    console.log("🧩 Connecting to Hedera testnet...");
    const client = Client.forTestnet().setOperator(operatorId, operatorKey);

    // Use wallet key as the supply key
    const supplyKey = operatorKey;

    console.log("🪙 Creating OFD token...");

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

    return res.status(200).json({
      success: true,
      tokenId: receipt.tokenId.toString(),
      message: "Token created successfully!",
    });
  } catch (err) {
    console.error("❌ Error creating token:", err);
    return res.status(500).json({ error: err.message });
  }
}
