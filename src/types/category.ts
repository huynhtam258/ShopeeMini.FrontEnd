export interface CategoryDto {
  id: number;
  name: string;
  parentCategoryId: number | null;
  createdAt: string;
}

export interface UpsertCategoryDto {
  name: string;
  parentCategoryId: number | null;
}
