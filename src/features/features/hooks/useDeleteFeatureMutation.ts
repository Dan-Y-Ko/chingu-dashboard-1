import type {
  DeleteFeatureClientRequestDto,
  DeleteFeatureClientResponseDto,
} from "@chingu-x/modules/features";
import { useMutation } from "@tanstack/react-query";
import { useDeleteFeature } from "./useFeaturesAdapters";
import { deleteFeatureState } from "@/features/features/store/featuresSlice";
import { onCloseModal, onOpenModal } from "@/store/features/modal/modalSlice";
import { useAppDispatch } from "@/shared/store";

interface UseDeleteFeatureMutationProps {
  featureId: number;
}

export function useDeleteFeatureMutation({
  featureId,
}: UseDeleteFeatureMutationProps) {
  const dispatch = useAppDispatch();
  const { deleteFeature } = useDeleteFeature();

  const { mutate: deleteFeatureMutation } = useMutation<
    DeleteFeatureClientResponseDto,
    Error,
    DeleteFeatureClientRequestDto
  >({
    mutationFn: deleteFeatureMutationFn,
    onSuccess: () => {
      dispatch(deleteFeatureState({ featureId }));
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
