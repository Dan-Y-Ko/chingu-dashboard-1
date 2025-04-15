import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  FinalizeIdeationClientRequestDto,
  FinalizeIdeationResponseDto,
} from "@chingu-x/modules/ideation";
import { useRouter } from "next/navigation";
import { useFinalizeIdeation } from "./useIdeationAdapters";
import { useAppDispatch } from "@/shared/store";
import { CacheTag } from "@/shared/utils/cacheTag";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import routePaths from "@/shared/utils/routePaths";

interface UseFinalizeIdeationMutationProps {
  teamId: string;
}

export function useFinalizeIdeationMutation({
  teamId,
}: UseFinalizeIdeationMutationProps) {
  const dispatch = useAppDispatch();
  const { finalizeIdeation } = useFinalizeIdeation();
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    mutate: finalizeIdeationMutation,
    isPending: isFinalizeIdeationPending,
  } = useMutation<
    FinalizeIdeationResponseDto,
    Error,
    FinalizeIdeationClientRequestDto
  >({
    mutationFn: finalizeIdeationMutationFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [CacheTag.ideation, { teamId }],
      });

      router.push(routePaths.ideationPage(teamId.toString()));
    },
    onError: (error: Error) => {
      dispatch(
        onOpenModal({ type: "error", content: { message: error.message } }),
      );
    },
  });

  async function finalizeIdeationMutationFn({
    teamId,
    ideationId,
  }: FinalizeIdeationClientRequestDto): Promise<FinalizeIdeationResponseDto> {
    return await finalizeIdeation({
      teamId,
      ideationId,
    });
  }

  return {
    isFinalizeIdeationPending,
    finalizeIdeationMutation,
  };
}
