import { useMutation } from "@tanstack/react-query";
import type {
  AddVoyageResourceClientRequestDto,
  AddVoyageResourceResponseDto,
} from "@chingu-x/modules/voyage-resources";
import { useAddVoyageResource } from "./useVoyageResourcesAdapters";
import { useAppDispatch } from "@/shared/store";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { useUserStateSelector } from "@/features/user/hooks/useUserStateSelector";
import { addVoyageResourceState } from "@/features/voyage-resources/store/voyageResourcesSlice";

export function useAddVoyageResourceMutation() {
  const dispatch = useAppDispatch();
  const { addVoyageResource } = useAddVoyageResource();
  const { id, firstName, lastName, avatar } = useUserStateSelector();

  const {
    mutate: addVoyageResourceMutation,
    isPending: isAddVoyageResourcePending,
  } = useMutation<
    AddVoyageResourceResponseDto,
    Error,
    AddVoyageResourceClientRequestDto
  >({
    mutationFn: addVoyageResourceMutationFn,
    onSuccess: (data) => {
      dispatch(
        addVoyageResourceState({ data, id, firstName, lastName, avatar }),
      );
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
