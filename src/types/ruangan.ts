import { Timestamp } from "firebase/firestore";

export interface Ruangan {
  id: string;
  name: string;
  code: string;
  category: string;
  saranaCount?: {
    total: number;
    broken: number;
    good: number;
  };
  images?: {
    name: string;
    url: string;
    isHome?: boolean;
  }[];
  area: string;
}

export interface SaranaRuangan {
  id: string;
  ruanganId: string;
  saranaId: string;
  quantity: number;
  condition: "good" | "broken";
}

export interface Kategori {
  id: string;
  name: string;
  kind: "ruangan" | "sarana";
  description: string;
}

export interface Sarana {
  id: string;
  name: string;
  sku?: string;
  category: string;
}

export interface Pengajuan {
  id: string;
  ruanganId: string;
  saranaId: string;
  quantity: number;
  status: "pending" | "approved" | "rejected" | "canceled";
  createdAt: Timestamp;
  userId: string;
  message: string;
}
