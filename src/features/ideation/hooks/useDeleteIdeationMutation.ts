import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  DeleteIdeationClientRequestDto,
  DeleteIdeationResponseDto,
} from "@chingu-x/modules/ideation";
import { useDeleteIdeation } from "./useIdeationAdapters";
import { useAppDispatch } from "@/shared/store";
import { CacheTag } from "@/shared/utils/cacheTag";
import { onOpenModal } from "@/store/features/modal/modalSlice";

interface UseDeleteIdeationMutationProps {
  teamId: string;
}

export function useDeleteIdeationMutation({
  teamId,
}: UseDeleteIdeationMutationProps) {
  const dispatch = useAppDispatch();
  const { deleteIdeation } = useDeleteIdeation();
  const queryClient = useQueryClient();

  const { mutate: deleteIdeationMutation, isPending: isDeleteIdeationPending } =
    useMutation<
      DeleteIdeationResponseDto,
      Error,
      DeleteIdeationClientRequestDto
    >({
      mutationFn: deleteIdeationMutationFn,
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [CacheTag.ideation, { teamId }],
        });
      },
      onError: (error: Error) => {
        dispatch(
          onOpenModal({ type: "error", content: { message: error.message } }),
        );
      },
    });

  async function deleteIdeationMutationFn({
    ideationId,
  }: DeleteIdeationClientRequestDto): Promise<DeleteIdeationResponseDto> {
    return await deleteIdeation({
      ideationId,
    });
  }

  return {
    isDeleteIdeationPending,
    deleteIdeationMutation,
  };
}
