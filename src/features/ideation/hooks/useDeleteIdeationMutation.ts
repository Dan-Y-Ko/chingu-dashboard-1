import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  DeleteIdeationClientRequestDto,
  DeleteIdeationResponseDto,
} from "@chingu-x/modules/ideation";
import { useRouter } from "next/navigation";
import { useDeleteIdeation } from "./useIdeationAdapters";
import { useAppDispatch } from "@/shared/store";
import { CacheTag } from "@/shared/utils/cacheTag";
import { onCloseModal, onOpenModal } from "@/store/features/modal/modalSlice";
import routePaths from "@/shared/utils/routePaths";

interface UseDeleteIdeationMutationProps {
  teamId: string;
}

export function useDeleteIdeationMutation({
  teamId,
}: UseDeleteIdeationMutationProps) {
  const dispatch = useAppDispatch();
  const { deleteIdeation } = useDeleteIdeation();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: deleteIdeationMutation } = useMutation<
    DeleteIdeationResponseDto,
    Error,
    DeleteIdeationClientRequestDto
  >({
    mutationFn: deleteIdeationMutationFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [CacheTag.ideation, { teamId }],
      });

      dispatch(onCloseModal());
      router.push(routePaths.ideationPage(teamId.toString()));
    },
    onError: (error: Error) => {
      dispatch(
        onOpenModal({ type: "error", content: { message: error.message } }),
      );
    },
  });

  async function deleteIdeationMutationFn({
    ideationId,
  }: DeleteIdeationClientRequestDto): Promise<DeleteIdeationResponseDto> {
    return await deleteIdeation({
      ideationId,
    });
  }

  return {
    deleteIdeationMutation,
  };
}
