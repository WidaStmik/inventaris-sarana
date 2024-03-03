"use client";

import { NAV_ITEMS } from "@/app/constants/navbar";
import Link from "next/link";
import React from "react";

import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function MobileNavbar() {
  const pathname = usePathname();

  return (
    <div className="px-16 fixed z-[10] bottom-0 w-screen h-16 border bg-gray-50 flex items-center justify-around lg:hidden">
      {NAV_ITEMS.map((item) => (
        <Link
          href={item.href}
          key={item.text}
          className="flex items-center justify-center h-full"
        >
          <item.Icon
            className={clsx(
              "text-4xl",
              pathname === item.href ? "text-blue-700" : "text-gray-500"
            )}
          />
        </Link>
      ))}
    </div>
  );
}
