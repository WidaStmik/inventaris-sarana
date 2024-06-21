"use client";
import { auth, db } from "@/services/firebase";
import { useAddPengajuanMutation } from "@/services/ruangan";
import { Kategori, Pengajuan, Ruangan, Sarana } from "@/types/ruangan";
import { collection, Timestamp } from "firebase/firestore";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button, Input, Select, Textarea } from "react-daisyui";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import toast from "react-hot-toast";

const initial: Omit<Pengajuan, "id"> = {
  ruanganId: "",
  saranaId: "",
  quantity: 1,
  status: "pending",
  createdAt: Timestamp.now(),
  userId: "",
  message: "",
};

export default function BuatPengajuan() {
  const [state, setState] = useState<Omit<Pengajuan, "id">>(initial);
  const [addPenganjuan, { isLoading }] = useAddPengajuanMutation();
  const router = useRouter();
  const [user] = useAuthState(auth);

  const [ruanganSnapshot] = useCollection(collection(db, "ruangan"));
  const ruanganData = ruanganSnapshot?.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as Ruangan[];

  const [saranaSnapshot] = useCollection(collection(db, "sarana"));
  const saranaData = saranaSnapshot?.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as Sarana[];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toast.promise(
      addPenganjuan({
        ...state,
        userId: user?.uid ?? "",
        createdAt: Timestamp.now(),
      }).unwrap(),
      {
        loading: "Memproses pengajuan...",
        success: (data) => {
          setState(initial);

          router.push("/pengajuan");
          return `Permintan pengajuan berhasil dikirimkan!, mengalihkan...`;
        },
        error: (error) => {
          return `Gagal mengirimkan pengajuan: ${error.message}`;
        },
      }
    );
  };

  return (
    <main>
      <h1 className="text-3xl font-semibold">Buat Pengajuan</h1>
      <form className="flex flex-col" onSubmit={onSubmit}>
        <div className="flex flex-col">
          <label htmlFor="ruanganId">Nama Kategori</label>
          <Select
            name="ruanganId"
            value={state.ruanganId}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Pilih Ruangan
            </option>
            {ruanganData?.map((ruangan) => (
              <option key={ruangan.id} value={ruangan.id}>
                {ruangan.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="saranId">Nama Barang</label>
          <Select
            name="saranaId"
            value={state.saranaId}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Pilih Sarana
            </option>
            {saranaData?.map((sarana) => (
              <option key={sarana.id} value={sarana.id}>
                {sarana.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="quantity">Banyaknya</label>
          <Input
            type="number"
            name="quantity"
            value={state.quantity}
            onChange={handleChange}
            required
            min={1}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="message">Alasan Pengajuan</label>
          <Textarea
            name="message"
            value={state.message}
            onChange={handleChange}
            required
          />
        </div>

        <Button className="mt-4" color="primary" loading={isLoading}>
          Buat Pengajuan
        </Button>
      </form>
    </main>
  );
}
