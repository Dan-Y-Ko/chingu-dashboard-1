import type {
  RemoveIdeationVoteClientRequestDto,
  RemoveIdeationVoteResponseDto,
} from "@chingu-x/modules/ideation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRemoveIdeationVote } from "./useIdeationAdapters";
import { useAppDispatch } from "@/shared/store";
import { CacheTag } from "@/shared/utils/cacheTag";
import { onOpenModal } from "@/store/features/modal/modalSlice";

interface UseRemoveIdeationVoteMutationProps {
  teamId: string;
}

export function useRemoveIdeationVoteMutation({
  teamId,
}: UseRemoveIdeationVoteMutationProps) {
  const dispatch = useAppDispatch();
  const { removeIdeationVote } = useRemoveIdeationVote();
  const queryClient = useQueryClient();

  const {
    mutate: removeIdeationVoteMutation,
    isPending: isRemoveIdeationVotePending,
  } = useMutation<
    RemoveIdeationVoteResponseDto,
    Error,
    RemoveIdeationVoteClientRequestDto
  >({
    mutationFn: removeIdeationVoteMutationFn,
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

  async function removeIdeationVoteMutationFn({
    ideationId,
  }: RemoveIdeationVoteClientRequestDto): Promise<RemoveIdeationVoteResponseDto> {
    return await removeIdeationVote({
      ideationId,
    });
  }

  return {
    isRemoveIdeationVotePending,
    removeIdeationVoteMutation,
  };
}
