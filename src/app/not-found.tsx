import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-svh flex-col">
      <h1 className="text-4xl font-bold">Halaman tidak ditemukan</h1>
      <Link href="/" className="btn btn-primary mt-4">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
