export type Note = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
  archived: boolean;
};

export type SortOption = "date" | "alpha";
