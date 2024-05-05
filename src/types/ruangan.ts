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
  description: string;
}
