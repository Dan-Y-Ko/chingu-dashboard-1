import { useMutation } from "@tanstack/react-query";
import type {
  DeleteVoyageResourceClientRequestDto,
  DeleteVoyageResourceResponseDto,
} from "@chingu-x/modules/voyage-resources";
import { useDeleteVoyageResource } from "./useVoyageResourcesAdapters";
import { useAppDispatch } from "@/shared/store";
import { onCloseModal, onOpenModal } from "@/store/features/modal/modalSlice";
import { deleteVoyageResourceState } from "@/features/voyage-resources/store/voyageResourcesSlice";

export function useDeleteVoyageResourceMutation() {
  const dispatch = useAppDispatch();
  const { deleteVoyageResource } = useDeleteVoyageResource();

  const { mutate: deleteVoyageResourceMutation } = useMutation<
    DeleteVoyageResourceResponseDto,
    Error,
    DeleteVoyageResourceClientRequestDto
  >({
    mutationFn: deleteVoyageResourceMutationFn,
    onSuccess: (data) => {
      dispatch(deleteVoyageResourceState(data));
      dispatch(onCloseModal());
    },
    onError: (error: Error) => {
      dispatch(
        onOpenModal({ type: "error", content: { message: error.message } }),
      );
    },
  });

  async function deleteVoyageResourceMutationFn({
    resourceId,
  }: DeleteVoyageResourceClientRequestDto): Promise<DeleteVoyageResourceResponseDto> {
    return await deleteVoyageResource({
      resourceId,
    });
  }

  return {
    deleteVoyageResourceMutation,
  };
}
