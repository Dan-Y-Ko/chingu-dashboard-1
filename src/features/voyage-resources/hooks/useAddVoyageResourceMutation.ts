import { useMutation } from "@tanstack/react-query";
import type {
  AddVoyageResourceClientRequestDto,
  AddVoyageResourceResponseDto,
} from "@chingu-x/modules/voyage-resources";
import { useAddVoyageResource } from "./useVoyageResourcesAdapters";
import { useAppDispatch } from "@/shared/store";
import { onOpenModal } from "@/store/features/modal/modalSlice";

export function useAddVoyageResourceMutation() {
  const dispatch = useAppDispatch();
  const { addVoyageResource } = useAddVoyageResource();

  const {
    mutate: addVoyageResourceMutation,
    isPending: isAddVoyageResourcePending,
  } = useMutation<
    AddVoyageResourceResponseDto,
    Error,
    AddVoyageResourceClientRequestDto
  >({
    mutationFn: addVoyageResourceMutationFn,
    onSuccess: async (data) => {
      //   dispatch(addFeatureState(feature));
    },
    onError: (error: Error) => {
      dispatch(
        onOpenModal({ type: "error", content: { message: error.message } }),
      );
    },
  });

  async function addVoyageResourceMutationFn({
    teamId,
    url,
    title,
  }: AddVoyageResourceClientRequestDto): Promise<AddVoyageResourceResponseDto> {
    return await addVoyageResource({
      teamId,
      url,
      title,
    });
  }

  return {
    isAddVoyageResourcePending,
    addVoyageResourceMutation,
  };
}
