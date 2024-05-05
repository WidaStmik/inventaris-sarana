"use client";
import Confirmation from "@/components/common/confirmation";
import Loading from "@/components/common/loading";
import { db } from "@/services/firebase";
import {
  useDeleteKategoriMutation,
  useUpdateKategoriMutation,
} from "@/services/ruangan";
import { PageProps } from "@/types/common";
import { Kategori } from "@/types/ruangan";
import { doc } from "firebase/firestore";
import React, { ReactPropTypes, useEffect, useMemo, useState } from "react";
import { Button, Input, Select } from "react-daisyui";
import { useDocument, useDocumentData } from "react-firebase-hooks/firestore";
import toast from "react-hot-toast";

export default function TambahKategori(props: PageProps) {
  const [snapshot, loading, error] = useDocument(
    doc(db, "kategori", props.params.id)
  );

  const data = useMemo(
    () => ({ ...snapshot?.data(), id: snapshot?.id } as Kategori),
    [snapshot]
  );

  const [state, setState] = useState<Kategori>(data);
  const [updateKategori, { isLoading }] = useUpdateKategoriMutation();
  const [deleteKategori, { isLoading: isDeleting }] =
    useDeleteKategoriMutation();

  useEffect(() => {
    if (!data) return;
    setState(data);
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toast.promise(updateKategori(state), {
      loading: "Mengupdate kategori...",
      success: (res) => {
        setState(data);

        return `Kategori ${state.name} berhasil update!`;
      },
      error: (error) => {
        return `Gagal menambahkan kategori: ${error.message}`;
      },
    });
  };

  if (loading) return <Loading />;

  return (
    <main>
      <h1 className="text-3xl font-semibold">Edit Kategori</h1>
      <form className="flex flex-col" onSubmit={onSubmit}>
        <div className="flex flex-col">
          <label htmlFor="name">Nama Kategori</label>
          <Input
            placeholder="Masukkan nama kategori"
            name="name"
            value={state.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="code">Deskripsi</label>
          <Input
            placeholder="Masukkan deskripsi kategori"
            name="description"
            value={state.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="kind">Kategori untuk</label>
          <Select
            name="kind"
            value={state.kind}
            onChange={handleChange}
            className="input"
          >
            <option value="ruangan">Ruangan</option>
            <option value="sarana">Sarana</option>
          </Select>
        </div>

        <div className="flex gap-2 items-center mt-4">
          <Button className="flex-1" color="primary" loading={isLoading}>
            Simpan
          </Button>

          <Confirmation
            onConfirm={deleteKategori}
            text="Apakah anda yakin ingin menghapus kategori ini?"
            className="flex-1"
          >
            <Button className="w-full" type="button" color="error">
              Hapus
            </Button>
          </Confirmation>
        </div>
      </form>
    </main>
  );
}
