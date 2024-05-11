import { GoHome } from "react-icons/go";
import { LiaToolsSolid } from "react-icons/lia";
import { MdOutlineBackupTable, MdOutlineCategory } from "react-icons/md";
import { Roles } from ".";

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
  {
    text: "Daftar Sarana",
    href: "/sarana",
    Icon: LiaToolsSolid,
  },
];
