import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  RemoveTechStackItemVoteClientRequestDto,
  RemoveTechStackItemVoteResponseDto,
} from "@chingu-x/modules/tech-stack";
import { useRemoveTechStackVote } from "./useTechStackAdapters";
import { useAppDispatch } from "@/shared/store";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { CacheTag } from "@/shared/utils/cacheTag";

interface UseRemoveTechStackVoteMutationProps {
  teamId: string;
}

export function useRemoveTechStackVoteMutation({
  teamId,
}: UseRemoveTechStackVoteMutationProps) {
  const dispatch = useAppDispatch();
  const { removeTechStackVote } = useRemoveTechStackVote();
  const queryClient = useQueryClient();

  const {
    mutate: removeTechStackVoteMutation,
    isPending: isRemoveTechStackVotePending,
  } = useMutation<
    RemoveTechStackItemVoteResponseDto,
    Error,
    RemoveTechStackItemVoteClientRequestDto
  >({
    mutationFn: removeTechStackVoteMutationFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [CacheTag.techStack, { teamId }],
      });
    },
    onError: (error: Error) => {
      dispatch(
        onOpenModal({ type: "error", content: { message: error.message } }),
      );
    },
  });

  async function removeTechStackVoteMutationFn({
    teamTechItemId,
  }: RemoveTechStackItemVoteClientRequestDto): Promise<RemoveTechStackItemVoteResponseDto> {
    return await removeTechStackVote({
      teamTechItemId,
    });
  }

  return {
    isRemoveTechStackVotePending,
    removeTechStackVoteMutation,
  };
}
