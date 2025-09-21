import { usePrivy, PrivyProvider } from '@privy-io/react-auth';

function LoginContent() {
  const { login, logout, authenticated, user, ready } = usePrivy();

  if (!ready) return <p>Loading...</p>;

  if (!authenticated) {
    return (
      <button
        onClick={login}
        style={{
          padding: '10px 20px',
          border: '2px solid white',
          borderRadius: '8px',
          background: 'black',
          color: 'white',
          fontFamily: "'Press Start 2P', cursive",
          cursor: 'pointer',
        }}
      >
        Login with Monad ID
      </button>
    );
  }

  const wallet = user?.wallet?.address;

  return (
    <div style={{ textAlign: 'center' }}>
      <p>✅ Connected: {wallet}</p>
      <button
        onClick={() => (window.location.href = '/index.html')}
        style={{
          padding: '10px 20px',
          border: '2px solid white',
          borderRadius: '8px',
          background: 'green',
          color: 'white',
          marginRight: '10px',
          fontFamily: "'Press Start 2P', cursive",
          cursor: 'pointer',
        }}
      >
        Play Flappy Dak
      </button>
      <button
        onClick={logout}
        style={{
          padding: '10px 20px',
          border: '2px solid white',
          borderRadius: '8px',
          background: 'red',
          color: 'white',
          fontFamily: "'Press Start 2P', cursive",
          cursor: 'pointer',
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default function LoginPage() {
  return (
    <PrivyProvider appId="cmc0czv3l004ll20l7jknrcg0">
      <LoginContent />
    </PrivyProvider>
  );
}
