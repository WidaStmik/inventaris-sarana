"use client";

import { db } from "@/services/firebase";
import { collection, collectionGroup } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import { Card as RDCard } from "react-daisyui";
import { useMemo } from "react";

export default function Home() {
  const [sarana] = useCollection(collectionGroup(db, "saranaRuangan"));
  const [ruangan] = useCollection(collection(db, "ruangan"));
  const [kategori] = useCollection(collection(db, "kategori"));

  const totalSarana = useMemo(
    () =>
      sarana?.docs.reduce(
        (acc, s) =>
          s.data().condition === "good" ? acc + Number(s.data().quantity) : acc,
        0
      ),
    [sarana]
  );

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card title="Total Sarana" count={totalSarana ?? 0} />
      <Card title="Total Ruangan" count={ruangan?.size ?? 0} />
      <Card title="Total Kategori" count={kategori?.size ?? 0} />
    </div>
  );
}

interface CardProps {
  title: string;
  count: number;
}

function Card({ title, count }: CardProps) {
  return (
    <RDCard className="p-4 shadow-md">
      <h1 className="text-xl font-semibold">{title}</h1>
      <p>{count}</p>
    </RDCard>
  );
}
