document.addEventListener("DOMContentLoaded", () => {
  const connectButton = document.getElementById("connectWalletBtn");
  const walletDisplay = document.getElementById("walletAddressDisplay");
const payButton = document.querySelector(".start-btn");
if (payButton) payButton.disabled = false;
  let signer;

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
      signer = await provider.getSigner();
      const address = await signer.getAddress();

      walletDisplay.textContent = `Connected: ${address}`;
      localStorage.setItem("flappy_wallet", address);

      await fetch("/api/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ address })
      });

      console.log("✅ Wallet address sent to backend:", address);
    } catch (err) {
      console.error("Wallet connect error:", err);
      alert("Failed to connect wallet");
    }
  });

  window.payToPlay = async function () {
    const { FLAPPYDAKPAY_ADDRESS } = await import("/public/FlappyDakPay.address.js");
    const abi = await fetch("/public/FlappyDakPay.abi.json").then(res => res.json());

    try {
      if (!signer) {
        if (!window.ethereum) {
          alert("Please install MetaMask");
          return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner();
      }

      const contract = new ethers.Contract(FLAPPYDAKPAY_ADDRESS, abi, signer);
      const tx = await contract.playAndPay({ value: ethers.parseEther("1.0") });
      await tx.wait();

      alert("✅ Payment successful. Game unlocked!");
      window.location.href = "game.html";
    } catch (err) {
      console.error("Payment failed:", err);
      alert("❌ Payment failed. Please try again.");
    }
  };
});
