"use client";
import React from "react";
import { auth } from "@/services/firebase";
import { ComponentProps } from "@/types/common";
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from "@/components/common/loading";

import { redirect } from "next/navigation";

export default function AuthLayout({ children }: ComponentProps) {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <Loading className="flex items-center justify-center h-screen w-screen" />
    );
  }

  if (user && !loading) {
    return redirect("/");
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <h1 className="text-red-500 text-center text-2xl">{error.message}</h1>
      </div>
    );
  }

  return <div>{children}</div>;
}
