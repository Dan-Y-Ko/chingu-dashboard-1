import type {
  DeleteAgendaTopicClientRequestDto,
  DeleteAgendaTopicResponseDto,
} from "@chingu-x/modules/sprint-meeting";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDeleteAgendaTopic } from "./useSprintMeetingAdapters";
import { useAppDispatch } from "@/shared/store";
import routePaths from "@/shared/utils/routePaths";
import { onCloseModal, onOpenModal } from "@/store/features/modal/modalSlice";
import { deleteAgendaState } from "@/store/features/sprint-meeting/sprintMeetingSlice";

interface UseDeleteAgendaMutationProps {
  teamId: string;
  sprintNumber: string;
  meetingId: string;
}

export function useDeleteAgendaMutation({
  teamId,
  sprintNumber,
  meetingId,
}: UseDeleteAgendaMutationProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { deleteAgendaTopic } = useDeleteAgendaTopic();

  const {
    mutate: deleteAgendaMutation,
  } = useMutation<
    DeleteAgendaTopicResponseDto,
    Error,
    DeleteAgendaTopicClientRequestDto
  >({
    mutationFn: deleteAgendaMutationFn,
    onSuccess: (data) => {
      dispatch(deleteAgendaState(data));
      dispatch(onCloseModal());
      router.push(routePaths.sprintWeekPage(teamId, sprintNumber, meetingId));
    },
    onError: (error: Error) => {
      dispatch(
        onOpenModal({ type: "error", content: { message: error.message } }),
      );
    },
  });

  async function deleteAgendaMutationFn({
    agendaId,
  }: DeleteAgendaTopicClientRequestDto): Promise<DeleteAgendaTopicResponseDto> {
    return await deleteAgendaTopic({ agendaId });
  }

  return {
    deleteAgendaMutation,
  };
}
