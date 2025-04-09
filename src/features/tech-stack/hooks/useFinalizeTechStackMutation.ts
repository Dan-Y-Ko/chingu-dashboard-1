import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  FinalizeTechStackClientRequestDto,
  FinalizeTechStackResponseDto,
} from "@chingu-x/modules/tech-stack";
import { useFinalizeTechStack } from "./useTechStackAdapters";
import { useAppDispatch } from "@/shared/store";
import { CacheTag } from "@/shared/utils/cacheTag";
import { onOpenModal } from "@/store/features/modal/modalSlice";

interface UseFinalizeTechStackMutationProps {
  teamId: string;
}

export function useFinalizeTechStackMutation({
  teamId,
}: UseFinalizeTechStackMutationProps) {
  const dispatch = useAppDispatch();
  const { finalizeTechStack } = useFinalizeTechStack();
  const queryClient = useQueryClient();

  const {
    mutate: finalizeTechStackMutation,
    isPending: isFinalizeTechStackPending,
  } = useMutation<
    FinalizeTechStackResponseDto,
    Error,
    FinalizeTechStackClientRequestDto
  >({
    mutationFn: finalizeTechStackMutationFn,
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

  async function finalizeTechStackMutationFn({
    techId,
    isSelected,
  }: FinalizeTechStackClientRequestDto): Promise<FinalizeTechStackResponseDto> {
    return await finalizeTechStack({
      techId,
      isSelected,
    });
  }

  return {
    isFinalizeTechStackPending,
    finalizeTechStackMutation,
  };
}
