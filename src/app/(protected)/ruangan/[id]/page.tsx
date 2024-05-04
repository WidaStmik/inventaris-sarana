"use client";
import Loading from "@/components/common/loading";
import { db } from "@/services/firebase";
import { PageProps } from "@/types/common";
import { Ruangan } from "@/types/ruangan";
import { doc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";
import { Button, Tooltip } from "react-daisyui";
import { useDocument } from "react-firebase-hooks/firestore";
import { FaEdit } from "react-icons/fa";

export default function RuanganPage(props: PageProps) {
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
      <h1 className="text-3xl flex items-center gap-2">
        <span>
          Ruangan <span className="font-semibold">{data.name}</span>
        </span>
        <Tooltip message="Edit" position="bottom">
          <Link href={`/ruangan/${data.id}/edit`} className="text-primary">
            <FaEdit />
          </Link>
        </Tooltip>
      </h1>

      <div>asd</div>
    </div>
  );
}
