import { Roles } from "./app/constants";

export const claims = {
  "/": [Roles.Admin, Roles.User],
  "/kategori": [Roles.Admin],
  "/kategori/[id]/edit": [Roles.Admin],
  "/kategori/tambah": [Roles.Admin],
  "/ruangan": [Roles.Admin, Roles.User],
  "/ruangan/[id]": [Roles.Admin, Roles.User],
  "/ruangan/[id]/edit": [Roles.Admin],
  "/ruangan/tambah": [Roles.Admin],
  "/sarana": [Roles.Admin],
  "/sarana/[id]/edit": [Roles.Admin],
  "/sarana/tambah": [Roles.Admin],
  "/pengajuan": [Roles.User],
  "/daftar-pengajuan": [Roles.Admin],
  "/pengajuan/tambah": [Roles.User],
};
