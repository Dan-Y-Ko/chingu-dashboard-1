import type {
  EditAgendaTopicClientRequestDto,
  EditAgendaTopicResponseDto,
} from "@chingu-x/modules/sprint-meeting";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEditAgendaTopic } from "@/features/sprint-meeting/hooks/useSprintMeetingAdapters";
import { useAppDispatch } from "@/shared/store";
import routePaths from "@/shared/utils/routePaths";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { editAgendaState } from "@/store/features/sprint-meeting/sprintMeetingSlice";

interface UseEditAgendaMutationProps {
  teamId: string;
  sprintNumber: string;
  meetingId: string;
}

export function useEditAgendaTopicMutation({
  teamId,
  sprintNumber,
  meetingId,
}: UseEditAgendaMutationProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { editAgendaTopic } = useEditAgendaTopic();

  const { mutate: editAgendaMutation, isPending: isEditAgendaPending } =
    useMutation<
      EditAgendaTopicResponseDto,
      Error,
      EditAgendaTopicClientRequestDto
    >({
      mutationFn: editAgendaMutationFn,
      onSuccess: (data) => {
        dispatch(editAgendaState({ data, meetingId }));

        router.push(routePaths.sprintWeekPage(teamId, sprintNumber, meetingId));
      },
      onError: (error: Error) => {
        dispatch(
          onOpenModal({ type: "error", content: { message: error.message } }),
        );
      },
    });

  async function editAgendaMutationFn({
    agendaId,
    title,
    description,
  }: EditAgendaTopicClientRequestDto): Promise<EditAgendaTopicResponseDto> {
    return await editAgendaTopic({
      agendaId,
      title,
      description,
    });
  }

  return {
    isEditAgendaPending,
    editAgendaMutation,
  };
}
