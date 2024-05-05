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
