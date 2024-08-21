"use client";
import { db } from "@/services/firebase";
import { Ruangan, Sarana, SaranaRuangan } from "@/types/ruangan";
import { collection, collectionGroup } from "firebase/firestore";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { Button, Input } from "react-daisyui";
import DataTable, { TableColumn } from "react-data-table-component";
import { useCollection } from "react-firebase-hooks/firestore";
import { FaPlus } from "react-icons/fa";
import { PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import ExcelJs from "exceljs";

const columns: TableColumn<Sarana>[] = [
  {
    name: "#",
    selector: (_, index) => Number(index) + 1,
    width: "50px",
  },
  {
    name: "Nama Sarana",
    selector: (row) => row.name,
  },
  {
    name: "SKU",
    selector: (row) => row.sku ?? "-",
    width: "150px",
  },
  {
    name: "Kategori",
    selector: (row) => row.category,
  },
  {
    name: "Bulan Masuk",
    cell(row) {
      return row.timestamp?.toDate().toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
      });
    },
    sortable: true,
    sortFunction: (a, b) =>
      (a.timestamp?.seconds ?? 0) - (b.timestamp?.seconds ?? 0),
  },
  {
    name: "Aksi",
    width: "400px",
    cell(row, rowIndex, column, id) {
      return (
        <div className="flex items-center gap-2">
          <Link href={`/sarana/${row.id}/edit`}>
            <Button size="sm" color="warning">
              Edit Sarana
            </Button>
          </Link>
        </div>
      );
    },
  },
];

export default function DaftarSarana() {
  const [snapshot, loading, error] = useCollection(collection(db, "sarana"));
  const [saranaRuanganSnap] = useCollection(
    collectionGroup(db, "saranaRuangan")
  );
  const [ruanganSnap] = useCollection(collection(db, "ruangan"));

  const ruangan = useMemo(() => {
    if (!ruanganSnap) return [];

    const ruangan: Ruangan[] = [];

    ruanganSnap.docs.forEach((doc) => {
      ruangan.push({
        id: doc.id,
        ...doc.data(),
      } as Ruangan);
    });

    return ruangan;
  }, [ruanganSnap]);

  const saranaRuangan = useMemo(() => {
    if (!saranaRuanganSnap) return [];

    const saranaRuangan: SaranaRuangan[] = [];

    saranaRuanganSnap.docs.forEach((doc) => {
      saranaRuangan.push({
        id: doc.id,
        ...doc.data(),
      } as SaranaRuangan);
    });

    return saranaRuangan;
  }, [saranaRuanganSnap]);

  const data = useMemo(() => {
    if (!snapshot) return [];

    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Sarana[];
  }, [snapshot]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<Sarana[]>([]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    return data?.filter((d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const handleDownload = async () => {
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

    worksheet.addRow([]);

    let currentRow = worksheet.rowCount;
    for (const sarana of selectedRows) {
      worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
      worksheet.getCell(`A${currentRow}`).value = `Nama Sarana: ${sarana.name}`;

      // uppercase the text
      worksheet.getCell(`A${currentRow}`).font = { bold: true };
      worksheet.addRow(["Ruangan", "SKU", "Jumlah"]);

      // seek for the ruangan with the sarana
      const ruanganWithSarana = saranaRuangan?.filter(
        (sr) => sr.saranaId === sarana.id
      );

      for (const rws of ruanganWithSarana) {
        const ruanganData = ruangan.find((r) => r.id === rws.ruanganId);

        if (!ruanganData) {
          console.error(`Ruangan with id ${rws.ruanganId} not found`);
          continue;
        }

        const sku = sarana.sku ?? "-";
        const date = sarana.timestamp?.toDate();

        const formattedDate = date?.toLocaleDateString("id-ID", {
          year: "numeric",
          month: "numeric",
        });

        const skuWithDate = `${sku}/${ruanganData.code}/${formattedDate}`;
        worksheet.addRow([ruanganData?.name, skuWithDate, rws.quantity]);
      }

      // add total row
      const total = ruanganWithSarana?.reduce(
        (acc, rws) => acc + rws.quantity,
        0
      );

      worksheet.addRow(["Total", "", total]);
      // make the total row bold
      worksheet.getRow(worksheet.rowCount).font = { bold: true };

      worksheet.addRow([]);
      worksheet.addRow([]);

      currentRow = worksheet.rowCount;
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
      a.download = `Laporan Sarana ${new Date().toLocaleDateString(
        "id-ID"
      )}.xlsx`;
      a.click();
    });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-semibold">Daftar Sarana</h1>
        <Link href="/sarana/tambah">
          <Button color="primary" startIcon={<FaPlus />}>
            Tambah Sarana
          </Button>
        </Link>
      </div>
      <div className="mt-4">
        <div className="flex justify-end mb-2 gap-2">
          <Input
            placeholder="Filter berdasarkan nama sarana"
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-96 placeholder:text-xs"
            size="sm"
          />
          <Button
            size="sm"
            endIcon={<PiMicrosoftExcelLogoDuotone size={20} />}
            onClick={handleDownload}
          >
            Download
          </Button>
        </div>
        <DataTable
          progressPending={loading}
          columns={columns}
          data={filteredData ?? []}
          selectableRows
          onSelectedRowsChange={(state) => setSelectedRows(state.selectedRows)}
        />
      </div>
    </div>
  );
}
