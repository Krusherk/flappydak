import { useState, useEffect } from "react";

interface MonadGamesUser {
id: number;
username: string;
walletAddress: string;
}

interface UserResponse {
hasUsername: boolean;
user?: MonadGamesUser;
}

interface UseMonadGamesUserReturn {
user: MonadGamesUser | null;
hasUsername: boolean;
isLoading: boolean;
error: string | null;
}
export function useMonadGamesUser(
walletAddress: string

): UseMonadGamesUserReturn {
const [user, setUser] = useState&lt;MonadGamesUser | null&gt;(null);
const [hasUsername, setHasUsername] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState&lt;string | null&gt;(null);
useEffect(() =&gt; {
if (!walletAddress) {
setUser(null);
setHasUsername(false);

setIsLoading(false);
setError(null);
return;
}
const fetchUserData = async () =&gt; {
setIsLoading(true);
setError(null);
try {

const response = await fetch(
`https://www.monadclip.fun/api/check-wallet?wallet=${walletAddress}`
);

if (!response.ok) {
throw new Error(`HTTP error! status: ${response.status}`);
}
const data: UserResponse = await response.json();

setHasUsername(data.hasUsername);
setUser(data.user || null);
} catch (err) {

setError(err instanceof Error ? err.message : "An error occurred");

setHasUsername(false);
setUser(null);
} finally {
setIsLoading(false);
}
};
fetchUserData();
}, [walletAddress]);
return {
user,
hasUsername,

isLoading,
error,

};
}
