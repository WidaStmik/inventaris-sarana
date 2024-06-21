"use client";
import { Ruangan, Sarana, SaranaRuangan } from "@/types/ruangan";
import React, { useMemo } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Button } from "react-daisyui";
import { FaPlus } from "react-icons/fa";
import { collection, collectionGroup } from "firebase/firestore";
import { db } from "@/services/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import Link from "next/link";
import { useGetUserQuery } from "@/services/user";
import useToken from "@/app/hooks/use-token";
import { Roles } from "@/app/constants";
import { claims } from "@/paths";
import _ from "lodash";

type SaranaData = Sarana & SaranaRuangan;

export default function DaftarRuangan() {
  const [snapshot, loading, error] = useCollection(collection(db, "ruangan"));
  const [saranaSnap] = useCollection(collectionGroup(db, "saranaRuangan"));

  const [saranaSnapshot] = useCollection(collection(db, "sarana"));
  const sarana = useMemo(
    () =>
      saranaSnapshot?.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Sarana[],
    [saranaSnapshot]
  );

  const saranaRuangan = useMemo(() => {
    const ungrouped = saranaSnap?.docs.map((doc) => {
      const saranaData = sarana?.find(
        (s) => s.id === doc.data().saranaId
      ) as Sarana;

      return { ...doc.data(), ...saranaData, id: doc.id } as SaranaData;
    });

    // group by saranaId, condition, and ruanganId
    const grouped = _.groupBy(
      ungrouped,
      (s) => `${s.saranaId}-${s.condition}-${s.ruanganId}`
    );

    return Object.values(grouped).map((s) => ({
      ...s[0],
      quantity: s.reduce((acc, s) => acc + Number(s.quantity), 0),
    })) as SaranaData[];
  }, [saranaSnap]);

  const data = useMemo(
    () =>
      snapshot?.docs.map((doc) => {
        const saranaCount = saranaRuangan
          ?.filter((s) => s.ruanganId === doc.id)
          .reduce(
            (acc, s) => {
              if (s.condition === "good") {
                acc.good += Number(s.quantity);
              } else {
                acc.broken += Number(s.quantity);
              }
              acc.total += Number(s.quantity);
              return acc;
            },
            { good: 0, broken: 0, total: 0 }
          );

        return {
          ...doc.data(),
          id: doc.id,
          saranaCount,
        } as Ruangan;
      }),
    [snapshot, saranaRuangan]
  );

  const { token } = useToken();
  const { data: user } = useGetUserQuery(token!, { skip: !token });

  const columns: TableColumn<Ruangan>[] = [
    {
      name: "#",
      selector: (_, index) => Number(index) + 1,
      width: "50px",
    },
    {
      name: "Nama Ruangan",
      selector: (row) => row.name,
      width: "150px",
    },
    {
      name: "Kode Ruangan",
      selector: (row) => row.code,
      width: "125px",
    },
    {
      name: "Kategori Ruangan",
      selector: (row) => row.category,
    },
    {
      name: "Jumlah Sarana",
      width: "150px",
      cell(row, rowIndex, column, id) {
        return (
          <div className="flex items-center gap-2">
            {row.saranaCount?.good ?? 0}
          </div>
        );
      },
    },
    {
      name: "Ukuran Ruangan",
      selector: (row) => row.area,
      width: "150px",
    },
    {
      name: "Aksi",
      width: "400px",
      cell(row, rowIndex, column, id) {
        return (
          <div className="flex items-center gap-2">
            <Link href={`/ruangan/${row.id}`}>
              <Button size="sm" color="primary">
                Lihat Ruangan
              </Button>
            </Link>

            {claims["/ruangan"].includes(user?.customClaims?.role) && (
              <Link href={`/ruangan/${row.id}/edit`}>
                <Button size="sm" color="warning">
                  Edit Ruangan
                </Button>
              </Link>
            )}
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-semibold">Daftar Ruangan</h1>
        {user?.customClaims?.role === Roles.Admin && (
          <Link href="/ruangan/tambah">
            <Button color="primary" startIcon={<FaPlus />}>
              Tambah Ruangan
            </Button>
          </Link>
        )}
      </div>
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
