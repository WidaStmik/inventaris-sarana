"use client";
import { db } from "@/services/firebase";
import { PageProps } from "@/types/common";
import { Ruangan } from "@/types/ruangan";
import { doc } from "firebase/firestore";
import React, { useMemo } from "react";
import { Loading } from "react-daisyui";
import { useDocument } from "react-firebase-hooks/firestore";

export default function EditRuangan(props: PageProps) {
  const [snapshot, loading, error] = useDocument(
    doc(db, "ruangan", props.params.id)
  );

  const data = useMemo(
    () => ({ ...snapshot?.data(), id: snapshot?.id } as Ruangan),
    [snapshot]
  );

  if (loading) return <Loading />;
  return (
    <div>
      <h1 className="text-3xl font-semibold">
        Edit Ruangan <span className="text-primary">{data.name}</span>
      </h1>
    </div>
  );
}
