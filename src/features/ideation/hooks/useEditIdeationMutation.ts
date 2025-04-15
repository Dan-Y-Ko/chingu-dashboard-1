import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  EditIdeationClientRequestDto,
  EditIdeationResponseDto,
} from "@chingu-x/modules/ideation";
import { useEditIdeation } from "./useIdeationAdapters";
import { useAppDispatch } from "@/shared/store";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { CacheTag } from "@/shared/utils/cacheTag";

interface UseRemoveIdeationVoteMutationProps {
  teamId: string;
}

export function useEditIdeationMutation({
  teamId,
}: UseRemoveIdeationVoteMutationProps) {
  const dispatch = useAppDispatch();
  const { editIdeation } = useEditIdeation();
  const queryClient = useQueryClient();

  const { mutate: editIdeationMutation, isPending: isEditIdeationPending } =
    useMutation<EditIdeationResponseDto, Error, EditIdeationClientRequestDto>({
      mutationFn: editIdeationMutationFn,
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

  async function editIdeationMutationFn({
    ideationId,
  }: EditIdeationClientRequestDto): Promise<EditIdeationResponseDto> {
    return await editIdeation({
      ideationId,
    });
  }

  return {
    isEditIdeationPending,
    editIdeationMutation,
  };
}
