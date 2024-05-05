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

export interface Kategori {
  id: string;
  name: string;
  kind: "ruangan" | "sarana";
  description: string;
}

// export interface Sarana {
//   id: string;
//   name: string;
//   code: string;
//   category: string;
//   condition: "good" | "broken";
//   ruanganId: string;
// }
