import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type {
  EditMeetingClientRequestDto,
  FetchSprintMeetingFormClientRequestDto,
  SprintMeetingClientAdapter,
} from "@chingu-x/modules/sprint-meeting";

export const sprintMeetingAdapter = resolve<SprintMeetingClientAdapter>(
  TYPES.SprintMeetingClientAdapter,
);

export function useFetchSprintMeetingForm() {
  const fetchSprintMeetingForm = async ({
    meetingId,
    formId,
  }: FetchSprintMeetingFormClientRequestDto) =>
    await sprintMeetingAdapter.fetchSprintMeetingForm({
      meetingId,
      formId,
    });

  return { fetchSprintMeetingForm };
}

export function useEditMeetingNotes() {
  const editMeetingNotes = async ({
    meetingId,
    ...data
  }: EditMeetingClientRequestDto) =>
    await sprintMeetingAdapter.editMeeting({
      meetingId,
      ...data,
    });

  return { editMeetingNotes };
}
