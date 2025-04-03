import type {
  EditFeatureClientRequestDto,
  EditFeatureClientResponseDto,
} from "@chingu-x/modules/features";
import { useMutation } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import { useEditFeature } from "./useFeaturesAdapters";
import { editFeatureState } from "@/features/features/store/featuresSlice";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { useAppDispatch } from "@/shared/store";

interface UseEditFeatureMutationProps {
  setEditMode: Dispatch<SetStateAction<boolean>>;
}

export function useEditFeatureMutation({
  setEditMode,
}: UseEditFeatureMutationProps) {
  const dispatch = useAppDispatch();
  const { editFeature } = useEditFeature();

  const { mutate: editFeatureMutation, isPending: isEditFeaturePending } =
    useMutation<
      EditFeatureClientResponseDto,
      Error,
      EditFeatureClientRequestDto
    >({
      mutationFn: editFeatureMutationFn,
      onSuccess: (data) => {
        dispatch(editFeatureState(data));
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
