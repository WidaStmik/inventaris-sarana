import { useGetUserQuery } from "@/services/user";
import { NAV_ITEMS } from "../constants/navbar";
import useToken from "./use-token";
import { Roles } from "../constants";
import { useMemo } from "react";
import { claims } from "@/paths";

export default function useNavItems() {
  const { token, loading } = useToken();
  const { data: user, isLoading } = useGetUserQuery(token!, { skip: !token });

  const filteredNavItems = useMemo(() => {
    return NAV_ITEMS.filter((item) =>
      claims[item.href as keyof typeof claims].includes(
        user?.customClaims?.role ?? Roles.User
      )
    );
  }, [user]);

  if (loading || isLoading) {
    return { navItems: [], loading: true, error: null };
  }

  if (!user && !loading) {
    return { navItems: [], loading: false, error: new Error("User not found") };
  }

  return {
    navItems: filteredNavItems,
    loading: false,
    error: null,
  };
}
