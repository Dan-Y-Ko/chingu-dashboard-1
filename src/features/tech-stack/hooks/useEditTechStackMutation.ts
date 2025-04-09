import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  EditTechStackItemClientRequestDto,
  EditTechStackItemResponseDto,
} from "@chingu-x/modules/tech-stack";
import type { SetStateAction } from "react";
import type { UseFormReset } from "react-hook-form";
import { useEditTechStack } from "./useTechStackAdapters";
import { useAppDispatch } from "@/shared/store";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { CacheTag } from "@/shared/utils/cacheTag";

interface UseEditTechStackMutationProps {
  teamId: string;
  setEditItemId: (value: SetStateAction<number>) => void;
  resetEdit: UseFormReset<{
    edit: string;
  }>;
}

export function useEditTechStackMutation({
  teamId,
  setEditItemId,
  resetEdit,
}: UseEditTechStackMutationProps) {
  const dispatch = useAppDispatch();
  const { editTechStack } = useEditTechStack();
  const queryClient = useQueryClient();

  const { mutate: editTechStackMutation, isPending: iseditTechStackPending } =
    useMutation<
      EditTechStackItemResponseDto,
      Error,
      EditTechStackItemClientRequestDto
    >({
      mutationFn: editTechStackMutationFn,
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [CacheTag.techStack, { teamId }],
        });

        setEditItemId(-1);
        resetEdit();
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
