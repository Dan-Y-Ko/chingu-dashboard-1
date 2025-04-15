import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  AddIdeationVoteClientRequestDto,
  AddIdeationVoteResponseDto,
} from "@chingu-x/modules/ideation";
import { useAddIdeationVote } from "./useIdeationAdapters";
import { useAppDispatch } from "@/shared/store";
import { CacheTag } from "@/shared/utils/cacheTag";
import { onOpenModal } from "@/store/features/modal/modalSlice";

interface UseAddTechStackMutationProps {
  teamId: string;
}

export function useAddIdeationVoteMutation({
  teamId,
}: UseAddTechStackMutationProps) {
  const dispatch = useAppDispatch();
  const { addIdeationVote } = useAddIdeationVote();
  const queryClient = useQueryClient();

  const {
    mutate: addIdeationVoteMutation,
    isPending: isAddIdeationVotePending,
  } = useMutation<
    AddIdeationVoteResponseDto,
    Error,
    AddIdeationVoteClientRequestDto
  >({
    mutationFn: addIdeationVoteMutationFn,
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

  async function addIdeationVoteMutationFn({
    ideationId,
  }: AddIdeationVoteClientRequestDto): Promise<AddIdeationVoteResponseDto> {
    return await addIdeationVote({
      ideationId,
    });
  }

  return {
    isAddIdeationVotePending,
    addIdeationVoteMutation,
  };
}
