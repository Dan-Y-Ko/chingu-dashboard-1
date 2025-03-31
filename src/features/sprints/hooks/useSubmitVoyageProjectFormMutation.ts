import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import type {
  SubmitVoyageProjectClientRequestDto,
  SubmitVoyageProjectResponseDto,
} from "@chingu-x/modules/sprints";
import { useSubmitVoyageProjectForm } from "./useSprintsAdapters";
import { useAppDispatch } from "@/shared/store";
import { CacheTag } from "@/shared/utils/cacheTag";
import routePaths from "@/shared/utils/routePaths";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { submitVoyageProjectState } from "@/features/sprints/store/sprintSlice";

interface UseSubmitVoyageProjectFormMutationProps {
  teamId: string;
  sprintNumber: string;
}

export function useSubmitVoyageProjectFormMutation({
  teamId,
  sprintNumber,
}: UseSubmitVoyageProjectFormMutationProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { submitVoyageProject } = useSubmitVoyageProjectForm();

  const {
    mutate: submitVoyageProjectMutation,
    isPending: isSubmitVoyageProjectMutationPending,
  } = useMutation<
    SubmitVoyageProjectResponseDto,
    Error,
    SubmitVoyageProjectClientRequestDto
  >({
    mutationFn: submitVoyageProjectFormMutationFn,
    mutationKey: [CacheTag.submitVoyageProjectForm],
    onSuccess: () => {
      router.replace(
        routePaths.emptySprintPage(teamId.toString(), sprintNumber),
      );
      dispatch(submitVoyageProjectState({ teamId: Number(teamId) }));
    },
    onError: (error: Error) => {
      dispatch(
        onOpenModal({ type: "error", content: { message: error.message } }),
      );
    },
  });

  async function submitVoyageProjectFormMutationFn({
    data,
    questions,
    voyageTeamId,
  }: SubmitVoyageProjectClientRequestDto): Promise<SubmitVoyageProjectResponseDto> {
    return await submitVoyageProject({
      data,
      questions,
      voyageTeamId,
    });
  }

  return {
    isSubmitVoyageProjectMutationPending,
    submitVoyageProjectMutation,
  };
}
