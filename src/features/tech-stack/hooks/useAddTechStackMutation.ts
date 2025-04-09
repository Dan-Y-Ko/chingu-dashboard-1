import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  AddTechStackItemClientRequestDto,
  AddTechStackItemResponseDto,
} from "@chingu-x/modules/tech-stack";
import type { Dispatch, SetStateAction } from "react";
import type { UseFormReset } from "react-hook-form";
import { useAddTechStack } from "./useTechStackAdapters";
import { useAppDispatch } from "@/shared/store";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { CacheTag } from "@/shared/utils/cacheTag";

interface UseAddTechStackMutationProps {
  teamId: string;
  setIsInput: Dispatch<SetStateAction<boolean>>;
  reset: UseFormReset<{
    add: string;
  }>;
}

export function useAddTechStackMutation({
  teamId,
  setIsInput,
  reset,
}: UseAddTechStackMutationProps) {
  const dispatch = useAppDispatch();
  const { addTechStack } = useAddTechStack();
  const queryClient = useQueryClient();

  const { mutate: addTechStackMutation, isPending: isAddTechStackPending } =
    useMutation<
      AddTechStackItemResponseDto,
      Error,
      AddTechStackItemClientRequestDto
    >({
      mutationFn: addTechStackMutationFn,
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [CacheTag.techStack, { teamId }],
        });

        setIsInput(false);
        reset();
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
