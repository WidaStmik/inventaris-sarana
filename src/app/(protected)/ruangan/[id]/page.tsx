"use client";
import useUser from "@/app/hooks/use-user";
import Loading from "@/components/common/loading";
import { claims } from "@/paths";
import { db } from "@/services/firebase";
import { PageProps } from "@/types/common";
import { Ruangan, Sarana, SaranaRuangan } from "@/types/ruangan";
import clsx from "clsx";
import { collection, doc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";
import { Button, Divider, Tooltip } from "react-daisyui";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { FaEdit } from "react-icons/fa";

import _ from "lodash";

type SaranaData = SaranaRuangan & Sarana;

export default function RuanganPage(props: PageProps) {
  const [snapshot, loading] = useDocument(doc(db, "ruangan", props.params.id));

  const [saranaSnap] = useCollection(
    collection(db, "ruangan", props.params.id, "saranaRuangan")
  );

  const [saranaSnapshot] = useCollection(collection(db, "sarana"));
  const sarana = useMemo(
    () =>
      saranaSnapshot?.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Sarana[],
    [saranaSnapshot]
  );

  const { user } = useUser();

  const saranaRuangan = useMemo(() => {
    const ungrouped = saranaSnap?.docs.map((doc) => {
      const saranaData = sarana?.find(
        (s) => s.id === doc.data().saranaId
      ) as Sarana;

      return { ...doc.data(), ...saranaData, id: doc.id } as SaranaData;
    });

    // group by saranaId and condition
    const grouped = _.groupBy(ungrouped, (s) => `${s.saranaId}-${s.condition}`);

    return Object.values(grouped).map((s) => ({
      ...s[0],
      quantity: s.reduce((acc, s) => acc + s.quantity, 0),
    })) as SaranaData[];
  }, [saranaSnap]);

  const data = useMemo(
    () =>
      ({
        ...snapshot?.data(),
        id: snapshot?.id,
        saranaCount: {
          total: saranaRuangan?.reduce((acc, s) => acc + s.quantity, 0),
          broken: saranaRuangan?.reduce(
            (acc, s) => (s.condition === "broken" ? acc + s.quantity : acc),
            0
          ),
          good: saranaRuangan?.reduce(
            (acc, s) => (s.condition === "good" ? acc + s.quantity : acc),
            0
          ),
        },
      } as Ruangan),
    [snapshot, saranaRuangan]
  );

  const mainImage = useMemo(
    () => data.images?.find((img) => img.isHome),
    [data.images]
  );

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="text-3xl flex items-center gap-2">
        <span>
          Ruangan <span className="font-semibold">{data.name}</span>
        </span>
        {claims["/ruangan/[id]"].includes(user?.customClaims?.role) && (
          <Tooltip message="Edit" position="bottom">
            <Link href={`/ruangan/${data.id}/edit`} className="text-primary">
              <FaEdit />
            </Link>
          </Tooltip>
        )}
      </h1>

      <Divider />

      <table className="table w-full">
        <tbody>
          <RuanganInfo label="Nama Ruangan" value={data.name} />
          <RuanganInfo label="Kode Ruangan" value={data.code} />
          <RuanganInfo label="Kategori Ruangan" value={data.category} />
          <RuanganInfo
            label="Jumlah Sarana"
            unSpan
            value={
              <div className="flex items-center gap-2">
                <span className="text-green-500">
                  {data.saranaCount?.good ?? 0}
                </span>
                <span>+</span>
                <span className="text-red-500">
                  {data.saranaCount?.broken ?? 0}
                </span>
                <span>=</span>
                <span className="text-blue-500">
                  {data.saranaCount?.total ?? 0}
                </span>
              </div>
            }
          />
          <RuanganInfo
            label="Sarana"
            unSpan
            value={
              <div className="flex flex-col gap-2">
                {saranaRuangan?.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span
                      className={clsx("text-sm badge", {
                        "badge-success": s.condition === "good",
                        "badge-error": s.condition === "broken",
                      })}
                    >
                      {s.condition === "good" ? "Bagus" : "Rusak"}
                    </span>
                    <span>
                      {s.quantity}x {s.name}
                    </span>
                  </div>
                ))}
              </div>
            }
          />
          <RuanganInfo
            label="Gambar Ruangan"
            unSpan
            value={
              <div>
                {mainImage && (
                  <div className="relative border">
                    <Image
                      src={mainImage.url}
                      width={400}
                      height={400}
                      className="w-full object-contain"
                      alt="Ruangan"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gray-200 p-2 flex items-center justify-between">
                      <span>{mainImage.name}</span>

                      <span className="text- text-primary">Gambar Utama</span>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
                  {data.images
                    ?.filter((img) => !img.isHome)
                    .map((img, i) => (
                      <div key={i} className="relative border">
                        <Image
                          src={img.url}
                          width={400}
                          height={400}
                          className={clsx("object-contain", {
                            "w-full h-full": img.isHome,
                            "w-96": !img.isHome,
                          })}
                          alt="Ruangan"
                        />

                        <div className="absolute bottom-0 left-0 right-0 bg-gray-200 p-2 flex items-center justify-between">
                          <span>{img.name}</span>

                          {img.isHome && (
                            <span className="text- text-primary">
                              Gambar Utama
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            }
          />
        </tbody>
      </table>
    </div>
  );
}

interface RuanganInfoProps {
  value: React.ReactNode;
  label: string;
  unSpan?: boolean;
}

function RuanganInfo({ value, label, unSpan }: RuanganInfoProps) {
  return (
    <tr
      className={clsx("flex w-full flex-row", {
        "flex-col lg:flex-row": unSpan,
      })}
    >
      <td
        className={clsx("font-semibold align-top", {
          "lg:w-1/3": unSpan,
          "w-1/3": !unSpan,
        })}
      >
        {label}
      </td>
      <td
        className={clsx("text-gray-600", {
          "lg:w-2/3": unSpan,
          "w-2/3": !unSpan,
        })}
      >
        {value}
      </td>
    </tr>
  );
}
