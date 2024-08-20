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
import { PiCheckCircleDuotone, PiXCircleDuotone } from "react-icons/pi";
import {
  useApprovePengajuanMutation,
  useCancelPengajuanMutation,
  useRejectPengajuanMutation,
} from "@/services/ruangan";
import Confirmation from "@/components/common/confirmation";
import toast from "react-hot-toast";
import { useGetUsersQuery } from "@/services/user";

export default function PengajuanPage() {
  const [approvePengajuan] = useApprovePengajuanMutation();
  const [rejectPengajuan] = useRejectPengajuanMutation();

  const [searchQuery, setSearchQuery] = useState<string>("");

  const [user] = useAuthState(auth);

  const [snapshot, loading, error] = useCollection(collection(db, "pengajuan"));

  // @ts-expect-error -- Tidak ada type untuk data user
  const { data: users } = useGetUsersQuery(user?.accessToken ?? "");

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

  const pengajuanWithData = useMemo(() => {
    return data?.map((pengajuan) => {
      const ruangan = ruanganData?.find((r) => r.id === pengajuan.ruanganId);
      const sarana = saranaData?.find((k) => k.id === pengajuan.saranaId);
      const user = users?.find((u) => u.uid === pengajuan.userId);
      return {
        ...pengajuan,
        ruangan: ruangan?.name ?? pengajuan.ruanganId,
        sarana: sarana?.name ?? pengajuan.saranaId,
        name: user?.displayName ?? user?.email ?? user?.uid ?? "",
        email: user?.email ?? user?.uid ?? "",
      };
    });
  }, [data, ruanganData, saranaData, users]);

  const columns: TableColumn<(typeof pengajuanWithData)[number]>[] = [
    {
      name: "#",
      selector: (_, index) => Number(index) + 1,
      width: "50px",
    },
    {
      name: "Ruangan",
      selector: (row) => row.ruangan,
      width: "200px",
    },
    {
      name: "Nama Barang",
      selector: (row) => row.sarana,
      width: "200px",
    },
    {
      name: "Banyaknya",
      selector: (row) => row.quantity,
      width: "95px",
    },
    {
      name: "Email Pengaju",
      selector: (row) => row.email,
      width: "140px",
    },
    {
      name: "Nama Pengaju",
      selector: (row) => row.name,
      width: "140px",
    },
    {
      name: "Alasan Pengajuan",
      cell(row) {
        return <span className="text-wrap">{row.message}</span>;
      },
      width: "150px",
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
      width: "110px",
    },
    {
      name: "Aksi",
      width: "240px",
      cell(row, rowIndex, column, id) {
        if (row.status === "pending")
          return (
            <div className="flex items-center gap-2">
              <Confirmation
                onConfirm={() =>
                  toast.promise(approvePengajuan(row).unwrap(), {
                    loading: "Menyetujui pengajuan...",
                    success: "Pengajuan disetujui",
                    error: "Gagal menyetujui pengajuan",
                  })
                }
                text="Apakah anda yakin ingin menyetujui pengajuan ini?"
              >
                <Button
                  size="sm"
                  color="success"
                  endIcon={<PiCheckCircleDuotone />}
                >
                  Approve
                </Button>
              </Confirmation>

              <Confirmation
                onConfirm={() =>
                  toast.promise(rejectPengajuan(row.id).unwrap(), {
                    loading: "Menolak pengajuan...",
                    success: "Pengajuan ditolak",
                    error: "Gagal menolak pengajuan",
                  })
                }
                text="Apakah anda yakin ingin menolak pengajuan ini?"
              >
                <Button size="sm" color="error" endIcon={<PiXCircleDuotone />}>
                  Reject
                </Button>
              </Confirmation>
            </div>
          );
      },
    },
  ];

  const filteredData = useMemo(() => {
    if (!searchQuery) return pengajuanWithData;
    return pengajuanWithData?.filter((pengajuan) => {
      return (
        pengajuan.ruangan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pengajuan.sarana.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pengajuan.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery, pengajuanWithData]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-semibold">Daftar Pengajuan</h1>
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
