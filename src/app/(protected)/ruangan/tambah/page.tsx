"use client";
import { db } from "@/services/firebase";
import { useAddRuanganMutation } from "@/services/ruangan";
import { Kategori, Ruangan } from "@/types/ruangan";
import { collection } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button, Input, Select } from "react-daisyui";
import { useCollection } from "react-firebase-hooks/firestore";
import toast from "react-hot-toast";

const initial: Omit<Ruangan, "id"> = {
  name: "",
  code: "",
  category: "",
  saranaCount: {
    total: 0,
    broken: 0,
    good: 0,
  },
  area: "",
};

export default function TambahRuangan() {
  const [state, setState] = useState<Omit<Ruangan, "id">>(initial);
  const [addRuangan, { isLoading }] = useAddRuanganMutation();
  const [snapshot, loading, error] = useCollection(collection(db, "kategori"));
  const kategori = snapshot?.docs
    .filter((doc) => doc.data().kind === "ruangan")
    .map((doc) => doc.data()) as Kategori[];

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
    toast.promise(addRuangan(state), {
      loading: "Menambahkan ruangan...",
      success: (data) => {
        setState(initial);

        router.push("/ruangan");
        return `Ruangan ${state.name} berhasil ditambahkan! mengalihkan...`;
      },
      error: (error) => {
        return `Gagal menambahkan ruangan: ${error.message}`;
      },
    });
  };

  return (
    <main>
      <h1 className="text-3xl font-semibold">Tambah Ruangan</h1>
      <form className="flex flex-col" onSubmit={onSubmit}>
        <div className="flex flex-col">
          <label htmlFor="name">Nama Ruangan</label>
          <Input
            placeholder="Masukkan nama ruangan"
            name="name"
            value={state.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="code">Kode Ruangan</label>
          <Input
            placeholder="Masukkan kode ruangan"
            name="code"
            value={state.code}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="category">Kategori Ruangan</label>
          <div className="flex gap-2">
            <Select
              name="category"
              value={state.category}
              onChange={handleChange}
              required
              className="w-full"
            >
              {kategori?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>

            <Link className="btn btn-primary" href="/kategori/tambah">
              Tambah Kategori
            </Link>
          </div>
        </div>

        <Button className="mt-4" color="primary" loading={isLoading}>
          Tambah Ruangan
        </Button>
      </form>
    </main>
  );
}
