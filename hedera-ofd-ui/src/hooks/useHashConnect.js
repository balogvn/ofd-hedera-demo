"use client";
import { useEffect, useState } from "react";
import { HashConnect } from "hashconnect";

export default function useHashConnect() {
  const [hc, setHc] = useState({
    hashconnect: null,
    topic: "",
    pairingString: "",
    pairedAccountIds: [],
    appMetadata: null
  });

  useEffect(() => {
    const init = async () => {
      const hashconnect = new HashConnect();
      const appMetadata = {
        name: "Oracle Free Dollar (OFD)",
        description: "Mint & send OFD on Hedera Testnet",
        icon: "https://hashpack.app/assets/favicon.png"
      };
      const initData = await hashconnect.init(appMetadata, "testnet", false);
      setHc((s) => ({ ...s, hashconnect, topic: initData.topic, pairingString: initData.pairingString, appMetadata }));
      // auto open HashPack (optional)
      try { hashconnect.connectToLocalWallet(); } catch (e) {}
      hashconnect.pairingEvent.on((pairingData) => {
        setHc((s) => ({ ...s, pairedAccountIds: pairingData.accountIds }));
      });
    };
    init();
  }, []);

  return hc;
}
