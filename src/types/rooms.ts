export interface Room {
  id: string;
  name: string;
  code: string;
  category: string;
  propertyCount: {
    total: number;
    broken: number;
    good: number;
  };
}
