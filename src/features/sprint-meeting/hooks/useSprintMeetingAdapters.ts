import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type {
  AddSprintMeetingSectionClientRequestDto,
  EditMeetingClientRequestDto,
  FetchSprintMeetingFormClientRequestDto,
  GetSprintMeetingSectionResponsesClientRequestDto,
  SprintMeetingClientAdapter,
} from "@chingu-x/modules/sprint-meeting";
import { useSprintMeetingStateSelector } from "./useSprintMeetingStateSelector";

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

interface UseGetSprintMeetingProps {
  meetingId: string;
}

export function useGetSprintMeeting({ meetingId }: UseGetSprintMeetingProps) {
  const sprintMeeting = useSprintMeetingStateSelector();

  const meeting = sprintMeetingAdapter.getSprintMeeting({
    meeting: sprintMeeting,
    meetingId,
  });

  return { meeting };
}

interface UseGetSprintMeetingNotesProps {
  meetingId: string;
}

export function useGetSprintMeetingNotes({
  meetingId,
}: UseGetSprintMeetingNotesProps) {
  const sprintMeeting = useSprintMeetingStateSelector();

  const meetingNotes = sprintMeetingAdapter.getSprintMeeting({
    meeting: sprintMeeting,
    meetingId,
  }).notes;

  return { meetingNotes };
}

export function useGetSprintMeetingSectionResponses() {
  const getSprintMeetingSectionResponses = ({
    sprintMeetingForm,
  }: GetSprintMeetingSectionResponsesClientRequestDto) =>
    sprintMeetingAdapter.getSprintMeetingSectionResponses({
      sprintMeetingForm,
    });

  return { getSprintMeetingSectionResponses };
}

export function useAddSprintMeetingPlanningReviewSection() {
  const addSprintMeetingPlanningReviewSection = async ({
    meetingId,
    formId,
  }: AddSprintMeetingSectionClientRequestDto) =>
    await sprintMeetingAdapter.addSprintMeetingSection({
      meetingId,
      formId,
    });

  return { addSprintMeetingPlanningReviewSection };
}
