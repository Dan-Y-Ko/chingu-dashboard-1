import { useMutation } from "@tanstack/react-query";
import type {
  AddTechStackItemClientRequestDto,
  AddTechStackItemResponseDto,
} from "@chingu-x/modules/tech-stack";
import { useAddTechStack } from "./useTechStackAdapters";
import { useAppDispatch } from "@/shared/store";
import { onOpenModal } from "@/store/features/modal/modalSlice";

export function useAddTechStackMutation() {
  const dispatch = useAppDispatch();
  const { addTechStack } = useAddTechStack();

  const { mutate: addTechStackMutation, isPending: isAddTechStackPending } =
    useMutation<
      AddTechStackItemResponseDto,
      Error,
      AddTechStackItemClientRequestDto
    >({
      mutationFn: addTechStackMutationFn,
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

  async function addTechStackMutationFn({
    teamId,
    techName,
    techCategoryId,
    voyageTeamMemberId,
  }: AddTechStackItemClientRequestDto): Promise<AddTechStackItemResponseDto> {
    return await addTechStack({
      teamId,
      techName,
      techCategoryId,
      voyageTeamMemberId,
    });
  }

  return {
    isAddTechStackPending,
    addTechStackMutation,
  };
}
