import type {
  DeleteFeatureClientRequestDto,
  DeleteFeatureClientResponseDto,
} from "@chingu-x/modules/features";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDeleteFeature } from "./useFeaturesAdapters";
import { onCloseModal, onOpenModal } from "@/store/features/modal/modalSlice";
import { useAppDispatch } from "@/shared/store";
import { CacheTag } from "@/shared/utils/cacheTag";

interface UseDeleteFeatureMutationProps {
  teamId: string;
}

export function useDeleteFeatureMutation({
  teamId,
}: UseDeleteFeatureMutationProps) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { deleteFeature } = useDeleteFeature();

  const { mutate: deleteFeatureMutation } = useMutation<
    DeleteFeatureClientResponseDto,
    Error,
    DeleteFeatureClientRequestDto
  >({
    mutationFn: deleteFeatureMutationFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [CacheTag.features, { teamId }],
      });
      dispatch(onCloseModal());
    },
    onError: (error: Error) => {
      dispatch(
        onOpenModal({ type: "error", content: { message: error.message } }),
      );
    },
  });

  async function deleteFeatureMutationFn({
    featureId,
  }: DeleteFeatureClientRequestDto): Promise<DeleteFeatureClientResponseDto> {
    return await deleteFeature({ featureId });
  }

  return {
    deleteFeatureMutation,
  };
}
