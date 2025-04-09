import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  DeleteTechStackItemClientRequestDto,
  DeleteTechStackItemResponseDto,
} from "@chingu-x/modules/tech-stack";
import { useDeleteTechStack } from "./useTechStackAdapters";
import { useAppDispatch } from "@/shared/store";
import { onCloseModal, onOpenModal } from "@/store/features/modal/modalSlice";
import { CacheTag } from "@/shared/utils/cacheTag";

interface UseDeleteTechStackMutationProps {
  teamId: string;
}

export function useDeleteTechStackMutation({
  teamId,
}: UseDeleteTechStackMutationProps) {
  const dispatch = useAppDispatch();
  const { deleteTechStack } = useDeleteTechStack();
  const queryClient = useQueryClient();

  const { mutate: deleteTechStackMutation } = useMutation<
    DeleteTechStackItemResponseDto,
    Error,
    DeleteTechStackItemClientRequestDto
  >({
    mutationFn: deleteTechStackMutationFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [CacheTag.techStack, { teamId }],
      });

      dispatch(onCloseModal());
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
