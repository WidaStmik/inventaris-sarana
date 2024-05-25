import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ClientProvider from "./client";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Inventaris Sarana - SMK Pasundan 2 Bandung",
  description: "Aplikasi inventaris sarana SMK Pasundan 2 Bandung",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClientProvider>
        <body className={clsx(inter.className, "overflow-y-hidden")}>
          <Toaster />
          {children}
        </body>
      </ClientProvider>
    </html>
  );
}
