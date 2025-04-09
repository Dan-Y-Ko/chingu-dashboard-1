import { useMutation } from "@tanstack/react-query";
import type {
  DeleteTechStackItemClientRequestDto,
  DeleteTechStackItemResponseDto,
} from "@chingu-x/modules/tech-stack";
import { useDeleteTechStack } from "./useTechStackAdapters";
import { useAppDispatch } from "@/shared/store";
import { onOpenModal } from "@/store/features/modal/modalSlice";

export function useDeleteTechStackMutation() {
  const dispatch = useAppDispatch();
  const { deleteTechStack } = useDeleteTechStack();

  const { mutate: deleteTechStackMutation } = useMutation<
    DeleteTechStackItemResponseDto,
    Error,
    DeleteTechStackItemClientRequestDto
  >({
    mutationFn: deleteTechStackMutationFn,
    onSuccess: (data) => {
      //   dispatch(
      //     addVoyageResourceState({ data, id, firstName, lastName, avatar }),
      //   );
    },
    onError: (error: Error) => {
      dispatch(
        onOpenModal({ type: "error", content: { message: error.message } }),
      );
    },
  });

  async function deleteTechStackMutationFn({
    teamTechItemId,
  }: DeleteTechStackItemClientRequestDto): Promise<DeleteTechStackItemResponseDto> {
    return await deleteTechStack({
      teamTechItemId,
    });
  }

  return {
    deleteTechStackMutation,
  };
}
