"use client";
import { db } from "@/services/firebase";
import { Sarana } from "@/types/ruangan";
import { collection } from "firebase/firestore";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { Button, Input } from "react-daisyui";
import DataTable, { TableColumn } from "react-data-table-component";
import { useCollection } from "react-firebase-hooks/firestore";
import { FaPlus } from "react-icons/fa";

const columns: TableColumn<Sarana>[] = [
  {
    name: "#",
    selector: (_, index) => Number(index) + 1,
    width: "50px",
  },
  {
    name: "Nama Sarana",
    selector: (row) => row.name,
  },
  {
    name: "SKU",
    selector: (row) => row.sku ?? "-",
    width: "150px",
  },
  {
    name: "Kategori",
    selector: (row) => row.category,
  },
  {
    name: "Aksi",
    width: "400px",
    cell(row, rowIndex, column, id) {
      return (
        <div className="flex items-center gap-2">
          <Link href={`/sarana/${row.id}/edit`}>
            <Button size="sm" color="warning">
              Edit Sarana
            </Button>
          </Link>
        </div>
      );
    },
  },
];

export default function DaftarSarana() {
  const [snapshot, loading, error] = useCollection(collection(db, "sarana"));
  const data = snapshot?.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as Sarana[];
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    return data?.filter((d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-semibold">Daftar Sarana</h1>
        <Link href="/sarana/tambah">
          <Button color="primary" startIcon={<FaPlus />}>
            Tambah Sarana
          </Button>
        </Link>
      </div>
      <div className="mt-4">
        <div className="flex justify-end mb-2">
          <Input
            placeholder="Filter berdasarkan nama barang, ruangan, atau pengaju"
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-96 placeholder:text-xs"
            size="sm"
          />
        </div>
        <DataTable
          progressPending={loading}
          columns={columns}
          data={filteredData ?? []}
        />
      </div>
    </div>
  );
}
