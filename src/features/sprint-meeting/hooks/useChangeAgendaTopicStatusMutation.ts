import { useMutation } from "@tanstack/react-query";
import type {
  ChangeAgendaTopicStatusClientRequestDto,
  ChangeAgendaTopicStatusResponseDto,
} from "@chingu-x/modules/sprint-meeting";
import { useChangeAgendaTopicStatus } from "./useSprintMeetingAdapters";
import { useAppDispatch } from "@/shared/store";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { changeAgendaTopicStatusState } from "@/features/sprint-meeting/store/sprintMeetingSlice";

interface UseChangeAgendaTopicStatusMutationProps {
  meetingId: string;
}

export function useChangeAgendaTopicStatusMutation({
  meetingId,
}: UseChangeAgendaTopicStatusMutationProps) {
  const dispatch = useAppDispatch();
  const { changeAgendaTopicStatus } = useChangeAgendaTopicStatus();

  const {
    mutate: changeAgendaTopicStatusMutation,
    isPending: isChangeAgendaTopicStatusPending,
  } = useMutation<
    ChangeAgendaTopicStatusResponseDto,
    Error,
    ChangeAgendaTopicStatusClientRequestDto
  >({
    mutationFn: changeAgendaTopicStatusMutationFn,
    onSuccess: (data) => {
      dispatch(changeAgendaTopicStatusState({ data, meetingId }));
    },
    onError: (error: Error) => {
      dispatch(
        onOpenModal({ type: "error", content: { message: error.message } }),
      );
    },
  });

  async function changeAgendaTopicStatusMutationFn({
    status,
    agendaId,
  }: ChangeAgendaTopicStatusClientRequestDto): Promise<ChangeAgendaTopicStatusResponseDto> {
    return await changeAgendaTopicStatus({
      status,
      agendaId,
    });
  }

  return {
    isChangeAgendaTopicStatusPending,
    changeAgendaTopicStatusMutation,
  };
}
