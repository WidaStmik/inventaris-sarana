import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { Kategori, Ruangan, Sarana } from "@/types/ruangan";
import { db, storage } from "./firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const ruanganApi = createApi({
  reducerPath: "ruanganApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Ruangan", "Kategori", "Sarana"],
  endpoints: (build) => ({
    getRuangan: build.query({
      query: () => "ruangan",
      providesTags: ["Ruangan"],
    }),
    addRuangan: build.mutation<Ruangan, Omit<Ruangan, "id">>({
      queryFn: async (arg) => {
        const docRef = await addDoc(collection(db, "ruangan"), arg);
        return { data: { ...arg, id: docRef.id } };
      },
      invalidatesTags: ["Ruangan"],
    }),
    updateRuangan: build.mutation<Ruangan, Ruangan>({
      queryFn: async (arg) => {
        const { id, ...rest } = arg;
        await updateDoc(doc(db, "ruangan", id), rest);
        return { data: arg };
      },
      invalidatesTags: ["Ruangan"],
    }),
    deleteRuangan: build.mutation<void, string>({
      queryFn: async (id) => {
        await deleteDoc(doc(db, "ruangan", id));
        return { data: undefined };
      },
      invalidatesTags: ["Ruangan"],
    }),
    addKategori: build.mutation<Kategori, Omit<Kategori, "id">>({
      queryFn: async (arg) => {
        const docRef = await addDoc(collection(db, "kategori"), arg);
        return { data: { ...arg, id: docRef.id } };
      },
      invalidatesTags: ["Kategori"],
    }),
    updateKategori: build.mutation<Kategori, Kategori>({
      queryFn: async (arg) => {
        const { id, ...rest } = arg;
        await updateDoc(doc(db, "kategori", id), rest);
        return { data: arg };
      },
      invalidatesTags: ["Kategori"],
    }),
    deleteKategori: build.mutation<void, string>({
      queryFn: async (id) => {
        await deleteDoc(doc(db, "kategori", id));
        return { data: undefined };
      },
      invalidatesTags: ["Kategori"],
    }),
    uploadImages: build.mutation<
      Ruangan["images"],
      {
        id: string;
        images: File[];
      }
    >({
      queryFn: async ({ images, id }) => {
        const promises = images.map((image) => {
          const storageRef = ref(storage, `images/${image.name}`);
          return uploadBytes(storageRef, image);
        });

        const res = await Promise.all(promises);
        const downloadURLs = await Promise.all(
          res.map((snapshot) => getDownloadURL(snapshot.ref))
        );

        // update ruangan
        const ruanganRef = doc(db, "ruangan", id);
        await updateDoc(ruanganRef, {
          images: downloadURLs.map((url, i) => ({
            name: images[i].name,
            url,
          })),
        });

        return {
          data: downloadURLs.map((url, i) => ({ name: images[i].name, url })),
        };
      },
    }),
    addSarana: build.mutation<Sarana, Omit<Sarana, "id">>({
      queryFn: async (arg) => {
        const docRef = await addDoc(collection(db, "sarana"), arg);
        return { data: { ...arg, id: docRef.id } };
      },
      invalidatesTags: ["Sarana"],
    }),
    updateSarana: build.mutation<Sarana, Sarana>({
      queryFn: async (arg) => {
        const { id, ...rest } = arg;
        await updateDoc(doc(db, "sarana", id), rest);
        return { data: arg };
      },
      invalidatesTags: ["Sarana"],
    }),
    deleteSarana: build.mutation<void, string>({
      queryFn: async (id) => {
        await deleteDoc(doc(db, "sarana", id));
        return { data: undefined };
      },
      invalidatesTags: ["Sarana"],
    }),
  }),
});

export const {
  useGetRuanganQuery,
  useAddRuanganMutation,
  useAddKategoriMutation,
  useUpdateKategoriMutation,
  useUpdateRuanganMutation,
  useDeleteRuanganMutation,
  useDeleteKategoriMutation,
  useUploadImagesMutation,
  useAddSaranaMutation,
  useUpdateSaranaMutation,
  useDeleteSaranaMutation,
} = ruanganApi;
