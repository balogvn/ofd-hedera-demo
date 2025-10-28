// scripts/check_key.js
require("dotenv").config();
const { PrivateKey } = require("@hashgraph/sdk");

try {
  const key = PrivateKey.fromString(process.env.HEDERA_OPERATOR_KEY);
  console.log("✅ Private key loaded. Public key:", key.publicKey.toString());
} catch (err) {
  console.error("❌ Could not parse key:", err.message);
}
