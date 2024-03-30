export interface Ruangan {
  id: string;
  name: string;
  code: string;
  category: string;
  propertyCount?: {
    total: number;
    broken: number;
    good: number;
  };
}

export interface Kategori {
  id: string;
  name: string;
  description: string;
}
