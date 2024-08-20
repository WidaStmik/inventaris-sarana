"use client";
import Confirmation from "@/components/common/confirmation";
import Loading from "@/components/common/loading";
import { db } from "@/services/firebase";
import {
  useDeleteSaranaMutation,
  useUpdateSaranaMutation,
} from "@/services/ruangan";
import { PageProps } from "@/types/common";
import { Kategori, Sarana } from "@/types/ruangan";
import { collection, doc, Timestamp } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Input, Select } from "react-daisyui";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import toast from "react-hot-toast";

export default function EditSarana(props: PageProps) {
  const [snapshot, loading, error] = useDocument(
    doc(db, "sarana", props.params.id)
  );

  const router = useRouter();

  const [kategoriSnapshot] = useCollection(collection(db, "kategori"));
  const kategori = useMemo(
    () =>
      kategoriSnapshot?.docs
        .filter((doc) => doc.data().kind === "sarana")
        .map((doc) => doc.data()) as Kategori[],
    [kategoriSnapshot]
  );

  const data = useMemo(
    () => ({ ...snapshot?.data(), id: snapshot?.id } as Sarana),
    [snapshot]
  );

  const [state, setState] = useState<Sarana>(data);
  const [updateSarana, { isLoading }] = useUpdateSaranaMutation();
  const [deleteSarana, { isLoading: isDeleting }] = useDeleteSaranaMutation();

  useEffect(() => {
    if (!data) return;
    setState(data);
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "timestamp") {
      setState((prev) => ({
        ...prev,
        timestamp: Timestamp.fromDate(new Date(value)),
      }));
      return;
    }
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onDelete = async () => {
    toast.promise(deleteSarana(data.id), {
      loading: "Menghapus sarana...",
      success: () => {
        router.push("/sarana");
        return `Sarana ${data.name} berhasil dihapus!`;
      },
      error: (error) => {
        return `Gagal menghapus sarana: ${error.message}`;
      },
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toast.promise(updateSarana(state), {
      loading: "Mengupdate sarana...",
      success: (res) => {
        router.push("/sarana");
        return `Sarana ${state.name} berhasil update!`;
      },
      error: (error) => {
        return `Gagal menambahkan sarana: ${error.message}`;
      },
    });
  };

  if (loading) return <Loading />;

  return (
    <main>
      <h1 className="text-3xl font-semibold">Edit Sarana</h1>
      <form className="flex flex-col" onSubmit={onSubmit}>
        <div className="flex flex-col">
          <label htmlFor="name">Nama Sarana</label>
          <Input
            type="text"
            name="name"
            value={state.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="sku">SKU</label>
          <Input
            type="text"
            name="sku"
            value={state.sku}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="timestamp">Bulan Masuk</label>
          <Input
            type="month"
            name="timestamp"
            value={state.timestamp?.toDate().toISOString().slice(0, 7)}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="category">Kategori Sarana</label>
          <div className="flex gap-2">
            <Select
              name="category"
              value={state.category}
              onChange={handleChange}
              required
              className="w-full"
            >
              <option value="">Pilih Kategori</option>
              {kategori?.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </Select>

            <Link className="btn btn-primary" href="/kategori/tambah">
              Tambah Kategori
            </Link>
          </div>
        </div>

        <div className="flex gap-2 items-center mt-4">
          <Button className="flex-1" color="primary" loading={isLoading}>
            Simpan
          </Button>

          <Confirmation
            onConfirm={onDelete}
            text="Apakah anda yakin ingin menghapus kategori ini?"
            className="flex-1"
          >
            <Button
              className="w-full"
              type="button"
              color="error"
              loading={isDeleting}
            >
              Hapus
            </Button>
          </Confirmation>
        </div>
      </form>
    </main>
  );
}
