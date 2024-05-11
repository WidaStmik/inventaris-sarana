import { auth } from "@/services/firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function useToken() {
  const [user, loading, error] = useAuthState(auth);
  const [token, setToken] = useState<string | null>(null);
  const [loadingToken, setLoadingToken] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      user.getIdToken().then((token) => {
        setToken(token);
        setLoadingToken(false);
      });
    }
  }, [user]);

  if (loading) {
    return { token: null, loading: true, error: null };
  }

  if (!user && !loading) {
    return { token: null, loading: false, error: new Error("User not found") };
  }

  if (error) {
    return { token: null, loading: false, error };
  }

  return { token, loading: loadingToken, error: null };
}
