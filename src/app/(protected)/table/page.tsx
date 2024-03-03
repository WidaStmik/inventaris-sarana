"use client";
import { db } from "@/services/firebase";
import { Room } from "@/types/rooms";
import { collection } from "firebase/firestore";
import React from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import DataTable, { TableColumn } from "react-data-table-component";

const dummyRooms: Room[] = Array.from({ length: 30 }).map((_, i) => {
  return {
    id: Math.random().toString(36),
    name: `Room ${i}`,
    code: `RM-${i}`,
    category: "Room 1",
    propertyCount: {
      total: Math.floor(Math.random() * 100),
      good: Math.floor(Math.random() * 100),
      broken: Math.floor(Math.random() * 100),
    },
  };
});

const columns: TableColumn<Room>[] = [
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
            Bagus: {row.propertyCount.good}
          </span>
          <span className="text-red-500">
            Rusak: {row.propertyCount.broken}
          </span>
          <span className="text-blue-500">
            Jumlah: {row.propertyCount.total}
          </span>
        </div>
      );
    },
  },
];

export default function TablePage() {
  //   const [snapshot, loading, error] = useCollection(collection(db, "rooms"));

  return (
    <div>
      <h1 className="text-3xl font-semibold">Daftar Ruangan</h1>
      <div className="mt-4">
        <DataTable columns={columns} data={dummyRooms} />
      </div>
    </div>
  );
}
