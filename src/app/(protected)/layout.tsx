"use client";
import React, { useMemo } from "react";
import { ComponentProps } from "@/types/common";
import Loading from "@/components/common/loading";

import { redirect, useParams, usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/common/navbar";
import MobileNavbar from "@/components/common/mobile-navbar";
import useUser from "../hooks/use-user";
import { claims } from "@/paths";
import { Roles } from "../constants";
import { replaceRoute } from "../helpers";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import MainNav from "@/components/common/main-nav";

export default function AuthLayout({ children }: ComponentProps) {
  const { user, loading, error } = useUser();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  const currentRoute = useMemo(
    () => replaceRoute(pathname, params),
    [pathname, params]
  );

  if (loading) {
    return (
      <Loading className="flex items-center justify-center h-screen w-screen" />
    );
  }

  if (!user && !loading) {
    return redirect("/masuk");
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <h1 className="text-red-500 text-center text-2xl">
          {JSON.stringify(error, null, 2)}
        </h1>
      </div>
    );
  }

  if (
    !claims[currentRoute as keyof typeof claims]?.includes(
      user?.customClaims?.role ?? Roles.User
    )
  ) {
    return redirect("/404");
  }

  return (
    <div className="flex">
      <Navbar />
      <MobileNavbar />
      <MainNav />
      <div className="p-4 xl:p-8 overflow-y-auto max-h-screen w-full mb-16 lg:mb-0 mt-10">
        <div
          className="flex items-center gap-1 mb-4 cursor-pointer"
          onClick={() => router.back()}
        >
          <IoChevronBackCircleSharp className="text-3xl text-primary" />
          <span className="text-2xl">Kembali</span>
        </div>
        {children}
      </div>
    </div>
  );
}
