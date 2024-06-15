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
import { PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import ExcelJs from "exceljs";

import _ from "lodash";
import { getBucketPath, getBufferFromPath } from "@/app/helpers";

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

  const handlePrint = async () => {
    const workbook = new ExcelJs.Workbook();
    const worksheet = workbook.addWorksheet("Ruangan");

    const kopSuratRes = await fetch("/kop-surat.png");
    const kopSurat = await kopSuratRes.blob();

    const kopImg = workbook.addImage({
      buffer: await kopSurat.arrayBuffer(),
      extension: "png",
    });

    worksheet.getRow(1).height = 125;
    worksheet.addImage(kopImg, "A1:C1");

    worksheet.columns = [{ width: 30 }, { width: 50 }, { width: 30 }];
    worksheet.mergeCells("A2:C2");
    worksheet.getCell("A2").value = "Detail Ruangan";
    worksheet.getCell("A2").alignment = { horizontal: "center" };
    worksheet.getCell("A2").font = { bold: true };

    worksheet.addRow(["Nama Ruangan", data.name]);
    worksheet.addRow(["Kode Ruangan", data.code]);
    worksheet.addRow(["Kategori Ruangan", data.category]);
    worksheet.addRow(["Jumlah Sarana", data.saranaCount?.total]);

    worksheet.addRow([]);
    worksheet.mergeCells("A8:C8");
    worksheet.getCell("A8").value = "Sarana";
    worksheet.getCell("A8").alignment = { horizontal: "center" };
    worksheet.getCell("A8").font = { bold: true };

    worksheet.addRow(["SKU", "Nama Sarana", "Jumlah"]);
    saranaRuangan?.forEach((s, i) => {
      worksheet.addRow([s.sku, s.name, s.quantity]);
    });

    // add images
    worksheet.addRow([]);
    worksheet.addRow([]);

    let currentRow = worksheet.rowCount;
    worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
    worksheet.getCell(`A${currentRow}`).value = "Gambar Ruangan";
    worksheet.getCell(`A${currentRow}`).alignment = { horizontal: "center" };
    worksheet.getCell(`A${currentRow}`).font = { bold: true };

    currentRow++;

    const imagePaths = data.images?.map((img) => getBucketPath(img.url)) ?? [];
    const images = await Promise.all(
      imagePaths.map(async (path) => getBufferFromPath(path))
    );

    for (const image of images) {
      const img = workbook.addImage({
        buffer: image,
        extension: "png",
      });

      const row = worksheet.getRow(currentRow);
      worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
      row.height = 400;

      worksheet.addImage(img, `A${currentRow}:C${currentRow}`);
      currentRow++;
    }

    // set all font size to 12
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.font = { ...cell.font, size: 12 };
      });
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.name}.xlsx`;
      a.click();
    });
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
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

        <Button
          endIcon={<PiMicrosoftExcelLogoDuotone size={25} />}
          color="primary"
          onClick={handlePrint}
          className="w-full xl:w-auto"
        >
          Download
        </Button>
      </div>

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
                <span className="text-success">
                  {data.saranaCount?.good ?? 0}
                </span>
                <span>+</span>
                <span className="text-error">
                  {data.saranaCount?.broken ?? 0}
                </span>
                <span>=</span>
                <span className="text-primary">
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
                    <div className="absolute bottom-0 left-0 right-0 bg-base-300 p-2 flex items-center justify-between">
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

                        <div className="absolute bottom-0 left-0 right-0 bg-base-300 p-2 flex items-center justify-between">
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
