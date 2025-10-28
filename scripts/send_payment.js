// scripts/send_payment.js
import dotenv from "dotenv";
import {
  Client,
  PrivateKey,
  TransferTransaction,
  Hbar,
} from "@hashgraph/sdk";

dotenv.config();

const operatorId = process.env.HEDERA_OPERATOR_ID;
const operatorKey = PrivateKey.fromString(process.env.HEDERA_OPERATOR_KEY);

// Replace with your token and receiver
const tokenId = "0.0.7146774"; // your OFD token
const receiverId = operatorId; // use another testnet account ID you control

async function main() {
  console.log("🚀 Sending OFD payment...");
  const client = Client.forTestnet().setOperator(operatorId, operatorKey);

  try {
    const transaction = await new TransferTransaction()
      .addTokenTransfer(tokenId, operatorId, -10) // send 10 OFD
      .addTokenTransfer(tokenId, receiverId, 10) // receiver gets 10 OFD
      .freezeWith(client)
      .sign(operatorKey);

    const txResponse = await transaction.execute(client);
    const receipt = await txResponse.getReceipt(client);

    console.log(`✅ Sent 10 OFD to ${receiverId}`);
    console.log(`🧾 Status: ${receipt.status.toString()}`);
  } catch (err) {
    console.error("❌ Error sending payment:", err);
  }
}

main();
