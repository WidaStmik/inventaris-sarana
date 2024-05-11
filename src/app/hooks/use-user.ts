import { useGetUserQuery } from "@/services/user";
import useToken from "./use-token";

export default function useUser() {
  const { token, loading, error } = useToken();
  const {
    data: user,
    isLoading,
    error: userError,
  } = useGetUserQuery(token!, { skip: !token });

  if (loading || isLoading) {
    return { user: null, loading: true, error: null };
  }

  if (error || userError) {
    return { user: null, loading: false, error: error || userError };
  }

  return { user, loading: false, error: null };
}
