import type {
  SubmitWeeklyCheckinClientRequestDto,
  SubmitWeeklyCheckinResponseDto,
} from "@chingu-x/modules/sprints";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSubmitWeeklyCheckin } from "./useSprintsAdapters";
import { useAppDispatch } from "@/shared/store";
import { CacheTag } from "@/shared/utils/cacheTag";
import routePaths from "@/shared/utils/routePaths";
import { submitWeeklyCheckinState } from "@/features/sprints/store/sprintSlice";
import { onOpenModal } from "@/store/features/modal/modalSlice";

interface UseSubmitWeeklyCheckinFormMutationProps {
  teamId: string;
  sprintNumber: string;
  sprintId: number;
}

export function useSubmitWeeklyCheckinFormMutation({
  teamId,
  sprintNumber,
  sprintId,
}: UseSubmitWeeklyCheckinFormMutationProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { submitWeeklyCheckin } = useSubmitWeeklyCheckin();

  const {
    mutate: submitWeeklyCheckinMutation,
    isPending: isSubmitWeeklyCheckinMutationPending,
  } = useMutation<
    SubmitWeeklyCheckinResponseDto,
    Error,
    SubmitWeeklyCheckinClientRequestDto
  >({
    mutationFn: submitWeeklyCheckinFormMutation,
    mutationKey: [CacheTag.submitWeeklyCheckinForm],
    onSuccess: () => {
      router.push(routePaths.emptySprintPage(teamId, sprintNumber));
      dispatch(submitWeeklyCheckinState({ sprintId }));
      dispatch(onOpenModal({ type: "checkInSuccess" }));
    },
    onError: (error: Error) => {
      dispatch(
        onOpenModal({ type: "error", content: { message: error.message } }),
      );
    },
  });

  async function submitWeeklyCheckinFormMutation({
    data,
    questions,
    voyageTeamMemberId,
    sprintId,
  }: SubmitWeeklyCheckinClientRequestDto): Promise<SubmitWeeklyCheckinResponseDto> {
    return await submitWeeklyCheckin({
      data,
      questions,
      voyageTeamMemberId,
      sprintId,
    });
  }

  return {
    isSubmitWeeklyCheckinMutationPending,
    submitWeeklyCheckinMutation,
  };
}
