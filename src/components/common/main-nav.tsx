import { auth } from "@/services/firebase";
import React from "react";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";

export default function MainNav() {
  const [user] = useAuthState(auth);
  const [signOut] = useSignOut(auth);

  // @ts-expect-error not typed
  const claims = JSON.parse(user?.reloadUserInfo?.customAttributes ?? "{}");

  return (
    <div className="border-b w-full fixed top-0 right-0 flex items-center justify-end z-[4] h-12 px-4">
      <span>
        {user?.displayName ?? user?.email ?? "User"} (
        {claims.role === "admin" ? "Admin" : "User"}
        ),{" "}
        <button className="un underline font-semibold" onClick={signOut}>
          Keluar
        </button>
      </span>
    </div>
  );
}
