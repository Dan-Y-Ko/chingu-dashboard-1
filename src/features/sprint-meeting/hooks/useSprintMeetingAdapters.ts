import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type { SprintMeetingClientAdapter } from "@chingu-x/modules/sprint-meeting";

export const sprintMeetingAdapter = resolve<SprintMeetingClientAdapter>(
  TYPES.SprintMeetingClientAdapter,
);

interface UseFetchSprintMeetingFormProps {
  meetingId: string;
  formId: number;
}

export function useFetchSprintMeetingForm({
  meetingId,
  formId,
}: UseFetchSprintMeetingFormProps) {
  const fetchSprintMeetingForm = sprintMeetingAdapter.fetchSprintMeetingForm({
    meetingId,
    formId,
  });

  return { fetchSprintMeetingForm };
}
