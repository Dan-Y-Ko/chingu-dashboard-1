import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type {
  AddAgendaTopicClientRequestDto,
  AddMeetingClientRequestDto,
  AddSprintMeetingSectionClientRequestDto,
  Agenda,
  ChangeAgendaTopicStatusClientRequestDto,
  DeleteAgendaTopicClientRequestDto,
  EditAgendaTopicClientRequestDto,
  EditMeetingClientRequestDto,
  EditSprintPlanningSectionClientRequestDto,
  EditSprintReviewSectionClientRequestDto,
  FetchMeetingClientRequestDto,
  FetchSprintMeetingFormClientRequestDto,
  GetAgendaByIdClientRequestDto,
  GetSprintMeetingIdClientRequesDto,
  GetSprintMeetingSectionResponsesClientRequestDto,
  Meeting,
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

export function useAddSprintMeetingNotesSection() {
  const addSprintMeetingNotesSection = async ({
    meetingId,
    notes,
  }: EditMeetingClientRequestDto) =>
    await sprintMeetingAdapter.editMeeting({
      meetingId,
      notes,
    });

  return { addSprintMeetingNotesSection };
}

export function useGetSprintMeetingId() {
  const getSprintMeetingId = ({
    sprints,
    sprintNumber,
  }: GetSprintMeetingIdClientRequesDto) =>
    sprintMeetingAdapter.getSprintMeetingId({
      sprints,
      sprintNumber,
    });

  return { getSprintMeetingId };
}

interface UseGetSprintAgendasProps {
  meetingId: string;
}

export function useGetSprintAgendas({ meetingId }: UseGetSprintAgendasProps) {
  const sprintMeeting = useSprintMeetingStateSelector();

  const agendas =
    sprintMeetingAdapter.getSprintMeeting({
      meeting: sprintMeeting,
      meetingId,
    })?.agendas ?? [];

  return { agendas };
}

export function useFetchMeeting() {
  const fetchMeeting = async ({ meetingId }: FetchMeetingClientRequestDto) =>
    await sprintMeetingAdapter.fetchMeeting({ meetingId });

  return { fetchMeeting };
}

interface UseGetIncompletedTopicsProps {
  agendas: Agenda[];
}

export function useGetIncompletedTopics({
  agendas,
}: UseGetIncompletedTopicsProps) {
  const incompletedTopics = sprintMeetingAdapter.getIncompleteTopics({
    agendas,
  });

  return { incompletedTopics };
}

interface UseGetCompletedTopicsProps {
  agendas: Agenda[];
}

export function useGetCompletedTopics({ agendas }: UseGetCompletedTopicsProps) {
  const completedTopics = sprintMeetingAdapter.getCompletedTopics({
    agendas,
  });

  return { completedTopics };
}

export function useChangeAgendaTopicStatus() {
  const changeAgendaTopicStatus = async ({
    status,
    agendaId,
  }: ChangeAgendaTopicStatusClientRequestDto) =>
    await sprintMeetingAdapter.changeAgendaTopicStatus({
      status,
      agendaId,
    });

  return { changeAgendaTopicStatus };
}

export function useGetAgendaById() {
  const getAgendaById = ({
    meeting,
    meetingId,
    agendaId,
  }: GetAgendaByIdClientRequestDto) =>
    sprintMeetingAdapter.getAgendaById({
      meeting,
      meetingId,
      agendaId,
    });

  return { getAgendaById };
}

export function useAddMeeting() {
  const addMeeting = async ({
    data,
    teamId,
    sprintNumber,
    timezone,
  }: AddMeetingClientRequestDto) =>
    await sprintMeetingAdapter.addMeeting({
      data,
      teamId,
      sprintNumber,
      timezone,
    });

  return { addMeeting };
}

export function useEditMeeting() {
  const editMeeting = async ({
    meetingId,
    timezone,
    ...data
  }: EditMeetingClientRequestDto) =>
    await sprintMeetingAdapter.editMeeting({
      meetingId,
      timezone,
      ...data,
    });

  return { editMeeting };
}

export function useAddAgendaTopic() {
  const addAgendaTopic = async ({
    meetingId,
    title,
    description,
  }: AddAgendaTopicClientRequestDto) =>
    await sprintMeetingAdapter.addAgendaTopic({
      meetingId,
      title,
      description,
    });

  return { addAgendaTopic };
}

export function useEditAgendaTopic() {
  const editAgendaTopic = async ({
    agendaId,
    title,
    description,
  }: EditAgendaTopicClientRequestDto) =>
    await sprintMeetingAdapter.editAgendaTopic({
      agendaId,
      title,
      description,
    });

  return { editAgendaTopic };
}

export function useDeleteAgendaTopic() {
  const deleteAgendaTopic = async ({
    agendaId,
  }: DeleteAgendaTopicClientRequestDto) =>
    await sprintMeetingAdapter.deleteAgendaTopic({ agendaId });

  return { deleteAgendaTopic };
}

interface UseGetSprintPlanningQuestionsProps {
  meeting: Meeting;
}

export function useGetSprintPlanningQuestions({
  meeting,
}: UseGetSprintPlanningQuestionsProps) {
  const { goal, timeline } = sprintMeetingAdapter.getSprintPlanningQuestions({
    meeting,
  });

  return { goal, timeline };
}

export function useEditSprintPlanningSection() {
  const editSprintPlanningSection = async ({
    meetingId,
    data,
  }: EditSprintPlanningSectionClientRequestDto) =>
    await sprintMeetingAdapter.editSprintPlanningSection({
      meetingId,
      data,
    });

  return { editSprintPlanningSection };
}

export function useEditSprintReviewSection() {
  const editSprintReviewSection = async ({
    meetingId,
    data,
  }: EditSprintReviewSectionClientRequestDto) =>
    await sprintMeetingAdapter.editSprintReviewSection({
      meetingId,
      data,
    });

  return { editSprintReviewSection };
}

interface UseGetSprintReviewQuestionsProps {
  meeting: Meeting;
}

export function useGetSprintReviewQuestions({
  meeting,
}: UseGetSprintReviewQuestionsProps) {
  const { what_right, what_to_improve, what_to_change } =
    sprintMeetingAdapter.getSprintReviewQuestions({ meeting });

  return { what_right, what_to_improve, what_to_change };
}
