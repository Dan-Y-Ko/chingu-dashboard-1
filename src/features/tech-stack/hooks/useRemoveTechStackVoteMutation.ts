import { useMutation } from "@tanstack/react-query";
import type {
  RemoveTechStackItemVoteClientRequestDto,
  RemoveTechStackItemVoteResponseDto,
} from "@chingu-x/modules/tech-stack";
import { useRemoveTechStackVote } from "./useTechStackAdapters";
import { useAppDispatch } from "@/shared/store";
import { onOpenModal } from "@/store/features/modal/modalSlice";

export function useRemoveTechStackVoteMutation() {
  const dispatch = useAppDispatch();
  const { removeTechStackVote } = useRemoveTechStackVote();

  const {
    mutate: removeTechStackVoteMutation,
    isPending: isRemoveTechStackVotePending,
  } = useMutation<
    RemoveTechStackItemVoteResponseDto,
    Error,
    RemoveTechStackItemVoteClientRequestDto
  >({
    mutationFn: removeTechStackVoteMutationFn,
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
