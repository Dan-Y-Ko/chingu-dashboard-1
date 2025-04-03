import type {
  FeaturesList,
  SaveOrderClientRequestDto,
  SaveOrderClientResponseDto,
} from "@chingu-x/modules/features";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSaveOrder } from "./useFeaturesAdapters";
import { rollbackOrderState } from "@/features/features/store/featuresSlice";
import { CacheTag } from "@/shared/utils/cacheTag";
import { useAppDispatch } from "@/shared/store";
import { onOpenModal } from "@/store/features/modal/modalSlice";

interface UseSaveOrderMutationProps {
  teamId: string;
}

export function useSaveOrderMutation({ teamId }: UseSaveOrderMutationProps) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { saveOrder } = useSaveOrder();

  const { mutate: saveOrderMutation } = useMutation<
    SaveOrderClientResponseDto,
    Error,
    SaveOrderClientRequestDto
  >({
    mutationFn: saveOrderMutationFn,
    onError: (error: Error) => {
      const previousData = queryClient.getQueryData([
        CacheTag.features,
        { teamId },
      ]);

      dispatch(rollbackOrderState(previousData as FeaturesList));
      dispatch(
        onOpenModal({ type: "error", content: { message: error.message } }),
      );
    },
  });

  async function saveOrderMutationFn({
    featureId,
    order,
    featureCategoryId,
  }: SaveOrderClientRequestDto): Promise<SaveOrderClientResponseDto> {
    return await saveOrder({
      featureId,
      order,
      featureCategoryId,
    });
  }

  return {
    saveOrderMutation,
  };
}
