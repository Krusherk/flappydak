<script>
  const PRIVY_APP_ID = "cme0joi9r00fxk10ampyw63t4";
  const contractAddress = "0xb2EFbbC0cFC1898D7d2615856904d3f9785B7D29";
  const abi = [
    {
      "inputs": [],
      "name": "playAndPay",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
  ];

  let signer;

  // ✅ Init Privy
  window.Privy.init({
    appId: PRIVY_APP_ID,
    onReady: () => {
      console.log("✅ Privy ready");

      // Check if user already logged in
      const session = window.Privy.getUser();
      if (session && session.wallet) {
        console.log("🔐 Already logged in:", session.wallet.address);
        localStorage.setItem("flappy_wallet", session.wallet.address);
        document.getElementById("payToPlayBtn").disabled = false;
      }
    }
  });

  // 🔐 Login
  document.getElementById("loginBtn").addEventListener("click", async () => {
    try {
      const user = await window.Privy.login();
      if (user && user.wallet) {
        const wallet = user.wallet.address;
        localStorage.setItem("flappy_wallet", wallet);
        console.log("✅ Logged in with:", wallet);

        // Enable button
        document.getElementById("payToPlayBtn").disabled = false;
      } else {
        alert("⚠️ Login failed or cancelled");
      }
    } catch (err) {
      console.error("❌ Privy login error:", err);
      alert("Login failed. Check console.");
    }
  });

  // 💸 Pay to Play
  document.getElementById("payToPlayBtn").addEventListener("click", async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();

      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.playAndPay({
        value: ethers.parseEther("1.0"),
      });
      await tx.wait();

      localStorage.setItem("flappy_paid", "yes");
      alert("✅ Payment successful! Launching game...");
      window.location.href = "game.html";

    } catch (err) {
      console.error("❌ Payment error:", err);
      alert("Payment failed. Check console.");
    }
  });
</script>
