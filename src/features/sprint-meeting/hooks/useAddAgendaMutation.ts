import type {
  AddAgendaTopicClientRequestDto,
  AddAgendaTopicResponseDto,
} from "@chingu-x/modules/sprint-meeting";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAddAgendaTopic } from "@/features/sprint-meeting/hooks/useSprintMeetingAdapters";
import { useAppDispatch } from "@/shared/store";
import routePaths from "@/shared/utils/routePaths";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { addAgendaState } from "@/features/sprint-meeting/store/sprintMeetingSlice";

interface UseAddAgendaMutationProps {
  teamId: string;
  sprintNumber: string;
  meetingId: string;
}

export function useAddAgendaMutation({
  teamId,
  sprintNumber,
  meetingId,
}: UseAddAgendaMutationProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { addAgendaTopic } = useAddAgendaTopic();

  const { mutate: addAgendaMutation, isPending: isAddAgendaPending } =
    useMutation<
      AddAgendaTopicResponseDto,
      Error,
      AddAgendaTopicClientRequestDto
    >({
      mutationFn: addAgendaMutationFn,
      onSuccess: (data) => {
        dispatch(addAgendaState(data));

        router.push(routePaths.sprintWeekPage(teamId, sprintNumber, meetingId));
      },
      onError: (error: Error) => {
        dispatch(
          onOpenModal({ type: "error", content: { message: error.message } }),
        );
      },
    });

  async function addAgendaMutationFn({
    meetingId,
    title,
    description,
  }: AddAgendaTopicClientRequestDto): Promise<AddAgendaTopicResponseDto> {
    return await addAgendaTopic({
      meetingId,
      title,
      description,
    });
  }

  return {
    isAddAgendaPending,
    addAgendaMutation,
  };
}
