import { useListBlogPosts, useGetBlogPost } from "@workspace/api-client-react";
import type { ListBlogPostsParams } from "@workspace/api-client-react";
import { useState } from "react";

export { useListBlogPosts, useGetBlogPost };

export function useBlogSearch(initialParams: ListBlogPostsParams = {}) {
  const [params, setParams] = useState<ListBlogPostsParams>({
    page: 1,
    limit: 9,
    ...initialParams,
  });

  const query = useListBlogPosts(params, {
    query: { keepPreviousData: true },
  });

  const updateFilters = (newParams: Partial<ListBlogPostsParams>) => {
    setParams(prev => ({ ...prev, ...newParams, page: 1 }));
  };

  const setPage = (page: number) => {
    setParams(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return { params, updateFilters, setPage, ...query };
}
