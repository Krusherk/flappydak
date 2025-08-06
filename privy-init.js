// privy-init.js
import { PrivyProvider } from "@privy-io/react-auth";

const PRIVY_APP_ID = "cme0joi9r00fxk10ampyw63t4";

export function initPrivy(app) {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      onSuccess={(user) => {
        console.log("✅ User logged in:", user);
      }}
    >
      {app}
    </PrivyProvider>
  );
}
