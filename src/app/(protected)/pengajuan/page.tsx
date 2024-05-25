"use client";
import { Kategori, Pengajuan, Ruangan, Sarana } from "@/types/ruangan";
import React from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Button } from "react-daisyui";
import { FaPlus } from "react-icons/fa";
import { collection, query, where } from "firebase/firestore";
import { auth, db } from "@/services/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { startCase } from "lodash";
import { PiXCircleDuotone } from "react-icons/pi";
import { useCancelPengajuanMutation } from "@/services/ruangan";
import Confirmation from "@/components/common/confirmation";
import toast from "react-hot-toast";

export default function PengajuanPage() {
  const [cancelPengajuan, { isLoading }] = useCancelPengajuanMutation();
  const [user] = useAuthState(auth);
  const [snapshot, loading, error] = useCollection(
    query(collection(db, "pengajuan"), where("userId", "==", user?.uid))
  );

  const data = snapshot?.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as Pengajuan[];

  const [ruanganSnapshot] = useCollection(collection(db, "ruangan"));
  const ruanganData = ruanganSnapshot?.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as Ruangan[] | undefined;

  const [saranaSnapshot] = useCollection(collection(db, "sarana"));
  const saranaData = saranaSnapshot?.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as Sarana[] | undefined;

  const handleDelete = async (id: string) => {
    toast.promise(cancelPengajuan(id).unwrap(), {
      loading: "Membatalkan pengajuan...",
      success: "Pengajuan berhasil dibatalkan!",
      error: "Gagal membatalkan pengajuan",
    });
  };

  const columns: TableColumn<Pengajuan>[] = [
    {
      name: "#",
      selector: (_, index) => Number(index) + 1,
      width: "50px",
    },
    {
      name: "Ruangan",
      cell(row) {
        const ruangan = ruanganData?.find((r) => r.id === row.ruanganId);
        return ruangan?.name;
      },
    },
    {
      name: "Sarana",
      cell(row) {
        const kategori = saranaData?.find((k) => k.id === row.saranaId);
        return kategori?.name;
      },
    },
    {
      name: "Jumlah",
      selector: (row) => row.quantity,
    },
    {
      name: "Tanggal",
      selector: (row) => row.createdAt.toDate().toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Status",
      sortable: true,
      sortFunction: (a, b) => a.status.localeCompare(b.status),
      cell(row) {
        return (
          <span
            className={`px-2 py-1 rounded-full ${
              row.status === "pending"
                ? "bg-primary text-primary-content"
                : row.status === "approved"
                ? "bg-success text-success-content"
                : "bg-error text-error-content"
            }`}
          >
            {startCase(row.status)}
          </span>
        );
      },
    },
    {
      name: "Pesan",
      cell(row) {
        return <span className="text-wrap">{row.message}</span>;
      },
      width: "200px",
    },
    {
      name: "Aksi",
      width: "200px",
      cell(row, rowIndex, column, id) {
        if (row.status === "pending")
          return (
            <div className="flex items-center gap-2">
              <Confirmation
                onConfirm={() => handleDelete(row.id)}
                text="Apakah anda yakin ingin membatalkan pengajuan ini?"
              >
                <Button size="sm" color="error" endIcon={<PiXCircleDuotone />}>
                  Batalkan
                </Button>
              </Confirmation>
            </div>
          );
      },
    },
  ];
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-semibold">Pengajuan Saya</h1>
        <Link href="/pengajuan/tambah">
          <Button color="primary" startIcon={<FaPlus />}>
            Buat Pengajuan
          </Button>
        </Link>
      </div>
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={data ?? []}
          progressPending={loading}
        />
      </div>
    </div>
  );
}
