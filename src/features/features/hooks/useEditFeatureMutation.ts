import type {
  EditFeatureClientRequestDto,
  EditFeatureClientResponseDto,
} from "@chingu-x/modules/features";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import { useEditFeature } from "./useFeaturesAdapters";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { useAppDispatch } from "@/shared/store";
import { CacheTag } from "@/shared/utils/cacheTag";

interface UseEditFeatureMutationProps {
  teamId: string;
  setEditMode: Dispatch<SetStateAction<boolean>>;
}

export function useEditFeatureMutation({
  teamId,
  setEditMode,
}: UseEditFeatureMutationProps) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { editFeature } = useEditFeature();

  const { mutate: editFeatureMutation, isPending: isEditFeaturePending } =
    useMutation<
      EditFeatureClientResponseDto,
      Error,
      EditFeatureClientRequestDto
    >({
      mutationFn: editFeatureMutationFn,
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [CacheTag.features, { teamId }],
        });
        setEditMode(false);
      },
      onError: (error: Error) => {
        dispatch(
          onOpenModal({ type: "error", content: { message: error.message } }),
        );
      },
    });

  async function editFeatureMutationFn({
    featureId,
    teamMemberId,
    description,
  }: EditFeatureClientRequestDto): Promise<EditFeatureClientResponseDto> {
    return await editFeature({
      featureId,
      teamMemberId,
      description,
    });
  }

  return {
    isEditFeaturePending,
    editFeatureMutation,
  };
}
