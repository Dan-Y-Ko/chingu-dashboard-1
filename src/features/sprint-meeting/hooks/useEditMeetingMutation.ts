import type {
  EditMeetingClientRequestDto,
  EditMeetingResponseDto,
} from "@chingu-x/modules/sprint-meeting";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEditMeeting } from "./useSprintMeetingAdapters";
import { useAppDispatch } from "@/shared/store";
import routePaths from "@/shared/utils/routePaths";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { editMeetingState } from "@/features/sprint-meeting/store/sprintMeetingSlice";

interface UseEditMeetingMutationProps {
  teamId: string;
  sprintNumber: string;
}

export function useEditMeetingMutation({
  teamId,
  sprintNumber,
}: UseEditMeetingMutationProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { editMeeting } = useEditMeeting();

  const { mutate: editMeetingMutation, isPending: isEditMeetingPending } =
    useMutation<EditMeetingResponseDto, Error, EditMeetingClientRequestDto>({
      mutationFn: editMeetingMutationFn,
      onSuccess: (data) => {
        router.push(
          routePaths.sprintWeekPage(teamId, sprintNumber, data.id.toString()),
        );
        dispatch(editMeetingState(data));
      },
      onError: (error: Error) => {
        dispatch(
          onOpenModal({ type: "error", content: { message: error.message } }),
        );
      },
    });

  async function editMeetingMutationFn({
    meetingId,
    timezone,
    ...data
  }: EditMeetingClientRequestDto): Promise<EditMeetingResponseDto> {
    return await editMeeting({
      meetingId,
      timezone,
      ...data,
    });
  }

  return {
    isEditMeetingPending,
    editMeetingMutation,
  };
}
