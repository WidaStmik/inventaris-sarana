"use client";
import { NAV_ITEMS } from "@/app/constants/navbar";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { IoChevronBackCircleSharp } from "react-icons/io5";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={clsx(
        "hidden lg:flex bg-gray-50 h-screen shadow-lg relative",
        "transition-all duration-300 ease-in-out overflow-hidden",
        "flex-col items-center",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div
        className={clsx(
          "absolute top-0 right-0 w-16 h-16 bg-gray-50 flex items-center justify-center",
          "transition-all duration-300 ease-in-out",
          !isOpen ? "rotate-180" : ""
        )}
      >
        <IoChevronBackCircleSharp
          className="text-4xl cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      <div className="mt-16">Logo</div>

      <div
        className={clsx(
          "flex flex-col items-start w-full gap-4 mt-8",
          "transition-all duration-300 ease-in-out",
          isOpen ? "px-8" : "px-0"
        )}
      >
        {NAV_ITEMS.map((item) => (
          <Link
            href={item.href}
            key={item.text}
            className={clsx(
              "flex items-center",
              "transition-all duration-300 ease-in-out",
              isOpen ? "w-full justify-start" : "w-16 justify-center",
              pathname === item.href ? "text-blue-700" : "text-gray-500"
            )}
          >
            <item.Icon className={clsx("text-4xl")} />

            <span className={clsx(isOpen ? "block" : "hidden", "ml-4")}>
              {item.text}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
