"use client";
import { Kategori, Ruangan } from "@/types/ruangan";
import React from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Button } from "react-daisyui";
import { FaPlus } from "react-icons/fa";
import { collection } from "firebase/firestore";
import { db } from "@/services/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import Link from "next/link";

const columns: TableColumn<Kategori>[] = [
  {
    name: "#",
    selector: (_, index) => Number(index) + 1,
    width: "50px",
  },
  {
    name: "Nama",
    selector: (row) => row.name,
  },
  {
    name: "Deskripsi",
    selector: (row) => row.description,
  },
];

export default function DaftarKategori() {
  const [snapshot, loading, error] = useCollection(collection(db, "kategori"));
  const data = snapshot?.docs.map((doc) => doc.data()) as Kategori[];

  return (
    <div>
      <h1 className="text-3xl font-semibold">Daftar Kategori</h1>
      <Link href="/kategori/tambah">
        <Button color="primary" startIcon={<FaPlus />}>
          Tambah Kategori
        </Button>
      </Link>
      <div className="mt-4">
        <DataTable columns={columns} data={data ?? []} />
      </div>
    </div>
  );
}
