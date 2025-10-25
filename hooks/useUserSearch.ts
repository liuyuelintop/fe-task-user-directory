"use client";

import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { UserSearchResponse } from "@/types";

interface UserSearchParams {
  q: string;
  nationality: string;
  page: number;
  pageSize?: number;
}

const DEFAULT_PAGE_SIZE = 50;

export function useUserSearch({
  q,
  nationality,
  page,
  pageSize = DEFAULT_PAGE_SIZE,
}: UserSearchParams) {
  const debounced = useDebounce(
    {
      q: q ?? "",
      nationality: (nationality ?? "ALL").toUpperCase(),
      page,
      pageSize,
    },
    250
  );

  return useQuery<UserSearchResponse, Error>({
    queryKey: ["user-search", debounced],
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams({
        q: debounced.q,
        nationality: debounced.nationality,
        page: String(debounced.page),
        pageSize: String(debounced.pageSize),
      });

      const response = await fetch(`/api/users/search?${params.toString()}`, {
        signal,
      });

      if (!response.ok) {
        throw new Error(`Search failed with status ${response.status}`);
      }

      return (await response.json()) as UserSearchResponse;
    },
    placeholderData: (previousData) => previousData,
    staleTime: 60 * 1000,
  });
}
