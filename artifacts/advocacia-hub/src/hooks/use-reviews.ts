import { useGetReviewsByLawyer, useCreateReview } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetReviewsByLawyerQueryKey } from "@workspace/api-client-react";

export { useGetReviewsByLawyer };

export function useSubmitReview() {
  const queryClient = useQueryClient();
  const mutation = useCreateReview();

  return {
    ...mutation,
    mutateAsync: async (data: Parameters<typeof mutation.mutateAsync>[0]) => {
      const result = await mutation.mutateAsync(data);
      // Invalidate the reviews cache for this lawyer so the new review shows up
      queryClient.invalidateQueries({
        queryKey: getGetReviewsByLawyerQueryKey(data.data.lawyerId)
      });
      return result;
    }
  };
}
