// src/pages/api/send.js
import dotenv from "dotenv";
import { Client, PrivateKey, TransferTransaction } from "@hashgraph/sdk";

dotenv.config();

export default async function handler(req, res) {
  console.log("🚀 Sending OFD payment via API...");

  try {
    const operatorId = process.env.HEDERA_OPERATOR_ID;
    const operatorKey = PrivateKey.fromString(process.env.HEDERA_OPERATOR_KEY);
    const tokenId = process.env.HEDERA_TOKEN_ID || "0.0.7146774";
    const receiverId = req.query.receiverId || operatorId; // optional: can send to others later

    if (!operatorId || !operatorKey || !tokenId) {
      return res.status(400).json({
        error: "Missing HEDERA_OPERATOR_ID, HEDERA_OPERATOR_KEY, or HEDERA_TOKEN_ID in environment variables.",
      });
    }

    console.log(`💳 Operator: ${operatorId}`);
    console.log(`📩 Receiver: ${receiverId}`);
    console.log(`🪙 Token: ${tokenId}`);

    const client = Client.forTestnet().setOperator(operatorId, operatorKey);

    // Create the transfer transaction
    const transaction = await new TransferTransaction()
      .addTokenTransfer(tokenId, operatorId, -10) // sender loses 10 OFD
      .addTokenTransfer(tokenId, receiverId, 10)  // receiver gains 10 OFD
      .freezeWith(client)
      .sign(operatorKey);

    // Submit to Hedera
    const txResponse = await transaction.execute(client);
    const receipt = await txResponse.getReceipt(client);

    console.log(`✅ Sent 10 OFD to ${receiverId}`);
    console.log(`🧾 Status: ${receipt.status.toString()}`);

    return res.status(200).json({
      success: true,
      tokenId,
      amount: 10,
      receiverId,
      status: receipt.status.toString(),
      message: `Sent 10 OFD to ${receiverId} successfully!`,
    });
  } catch (err) {
    console.error("❌ Error sending payment:", err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
