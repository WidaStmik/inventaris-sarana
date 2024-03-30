"use client";
import { useAddKategoriMutation } from "@/services/ruangan";
import { Kategori } from "@/types/ruangan";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button, Input } from "react-daisyui";
import toast from "react-hot-toast";

const initial: Omit<Kategori, "id"> = {
  name: "",
  description: "",
};

export default function TambahKategori() {
  const [state, setState] = useState<Omit<Kategori, "id">>(initial);
  const [addKategori, { isLoading }] = useAddKategoriMutation();
  const router = useRouter();

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

    toast.promise(addKategori(state), {
      loading: "Menambahkan kategori...",
      success: (data) => {
        setState(initial);

        router.push("/kategori");
        return `Kategori ${state.name} berhasil ditambahkan!, mengalihkan...`;
      },
      error: (error) => {
        return `Gagal menambahkan kategori: ${error.message}`;
      },
    });
  };

  return (
    <main>
      <h1 className="text-3xl font-semibold">Tambah Kategori</h1>
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

        <Button className="mt-4" color="primary" loading={isLoading}>
          Tambah Kategori
        </Button>
      </form>
    </main>
  );
}
