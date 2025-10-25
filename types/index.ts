export interface User {
    id: string;
    email: string;
    name: {
      first: string;
      last: string;
      full: string;
    };
    picture: {
      large: string;
    };
    nationality: string;
  }

export interface UserSearchMeta {
  total: number;
  totalAll: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  nationalities: string[];
}

export interface UserSearchResponse {
  data: User[];
  meta: UserSearchMeta;
}
