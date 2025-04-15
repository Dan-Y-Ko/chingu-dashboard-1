import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  AddIdeationClientRequestDto,
  AddIdeationResponseDto,
} from "@chingu-x/modules/ideation";
import { useAddIdeation } from "./useIdeationAdapters";
import { useAppDispatch } from "@/shared/store";
import { CacheTag } from "@/shared/utils/cacheTag";
import { onOpenModal } from "@/store/features/modal/modalSlice";

interface UseAddIdeationMutationProps {
  teamId: string;
}

export function useAddIdeationMutation({
  teamId,
}: UseAddIdeationMutationProps) {
  const dispatch = useAppDispatch();
  const { addIdeation } = useAddIdeation();
  const queryClient = useQueryClient();

  const { mutate: addIdeationMutation, isPending: isAddIdeationPending } =
    useMutation<AddIdeationResponseDto, Error, AddIdeationClientRequestDto>({
      mutationFn: addIdeationMutationFn,
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

  async function addIdeationMutationFn({
    teamId,
    title,
    description,
    vision,
  }: AddIdeationClientRequestDto): Promise<AddIdeationResponseDto> {
    return await addIdeation({
      teamId,
      title,
      description,
      vision,
    });
  }

  return {
    isAddIdeationPending,
    addIdeationMutation,
  };
}
