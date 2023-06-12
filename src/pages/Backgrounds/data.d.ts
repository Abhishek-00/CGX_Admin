export type BackgroundImageType = {
  file_type?: string | '';
  base64_content?: string | '';
  background_id?: string;
};

export type Pagination = {
  current_page?: number;
  per_page?: number;
  total_items?: number;
  total_pages?: number;
};

export type Background = {
  background_id?: number;
  background_name?: string;
  background_url?: string;
  location?: string;
  weather?: string;
  metadata?: string;
  category?: string;
  created_by?: string;
  added_by?: string;
  background_image?: BackgroundImageType;
};
export type BackgroundTypes = {
  background_id: number;
  background_name?: string;
  background_url?: string;
  location?: string;
  weather?: string;
  metadata?: string;
  imgUrl?: BackgroundImageType;
  category?: string;
  created_by?: string;
  added_by?: string;
  background_image?: BackgroundImageType;
};
