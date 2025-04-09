import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  AddTechStackItemVoteClientRequestDto,
  AddTechStackItemVoteResponseDto,
} from "@chingu-x/modules/tech-stack";
import { useAddTechStackVote } from "./useTechStackAdapters";
import { useAppDispatch } from "@/shared/store";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { CacheTag } from "@/shared/utils/cacheTag";

interface UseAddTechStackVoteMutationProps {
  teamId: string;
}

export function useAddTechStackVoteMutation({
  teamId,
}: UseAddTechStackVoteMutationProps) {
  const dispatch = useAppDispatch();
  const { addTechStackVote } = useAddTechStackVote();
  const queryClient = useQueryClient();

  const {
    mutate: addTechStackVoteMutation,
    isPending: isAddTechStackVotePending,
  } = useMutation<
    AddTechStackItemVoteResponseDto,
    Error,
    AddTechStackItemVoteClientRequestDto
  >({
    mutationFn: addTechStackVoteMutationFn,
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

  async function addTechStackVoteMutationFn({
    teamTechItemId,
  }: AddTechStackItemVoteClientRequestDto): Promise<AddTechStackItemVoteResponseDto> {
    return await addTechStackVote({
      teamTechItemId,
    });
  }

  return {
    isAddTechStackVotePending,
    addTechStackVoteMutation,
  };
}
