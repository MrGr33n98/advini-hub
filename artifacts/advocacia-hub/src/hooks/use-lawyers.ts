import { useListLawyers, useGetLawyer } from "@workspace/api-client-react";
import type { ListLawyersParams } from "@workspace/api-client-react";

// Export the generated hooks directly or wrap them for specific default behaviors
export { useListLawyers, useGetLawyer };

// Helper hook for search state management if needed across components
import { useState } from "react";

export function useLawyerSearch(initialParams: ListLawyersParams = {}) {
  const [params, setParams] = useState<ListLawyersParams>({
    page: 1,
    limit: 12,
    ...initialParams
  });

  const query = useListLawyers(params, {
    query: {
      keepPreviousData: true,
    }
  });

  const updateFilters = (newParams: Partial<ListLawyersParams>) => {
    setParams(prev => ({ ...prev, ...newParams, page: 1 }));
  };

  const setPage = (page: number) => {
    setParams(prev => ({ ...prev, page }));
  };

  return {
    params,
    updateFilters,
    setPage,
    ...query
  };
}
