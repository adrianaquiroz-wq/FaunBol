export interface Page<T> {
  items: T[];
  total: number;
}

export interface PageRequest {
  page: number;
  limit: number;
}
