"use client";
import { Ruangan } from "@/types/ruangan";
import React from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Button, Loading } from "react-daisyui";
import { FaPlus } from "react-icons/fa";
import { collection } from "firebase/firestore";
import { db } from "@/services/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import Link from "next/link";

const columns: TableColumn<Ruangan>[] = [
  {
    name: "#",
    selector: (_, index) => Number(index) + 1,
    width: "50px",
  },
  {
    name: "Nama Ruangan",
    selector: (row) => row.name,
  },
  {
    name: "Kode Ruangan",
    selector: (row) => row.code,
    width: "150px",
  },
  {
    name: "Kategori Ruangan",
    selector: (row) => row.category,
  },
  {
    name: "Jumlah Properti",
    width: "240px",
    cell(row, rowIndex, column, id) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-green-500">
            Bagus: {row.propertyCount?.good ?? 0}
          </span>
          <span className="text-red-500">
            Rusak: {row.propertyCount?.broken ?? 0}
          </span>
          <span className="text-blue-500">
            Jumlah: {row.propertyCount?.total ?? 0}
          </span>
        </div>
      );
    },
  },
  {
    name: "Aksi",
    width: "200px",
    cell(row, rowIndex, column, id) {
      return (
        <div className="flex items-center gap-2">
          <Link href={`/ruangan/${row.id}`}>
            <Button size="sm" color="primary">
              Lihat Ruangan
            </Button>
          </Link>
        </div>
      );
    },
  },
];

export default function DaftarRuangan() {
  const [snapshot, loading, error] = useCollection(collection(db, "ruangan"));
  const data = snapshot?.docs.map((doc) => doc.data()) as Ruangan[];

  return (
    <div>
      <h1 className="text-3xl font-semibold">Daftar Ruangan</h1>
      <Link href="/ruangan/tambah">
        <Button color="primary" startIcon={<FaPlus />}>
          Tambah Ruangan
        </Button>
      </Link>
      <div className="mt-4">
        <DataTable
          progressPending={loading}
          columns={columns}
          data={data ?? []}
        />
      </div>
    </div>
  );
}
