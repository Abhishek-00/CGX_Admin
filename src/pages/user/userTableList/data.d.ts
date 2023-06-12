export type TableListItem = {
  user_ID?: number;
  user_phone?: string | null;
  user_fname?: string | null;
  user_mname?: string | null;
  user_lname?: string | null;
  user_email: string;
  user_type: string | undefined;
  group_name?: string | null | undefined;
  user_password?: string | null;
  created_at?: string;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};

export type OrderTypes = {
  order_by: string;
  sorting: string;
};

export type TableListParams = {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};

declare namespace UserList {
  type UserType = {
    value: string;
    label: string;
  };

  type UserFilter = {
    user_fname: '';
    user_mname: '';
    user_lname: '';
    user_email: '';
    user_type: '';
    group_name: '';
  };

  type Pagination = {
    current_page?: number;
    per_page?: number;
    total_items?: number;
    total_pages?: number;
  };
}
