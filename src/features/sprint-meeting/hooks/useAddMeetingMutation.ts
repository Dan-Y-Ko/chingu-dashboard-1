import { useMutation } from "@tanstack/react-query";
import type {
  AddMeetingClientRequestDto,
  AddMeetingResponseDto,
} from "@chingu-x/modules/sprint-meeting";
import { useAddMeeting } from "./useSprintMeetingAdapters";
import { useAppDispatch } from "@/shared/store";
import routePaths from "@/shared/utils/routePaths";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { addMeetingState } from "@/store/features/sprint-meeting/sprintMeetingSlice";

interface UseAddMeetingMutationProps {
  teamId: string;
  sprintNumber: string;
}

export function useAddMeetingMutation({
  teamId,
  sprintNumber,
}: UseAddMeetingMutationProps) {
  const dispatch = useAppDispatch();
  const { addMeeting } = useAddMeeting();

  const { mutate: addMeetingMutation, isPending: isAddMeetingPending } =
    useMutation<AddMeetingResponseDto, Error, AddMeetingClientRequestDto>({
      mutationFn: addMeetingMutationFn,
      onSuccess: (data) => {
        dispatch(addMeetingState(data));

        // this is needed because of an issue where if user navigates to another page and then back to sprints page,
        // the redirections don't trigger properly for some reason (most likely some kind of caching as usual).
        window.location.href = routePaths.sprintWeekPage(
          teamId,
          sprintNumber,
          data.id.toString(),
        );
      },
      onError: (error: Error) => {
        dispatch(
          onOpenModal({ type: "error", content: { message: error.message } }),
        );
      },
    });

  async function addMeetingMutationFn({
    data,
    teamId,
    sprintNumber,
    timezone,
  }: AddMeetingClientRequestDto): Promise<AddMeetingResponseDto> {
    return await addMeeting({
      data,
      teamId,
      sprintNumber,
      timezone,
    });
  }

  return {
    isAddMeetingPending,
    addMeetingMutation,
  };
}
