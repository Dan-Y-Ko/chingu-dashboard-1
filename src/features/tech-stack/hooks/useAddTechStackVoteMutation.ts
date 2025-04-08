import { useMutation } from "@tanstack/react-query";
import type {
  AddTechStackItemVoteClientRequestDto,
  AddTechStackItemVoteResponseDto,
} from "@chingu-x/modules/tech-stack";
import { useAddTechStackVote } from "./useTechStackAdapters";
import { useAppDispatch } from "@/shared/store";
import { onOpenModal } from "@/store/features/modal/modalSlice";

export function useAddTechStackVoteMutation() {
  const dispatch = useAppDispatch();
  const { addTechStackVote } = useAddTechStackVote();

  const {
    mutate: addTechStackVoteMutation,
    isPending: isAddTechStackVotePending,
  } = useMutation<
    AddTechStackItemVoteResponseDto,
    Error,
    AddTechStackItemVoteClientRequestDto
  >({
    mutationFn: addTechStackVoteMutationFn,
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
