"use client";
import Loading from "@/components/common/loading";
import { db } from "@/services/firebase";
import { PageProps } from "@/types/common";
import { Ruangan } from "@/types/ruangan";
import clsx from "clsx";
import { doc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";
import { Button, Divider, Tooltip } from "react-daisyui";
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
        <Tooltip message="Edit" position="bottom">
          <Link href={`/ruangan/${data.id}/edit`} className="text-primary">
            <FaEdit />
          </Link>
        </Tooltip>
      </h1>

      <Divider />

      <table className="table w-full">
        <tbody>
          <RuanganInfo label="Nama Ruangan" value={data.name} />
          <RuanganInfo label="Kode Ruangan" value={data.code} />
          <RuanganInfo label="Kategori Ruangan" value={data.category} />
          <RuanganInfo
            label="Jumlah Properti"
            value={
              <div className="flex items-center gap-2">
                <span className="text-green-500">
                  Bagus: {data.propertyCount?.good ?? 0}
                </span>
                <span className="text-red-500">
                  Rusak: {data.propertyCount?.broken ?? 0}
                </span>
                <span className="text-blue-500">
                  Jumlah: {data.propertyCount?.total ?? 0}
                </span>
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
