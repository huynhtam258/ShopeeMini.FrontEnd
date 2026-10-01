export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
  errors: Record<string, string[]> | string[] | null;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
  fromDate?: string;
  toDate?: string;
}
