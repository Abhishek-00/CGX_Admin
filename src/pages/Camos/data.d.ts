export type CamoImageType = {
  file_type?: string | '';
  base64_content?: string | '';
  camo_id?: string;
};

declare namespace CAMOS {
  type TableListItem = {
    camo_id?: number;
    camo_name: string;
    camo_url: any;
    user?: string;
    tag?: UserType[];
    affiliate_url: string | undefined;
    is_active?: boolean;
    camo_image?: CamoImageType;
  };
  type CamoTagListItem = {
    tag_id: number;
    tag_name: string;
  };
}

export type Camo = {
  camo_id?: number;
  camo_name?: string;
  affiliate_url?: string | undefined;
  camo_url?: any;
  user_name?: string;
  tag_name?: string | undefined;
  camo_image?: CamoImageType;
};

export type CamoTypes = {
  camo_id: number;
  camo_name?: string;
  affiliate_url?: string;
  camo_url?: any;
  imgUrl?: CamoImageType;
  user_name?: string;
  tag_name?: string;
  camo_image?: CamoImageType;
};

export type CamoFilter = {
  camoname: string;
  added_by: string;
  tag_name: string;
};

export type Tag = {
  tag_id: number;
  tag_name: string;
};

export type Pagination = {
  current_page?: number;
  per_page?: number;
  total_items?: number;
  total_pages?: number;
};
