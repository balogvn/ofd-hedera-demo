"use client";
import { useState } from "react";
import useHashConnect from "../hooks/useHashConnect";

export default function Home() {
  const { hashconnect, pairingString, pairedAccountIds } = useHashConnect();
  const [amount, setAmount] = useState("");
  const [receiver, setReceiver] = useState("");
  const [log, setLog] = useState("");

  const tokenId = process.env.NEXT_PUBLIC_TOKEN_ID;

  async function callMint() {
    setLog("Calling mint...");
    const res = await fetch("/api/mint", { method: "POST" });
    const j = await res.json();
    setLog(JSON.stringify(j));
  }

  async function callSend() {
    setLog("Sending...");
    const res = await fetch("/api/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ receiver, amount })
    });
    const j = await res.json();
    setLog(JSON.stringify(j));
  }

  return (
    <div style={{padding:20,fontFamily:"system-ui"}}>
      <h1>Oracle Free Dollar (OFD) — Demo</h1>
      {!pairedAccountIds.length ? (
        <div>
          <p>Scan this pairing string with HashPack (Testnet):</p>
          <textarea value={pairingString || "..." } readOnly style={{width:600,height:120}}/>
          <p>Open HashPack & click 'Connect' → paste this string into the QR/pair field (or scan)</p>
        </div>
      ) : (
        <div>
          <p>Connected account: <strong>{pairedAccountIds[0]}</strong></p>

          <div style={{marginTop:12}}>
            <button onClick={callMint}>💰 Mint OFD (server-side)</button>
            <div style={{marginTop:8}}>
              <input placeholder="Receiver (0.0.x)" value={receiver} onChange={e=>setReceiver(e.target.value)} />
              <input placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />
              <button onClick={callSend}>🚀 Send OFD</button>
            </div>
          </div>

          <pre style={{marginTop:12,background:"#f6f8fa",padding:12}}>{log}</pre>
        </div>
      )}
    </div>
  );
}
