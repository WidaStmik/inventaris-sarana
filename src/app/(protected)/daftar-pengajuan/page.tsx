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
      width: "90px",
    },
    {
      name: "Nama Barang",
      cell(row) {
        const kategori = saranaData?.find((k) => k.id === row.saranaId);
        return kategori?.name;
      },
      width: "110px",
    },
    {
      name: "Banyaknya",
      selector: (row) => row.quantity,
      width: "95px",
    },
    {
      name: "Email Pengaju",
      cell(row) {
        const user = users?.find((u) => u.uid === row.userId);
        return user?.displayName ?? user?.email ?? user?.uid;
      },
      width: "140px",
    },
    {
      name: "Nama Pengaju",
      cell(row) {
        return <span className="text-wrap">{row.name}</span>;
      },
      width: "115srcapp(protected)kategoripage.tsxpx",
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
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-semibold">Daftar Pengajuan</h1>
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
