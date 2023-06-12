export type CamoTag = {
  tag_id: number;
  tag_name: string;
};

export type Pagination = {
  current_page?: number;
  per_page?: number;
  total_items?: number;
  total_pages?: number;
};
