import { GoHome } from "react-icons/go";
import { MdOutlineBackupTable, MdOutlineCategory } from "react-icons/md";

export const NAV_ITEMS = [
  {
    text: "Home",
    href: "/",
    Icon: GoHome,
  },
  {
    text: "Daftar Ruangan",
    href: "/ruangan",
    Icon: MdOutlineBackupTable,
  },
  {
    text: "Daftar Kategori",
    href: "/kategori",
    Icon: MdOutlineCategory,
  },
];
