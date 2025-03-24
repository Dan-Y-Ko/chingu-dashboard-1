import type {
  EditMeetingClientRequestDto,
  EditMeetingResponseDto,
} from "@chingu-x/modules/sprint-meeting";
import { useMutation } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import { useAddSprintMeetingNotesSection } from "./useSprintMeetingAdapters";
import { useAppDispatch } from "@/shared/store";
import { onOpenModal } from "@/store/features/modal/modalSlice";

interface UseAddSprintMeetingNotesSectionMutationProps {
  reorderSections: ((title: string) => void) | undefined;
  title: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function useAddSprintMeetingNotesSectionMutation({
  reorderSections,
  title,
  setIsOpen,
}: UseAddSprintMeetingNotesSectionMutationProps) {
  const dispatch = useAppDispatch();

  const { addSprintMeetingNotesSection } = useAddSprintMeetingNotesSection();

  const {
    mutate: addSprintMeetingNotesSectionMutation,
    isPending: isaddSprintMeetingNotesSectionPending,
  } = useMutation<EditMeetingResponseDto, Error, EditMeetingClientRequestDto>({
    mutationFn: editMeetingMutationFn,
    onSuccess: () => {
      reorderSections && reorderSections(title);
      setIsOpen(true);
    },
    onError: (error: Error) => {
      dispatch(
        onOpenModal({ type: "error", content: { message: error.message } }),
      );
    },
  });
  async function editMeetingMutationFn({
    meetingId,
    notes,
  }: EditMeetingClientRequestDto): Promise<EditMeetingResponseDto> {
    return await addSprintMeetingNotesSection({ meetingId, notes });
  }

  return {
    isaddSprintMeetingNotesSectionPending,
    addSprintMeetingNotesSectionMutation,
  };
}
