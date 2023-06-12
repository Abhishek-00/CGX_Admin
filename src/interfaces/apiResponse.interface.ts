export interface PaginationType {
  current_page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
}

export interface ApiResponse {
  code: number;
  status: string;
  message?: string;
  data: any;
  Authorization: string;
  pagination: PaginationType;
}
