"use client";
import useNavItems from "@/app/hooks/use-nav-items";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { IoMenuOutline } from "react-icons/io5";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const { navItems } = useNavItems();

  return (
    <div
      className={clsx(
        "hidden lg:flex bg-base-100 h-screen shadow-lg relative",
        "transition-all duration-300 ease-in-out overflow-hidden",
        "flex-col items-center z-10",
        isOpen ? "w-96" : "w-16"
      )}
    >
      <div
        className={clsx(
          "absolute top-0 right-0 w-16 h-16 bg-base-100 flex items-center justify-center",
          "transition-all duration-300 ease-in-out"
        )}
      >
        <IoMenuOutline
          className="text-4xl cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      <div className={clsx("mt-16", { "mx-3": !isOpen })}>
        <Image
          src="/logo.jpg"
          height={144}
          width={144}
          className="block mx-auto"
          alt="Logo SMK Pasundan 2"
        />
      </div>

      <div
        className={clsx(
          "flex flex-col items-start w-full gap-4 mt-8",
          "transition-all duration-300 ease-in-out",
          isOpen ? "px-8" : "px-0"
        )}
      >
        {navItems?.map((item) => (
          <Link
            href={item.href}
            key={item.text}
            className={clsx(
              "flex items-center",
              "transition-all duration-300 ease-in-out",
              isOpen ? "w-full justify-start" : "w-16 justify-center",
              pathname === item.href ? "text-primary" : "text-gray-500"
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
