import type { BackgroundTypes } from '../Backgrounds/data';
import type { CamoTypes } from '../Camos/data';

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
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

export type otherSessionDataType = {
  test_name: string;
  end_date?: string;
  user_id?: number[];
  camo_id?: number[];
  background_id?: number[];
};

export type selectedBgAndCamo = {
  bgData: BackgroundTypes[];
  camoData: CamoTypes[];
  userData: string[];
};

declare namespace SESSION {
  type UserType = {
    value: string;
    label: string;
  };
  type BWType = {
    value: number;
    label: string;
  };

  enum SessionIsBW {
    No = 0,
    Yes = 1,
  }
  enum SessionStatus {
    anabel = 1,
    disable = 0,
  }

  type filter = {
    test_name: string;
    background_name: string;
    camo_name: string;
  };

  type TableListItem = {
    test_id: number;
    background_id: string;
    background_name: string;
    background_url: string;
    camo_id: string;
    camo_name: string;
    camo_url: string;
    test_name: string;
    background: string;
    camos: string;
    user: string;
    user_id: string;
    users: string;
    user_group: string;
    test_mode: string;
    is_bw: SessionIsBW;
    creation_date: string;
    game_round: number;
    session_end_date: string;
    status: SessionStatus;
  };

  type Pagination = {
    current_page?: number;
    per_page?: number;
    total_items?: number;
    total_pages?: number;
  };
}
