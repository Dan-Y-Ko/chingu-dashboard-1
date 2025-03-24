import type {
  EditMeetingClientRequestDto,
  EditMeetingResponseDto,
} from "@chingu-x/modules/sprint-meeting";
import { useMutation } from "@tanstack/react-query";
import { useEditMeetingNotes } from "./useSprintMeetingAdapters";
import { useAppDispatch } from "@/shared/store";
import { editMeetingState } from "@/store/features/sprint-meeting/sprintMeetingSlice";
import { onOpenModal } from "@/store/features/modal/modalSlice";

export function useEditMeetingNotesMutation() {
  const dispatch = useAppDispatch();

  const { editMeetingNotes } = useEditMeetingNotes();

  const {
    mutate: editMeetingNotesMutation,
    isPending: isEditMeetingNotesPending,
  } = useMutation<EditMeetingResponseDto, Error, EditMeetingClientRequestDto>({
    mutationFn: editMeetingNotesMutationFn,
    onSuccess: (data) => {
      dispatch(editMeetingState(data));
    },
    onError: (error: Error) => {
      dispatch(
        onOpenModal({ type: "error", content: { message: error.message } }),
      );
    },
  });

  async function editMeetingNotesMutationFn({
    meetingId,
    ...data
  }: EditMeetingClientRequestDto): Promise<EditMeetingResponseDto> {
    return await editMeetingNotes({ meetingId, ...data });
  }

  return {
    isEditMeetingNotesPending,
    editMeetingNotesMutation,
  };
}
