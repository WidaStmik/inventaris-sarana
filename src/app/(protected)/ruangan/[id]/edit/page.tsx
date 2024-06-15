"use client";
import Confirmation from "@/components/common/confirmation";
import { db } from "@/services/firebase";
import {
  useDeleteRuanganMutation,
  useUpdateRuanganMutation,
  useUploadImagesMutation,
} from "@/services/ruangan";
import { PageProps } from "@/types/common";
import { Kategori, Ruangan, Sarana, SaranaRuangan } from "@/types/ruangan";
import { collection, doc } from "firebase/firestore";
import _ from "lodash";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  FileInput,
  Input,
  Link,
  Loading,
  Select,
  Toggle,
  Tooltip,
} from "react-daisyui";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import toast from "react-hot-toast";
import { FaRegTrashCan } from "react-icons/fa6";

const initial: Ruangan = {
  id: "",
  name: "",
  code: "",
  category: "",
};

type SaranaData = SaranaRuangan & Sarana;

const initialSarana: SaranaRuangan[] = [];

export default function EditRuangan(props: PageProps) {
  const [state, setState] = useState<Omit<Ruangan, "id">>(initial);
  const [images, setImages] = useState<File[]>([]);
  const [saranaRuangan, setSaranaRuangan] =
    useState<SaranaRuangan[]>(initialSarana);

  const [snapshot, loading, error] = useDocument(
    doc(db, "ruangan", props.params.id)
  );

  const [saranaRuanganSnapshot] = useCollection(
    collection(db, "ruangan", props.params.id, "saranaRuangan")
  );

  const [kategoriSnapshot] = useCollection(collection(db, "kategori"));
  const [saranaSnapshot] = useCollection(collection(db, "sarana"));

  const kategori = useMemo(
    () =>
      kategoriSnapshot?.docs
        .filter((doc) => doc.data().kind === "ruangan")
        .map((doc) => doc.data()) as Kategori[],
    [kategoriSnapshot]
  );

  const sarana = useMemo(
    () =>
      saranaSnapshot?.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Sarana[],
    [saranaSnapshot]
  );

  const router = useRouter();

  const [updateRuangan, { isLoading }] = useUpdateRuanganMutation();
  const [uploadImages, { isLoading: isUploading }] = useUploadImagesMutation();
  const [deleteRuangan, { isLoading: isDeleting }] = useDeleteRuanganMutation();

  const data = useMemo(
    () => ({ ...snapshot?.data(), id: snapshot?.id } as Ruangan),
    [snapshot]
  );
  const saranaRuanganData = useMemo(() => {
    const ungrouped = saranaRuanganSnapshot?.docs.map((doc) => {
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
    })) as SaranaRuangan[];
  }, [sarana]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImages(Array.from(files));
    }
  };

  const handleUpload = async () => {
    if (images.length) {
      const res = await uploadImages({
        id: data.id,
        images,
      });
      if ("error" in res) {
        const error = res.error as Error;
        toast.error(`Gagal mengupload gambar: ${error.message}`);
      } else {
        setState((prev) => ({
          ...prev,
          images: res.data?.map((image, i) => ({
            name: images[i].name,
            url: image.url,
          })),
        }));
        setImages([]);
      }
    }
  };

  const handleDelete = async () => {
    toast.promise(deleteRuangan(data.id), {
      loading: "Menghapus ruangan...",
      success: () => {
        router.push("/ruangan");
        return "Ruangan berhasil dihapus, mengalihkan...";
      },
      error: (error) => {
        return `Gagal menghapus ruangan: ${error.message}`;
      },
    });
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toast.promise(
      updateRuangan({ ...state, id: data.id, sarana: saranaRuangan }),
      {
        loading: "Mengupdate ruangan...",
        success: () => {
          router.push("/ruangan");
          return `Ruangan ${data.name} berhasil diupdate!, mengalihkan...`;
        },
        error: (error) => {
          return `Gagal mengupdate ruangan: ${error.message}`;
        },
      }
    );
  };

  const mainImage = useMemo(
    () => state.images?.find((img) => img.isHome),
    [state.images]
  );

  useEffect(() => {
    if (data) {
      setState(data);
    }
  }, [data]);

  useEffect(() => {
    if (saranaRuanganData) {
      setSaranaRuangan(saranaRuanganData);
    }
  }, [saranaRuanganData]);

  if (loading) return <Loading />;
  return (
    <div>
      <h1 className="text-3xl font-semibold">
        Edit Ruangan <span className="text-primary">{data.name}</span>
      </h1>

      <form className="flex flex-col" onSubmit={handleUpdate}>
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

        <div className="flex flex-col">
          <label htmlFor="sarana">Sarana Ruangan</label>

          <div className="grid gap-1">
            {saranaRuangan?.map((item, idx) => (
              <div key={idx} className="flex flex-wrap lg:flex-nowrap gap-2">
                <Select
                  name="sarana"
                  value={item.saranaId}
                  onChange={(e) => {
                    const { value } = e.target;

                    // change use index to update the value
                    setSaranaRuangan((prev) =>
                      prev.map((s, i) =>
                        i === idx ? { ...s, saranaId: value } : s
                      )
                    );
                  }}
                  required
                  className="lg:w-5/6 w-full"
                >
                  <option value="">Pilih Sarana</option>
                  {sarana?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Select>
                <Input
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => {
                    const { value } = e.target;

                    // remove leading zero
                    if (value.startsWith("0")) {
                      e.target.value = value.replace(/^0+/, "");
                    }

                    setSaranaRuangan((prev) =>
                      prev.map((s, i) =>
                        i === idx ? { ...s, quantity: +value } : s
                      )
                    );
                  }}
                  placeholder="Jumlah"
                  required
                  className="lg:w-1/12 w-2/5"
                />

                <Tooltip message="Hapus Sarana">
                  <Button
                    type="button"
                    color="error"
                    onClick={() => {
                      setSaranaRuangan((prev) =>
                        prev.filter((s, i) => i !== idx)
                      );
                    }}
                    className="w-full lg:w-auto"
                  >
                    <FaRegTrashCan />
                  </Button>
                </Tooltip>
              </div>
            ))}
          </div>

          <Button
            type="button"
            color="primary"
            onClick={() => {
              setSaranaRuangan((prev) => [
                ...prev,
                {
                  id: "",
                  ruanganId: data.id,
                  saranaId: "",
                  quantity: 0,
                  condition: "good",
                },
              ]);
            }}
            className="mt-2"
          >
            Tambah Sarana
          </Button>
        </div>

        <div className="flex flex-col">
          <label htmlFor="images">Gambar Ruangan</label>
          <FileInput
            name="images"
            multiple
            onChange={handleImageChange}
            color="primary"
          />
          {mainImage && (
            <div className="relative border mt-2">
              <Image
                src={mainImage.url}
                width={400}
                height={400}
                className="w-full object-contain"
                alt="Ruangan"
              />
              <Tooltip message="Gambar Utama" className="absolute top-2 left-2">
                <Toggle
                  checked={mainImage.isHome}
                  onChange={(e) => {
                    // remove this image as home image
                    setState((prev) => ({
                      ...prev,
                      images: prev.images?.map((image) => ({
                        ...image,
                        isHome: false,
                      })),
                    }));
                  }}
                />
              </Tooltip>
              <div className="absolute bottom-0 left-0 right-0 bg-base-300 p-2 flex items-center justify-between">
                <span>{mainImage.name}</span>

                <span className="text- text-primary">Gambar Utama</span>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
            {state.images
              ?.filter((img) => !img.isHome)
              .map((img, i) => (
                <div key={i} className="relative border">
                  <Image
                    src={img.url}
                    width={400}
                    height={400}
                    className="object-contain w-96"
                    alt="Ruangan"
                  />
                  <Tooltip
                    message="Gambar Utama"
                    className="absolute top-2 left-2"
                  >
                    <Toggle
                      checked={img.isHome}
                      onChange={(e) => {
                        // set this image as home image, and remove the previous home image
                        setState((prev) => ({
                          ...prev,
                          images: prev.images?.map((image) => ({
                            ...image,
                            isHome: image === img,
                          })),
                        }));
                      }}
                    />
                  </Tooltip>

                  <Button
                    type="button"
                    color="error"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setState((prev) => ({
                        ...prev,
                        images: prev.images?.filter((_, index) => index !== i),
                      }));
                    }}
                  >
                    <FaRegTrashCan />
                  </Button>
                  <div className="absolute bottom-0 left-0 right-0 bg-base-300 p-2 flex items-center justify-between">
                    <span>{img.name}</span>

                    {img.isHome && (
                      <span className="text- text-primary">Gambar Utama</span>
                    )}
                  </div>
                </div>
              ))}
            {images.map((img, i) => (
              <div key={i} className="relative border rounded-xl shadow-md">
                <Image
                  src={URL.createObjectURL(img)}
                  width={400}
                  height={400}
                  className="object-contain w-96"
                  alt="Ruangan"
                />
                <Tooltip
                  message="Silahkan upload gambar terlebih dahulu"
                  className="absolute top-2 left-2"
                >
                  <Toggle disabled />
                </Tooltip>

                <Button
                  type="button"
                  color="error"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setImages((prev) => prev.filter((_, index) => index !== i));
                  }}
                >
                  <FaRegTrashCan />
                </Button>
                <div className="absolute bottom-0 left-0 right-0 bg-base-300 p-2 rounded-b-xl">
                  {img.name}
                  <span className="text-xs text-gray-500 ml-2">
                    ({(img.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
              </div>
            ))}
          </div>

          {images.length > 0 && (
            <Button
              type="button"
              color="primary"
              loading={isUploading}
              onClick={handleUpload}
              className="mt-4"
            >
              Upload
            </Button>
          )}
        </div>

        <div className="flex gap-2 mt-4 w-full">
          <Button
            color="primary"
            loading={isLoading}
            className="flex-1"
            type="submit"
          >
            Simpan
          </Button>
          <Confirmation
            onConfirm={handleDelete}
            className="flex-1"
            text="Apakah anda yakin ingin menghapus ruangan ini?"
          >
            <Button
              type="button"
              color="error"
              loading={isDeleting}
              className="w-full"
            >
              Hapus
            </Button>
          </Confirmation>
        </div>
      </form>
    </div>
  );
}
