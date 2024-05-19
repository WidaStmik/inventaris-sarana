import {
  AiTwotoneCalendar,
  AiTwotoneSetting,
  AiTwotoneLayout,
  AiTwotoneHome,
  AiTwotoneReconciliation,
} from "react-icons/ai";

export const NAV_ITEMS = [
  {
    text: "Home",
    href: "/",
    Icon: AiTwotoneHome,
  },
  {
    text: "Daftar Ruangan",
    href: "/ruangan",
    Icon: AiTwotoneLayout,
  },
  {
    text: "Daftar Kategori",
    href: "/kategori",
    Icon: AiTwotoneCalendar,
  },
  {
    text: "Daftar Sarana",
    href: "/sarana",
    Icon: AiTwotoneSetting,
  },
  {
    text: "Pengajuan",
    href: "/pengajuan",
    Icon: AiTwotoneReconciliation,
  },
  {
    text: "Daftar Pengajuan",
    href: "/daftar-pengajuan",
    Icon: AiTwotoneReconciliation,
  },
];
