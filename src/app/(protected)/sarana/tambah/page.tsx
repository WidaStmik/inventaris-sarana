"use client";
import { db } from "@/services/firebase";
import { useAddSaranaMutation } from "@/services/ruangan";
import { Kategori, Sarana } from "@/types/ruangan";
import { collection, Timestamp } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { Button, Input, Select } from "react-daisyui";
import { useCollection } from "react-firebase-hooks/firestore";
import toast from "react-hot-toast";

const initial: Omit<Sarana, "id"> = {
  name: "",
  category: "",
  timestamp: Timestamp.now(),
};

export default function TambahSarana() {
  const [state, setState] = useState<Omit<Sarana, "id">>(initial);
  const [addSarana, { isLoading }] = useAddSaranaMutation();
  const [snapshot, loading, error] = useCollection(collection(db, "kategori"));
  const kategori = useMemo(
    () =>
      snapshot?.docs
        .filter((doc) => doc.data().kind === "sarana")
        .map((doc) => doc.data()) as Kategori[],
    [snapshot]
  );

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "timestamp") {
      const [year, month] = value.split("-");
      const date = new Date(Number(year), Number(month) - 1); // Month is 0-indexed
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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.promise(addSarana(state), {
      loading: "Menambahkan sarana...",
      success: (data) => {
        setState(initial);

        router.push("/sarana");
        return `Sarana ${state.name} berhasil ditambahkan! mengalihkan...`;
      },
      error: (error) => {
        return `Gagal menambahkan sarana: ${error.message}`;
      },
    });
  };

  return (
    <main>
      <h1 className="text-3xl font-semibold">Tambah Sarana</h1>
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

        <Button className="mt-4" color="primary" loading={isLoading}>
          Tambah Sarana
        </Button>
      </form>
    </main>
  );
}
