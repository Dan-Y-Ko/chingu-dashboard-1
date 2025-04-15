import type {
  AddFeatureClientRequestDto,
  AddFeatureClientResponseDto,
} from "@chingu-x/modules/features";
import { useMutation } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import { useFetchFeatureQuery } from "./useFetchFeatureQuery";
import { useAddFeature } from "./useFeaturesAdapters";
import { addFeatureState } from "@/features/features/store/featuresSlice";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { useAppDispatch } from "@/shared/store";

interface UseAddFeatureMutationProps {
  id: number;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}

export function useAddFeatureMutation({
  id,
  setIsEditing,
}: UseAddFeatureMutationProps) {
  const dispatch = useAppDispatch();
  const { getFeatureQueryFn } = useFetchFeatureQuery({ id });
  const { addFeature } = useAddFeature();

  const { mutate: addFeatureMutation, isPending: isAddFeaturePending } =
    useMutation<AddFeatureClientResponseDto, Error, AddFeatureClientRequestDto>(
      {
        mutationFn: addFeatureMutationFn,
        onSuccess: async (data) => {
          try {
            const feature = await getFeatureQueryFn(data.id);
            dispatch(addFeatureState(feature));
          } catch (error) {
            dispatch(
              onOpenModal({
                type: "error",
                content: { message: (error as Error).message },
              }),
            );
          } finally {
            setIsEditing(false);
          }
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
