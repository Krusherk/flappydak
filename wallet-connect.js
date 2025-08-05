document.addEventListener("DOMContentLoaded", () => {
  const connectButton = document.getElementById("connectWalletBtn");
  const walletDisplay = document.getElementById("walletAddressDisplay");

  if (!connectButton) {
    console.error("❌ Connect button not found in DOM!");
    return;
  }

  connectButton.addEventListener("click", async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not found");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      walletDisplay.textContent = `Connected: ${address}`;
      localStorage.setItem("flappy_wallet", address);

    } catch (err) {
      console.error("Wallet connect error:", err);
      alert("Failed to connect wallet");
    }
  });
});
