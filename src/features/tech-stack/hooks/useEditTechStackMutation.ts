import { useMutation } from "@tanstack/react-query";
import type {
  EditTechStackItemClientRequestDto,
  EditTechStackItemResponseDto,
} from "@chingu-x/modules/tech-stack";
import { useEditTechStack } from "./useTechStackAdapters";
import { useAppDispatch } from "@/shared/store";
import { onOpenModal } from "@/store/features/modal/modalSlice";

export function useEditTechStackMutation() {
  const dispatch = useAppDispatch();
  const { editTechStack } = useEditTechStack();

  const { mutate: editTechStackMutation, isPending: iseditTechStackPending } =
    useMutation<
      EditTechStackItemResponseDto,
      Error,
      EditTechStackItemClientRequestDto
    >({
      mutationFn: editTechStackMutationFn,
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

  async function editTechStackMutationFn({
    teamTechItemId,
    techName,
  }: EditTechStackItemClientRequestDto): Promise<EditTechStackItemResponseDto> {
    return await editTechStack({
      teamTechItemId,
      techName,
    });
  }

  return {
    iseditTechStackPending,
    editTechStackMutation,
  };
}
