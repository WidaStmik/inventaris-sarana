import {
  AiTwotoneAppstore,
  AiTwotoneCheckSquare,
  AiTwotoneHdd,
  AiTwotoneHome,
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
    Icon: AiTwotoneHdd,
  },
  {
    text: "Daftar Kategori",
    href: "/kategori",
    Icon: AiTwotoneAppstore,
  },
  {
    text: "Daftar Sarana",
    href: "/sarana",
    Icon: AiTwotoneCheckSquare,
  },
];
