export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: any;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}
