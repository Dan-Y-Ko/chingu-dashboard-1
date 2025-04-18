import type {
  AddFeatureClientRequestDto,
  AddFeatureClientResponseDto,
} from "@chingu-x/modules/features";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import { useAddFeature } from "./useFeaturesAdapters";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { useAppDispatch } from "@/shared/store";
import { CacheTag } from "@/shared/utils/cacheTag";

interface UseAddFeatureMutationProps {
  teamId: string;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}

export function useAddFeatureMutation({
  teamId,
  setIsEditing,
}: UseAddFeatureMutationProps) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { addFeature } = useAddFeature();

  const { mutate: addFeatureMutation, isPending: isAddFeaturePending } =
    useMutation<AddFeatureClientResponseDto, Error, AddFeatureClientRequestDto>(
      {
        mutationFn: addFeatureMutationFn,
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: [CacheTag.features, { teamId }],
          });

          setIsEditing(false);
        },
        onError: (error: Error) => {
          dispatch(
            onOpenModal({ type: "error", content: { message: error.message } }),
          );
        },
      },
    );

  async function addFeatureMutationFn({
    teamId,
    description,
    featureCategoryId,
  }: AddFeatureClientRequestDto): Promise<AddFeatureClientResponseDto> {
    return await addFeature({
      teamId,
      description,
      featureCategoryId,
    });
  }

  return {
    isAddFeaturePending,
    addFeatureMutation,
  };
}
