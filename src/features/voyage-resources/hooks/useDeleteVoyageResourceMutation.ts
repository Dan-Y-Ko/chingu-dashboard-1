import { useMutation } from "@tanstack/react-query";
import type {
  DeleteVoyageResourceClientRequestDto,
  DeleteVoyageResourceResponseDto,
} from "@chingu-x/modules/voyage-resources";
import { useDeleteVoyageResource } from "./useVoyageResourcesAdapters";
import { useAppDispatch } from "@/shared/store";
import { onOpenModal } from "@/store/features/modal/modalSlice";

export function useDeleteVoyageResourceMutation() {
  const dispatch = useAppDispatch();
  const { deleteVoyageResource } = useDeleteVoyageResource();

  const {
    mutate: deleteVoyageResourceMutation,
    isPending: isDeleteVoyageResourcePending,
  } = useMutation<
    DeleteVoyageResourceResponseDto,
    Error,
    DeleteVoyageResourceClientRequestDto
  >({
    mutationFn: deleteVoyageResourceMutationFn,
    onSuccess: async (data) => {
      //   dispatch(addFeatureState(feature));
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
    isDeleteVoyageResourcePending,
    deleteVoyageResourceMutation,
  };
}
