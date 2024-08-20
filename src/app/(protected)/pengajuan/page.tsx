"use client";
import { Kategori, Pengajuan, Ruangan, Sarana } from "@/types/ruangan";
import React, { useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Button, Input } from "react-daisyui";
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
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const pengajuanWithData = useMemo(() => {
    return data?.map((pengajuan) => {
      const ruangan = ruanganData?.find((r) => r.id === pengajuan.ruanganId);
      const sarana = saranaData?.find((k) => k.id === pengajuan.saranaId);
      return {
        ...pengajuan,
        ruangan: ruangan?.name ?? pengajuan.ruanganId,
        sarana: sarana?.name ?? pengajuan.saranaId,
        name: user?.displayName ?? user?.email ?? user?.uid ?? "",
        email: user?.email ?? user?.uid ?? "",
      };
    });
  }, [data, ruanganData, saranaData]);

  const columns: TableColumn<(typeof pengajuanWithData)[number]>[] = [
    {
      name: "#",
      selector: (_, index) => Number(index) + 1,
      width: "50px",
    },
    {
      name: "Ruangan",
      selector: (row) => row.ruangan,
    },
    {
      name: "Nama Barang",
      selector: (row) => row.sarana,
    },
    {
      name: "Banyaknya",
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
            className={`px-1 py-1 rounded-full ${
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
      name: "Nama Pengaju",
      cell(row) {
        return <span className="text-wrap">{row.name}</span>;
      },
      width: "150px",
    },
    {
      name: "Alasan Pengajuan",
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

  const filteredData = useMemo(() => {
    if (!searchQuery) return pengajuanWithData;
    return pengajuanWithData?.filter(
      (d) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.ruangan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.sarana.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [pengajuanWithData, searchQuery]);

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
        <div className="flex justify-end mb-2">
          <Input
            placeholder="Filter berdasarkan nama barang, ruangan, atau pengaju"
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-96 placeholder:text-xs"
            size="sm"
          />
        </div>
        <DataTable
          columns={columns}
          data={filteredData ?? []}
          progressPending={loading}
        />
      </div>
    </div>
  );
}
