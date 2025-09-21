import { useState } from "react";
import { PrivyProvider, usePrivy, useLogin, useLogout } from "@privy-io/react-auth";

function LoginPage() {
  const { ready, authenticated, user } = usePrivy();
  const { login } = useLogin();
  const { logout } = useLogout();

  const [status, setStatus] = useState("");

  if (!ready) return <div>Loading...</div>;

  async function handleLogin() {
    try {
      await login();
      if (user?.wallet?.address) {
        setStatus(`✅ Connected: ${user.wallet.address}`);
        // Redirect to your HTML game after login
        window.location.href = "/game.html";
      }
    } catch (err) {
      console.error("Privy login failed:", err);
      setStatus("❌ Login failed, check console.");
    }
  }

  return (
    <div style={{ 
      display: "flex", flexDirection: "column", 
      alignItems: "center", justifyContent: "center", 
      height: "100vh", background: "black", color: "white" 
    }}>
      <h1 style={{ fontFamily: "'Press Start 2P', cursive" }}>Flappy Dak</h1>
      {!authenticated ? (
        <button 
          onClick={handleLogin} 
          style={{
            padding: "12px 20px",
            border: "2px solid white",
            background: "black",
            color: "white",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "20px"
          }}>
          Login with Privy
        </button>
      ) : (
        <button 
          onClick={logout} 
          style={{
            padding: "12px 20px",
            border: "2px solid white",
            background: "red",
            color: "white",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "20px"
          }}>
          Logout
        </button>
      )}
      <p style={{ marginTop: "10px", fontSize: "12px" }}>{status}</p>
    </div>
  );
}

export default function App() {
  return (
    <PrivyProvider appId="cmd8euall0037le0my79qpz42">
      <LoginPage />
    </PrivyProvider>
  );
}
