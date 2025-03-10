import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type {
  AddAgendaTopicResponseDto,
  AddMeetingResponseDto,
  AddSprintMeetingSectionResponseDto,
  ChangeAgendaTopicStatusResponseDto,
  DeleteAgendaTopicResponseDto,
  EditAgendaTopicResponseDto,
  EditMeetingResponseDto,
  EditSprintMeetingSectionResponseDto,
  Meeting,
} from "@chingu-x/modules/sprint-meeting";

const initialState: Meeting[] = [];

interface EditAgendaStatePayload {
  data: EditAgendaTopicResponseDto;
  meetingId: string;
}

interface EditSprintMeetingSectonStatePayload {
  data: EditSprintMeetingSectionResponseDto;
  meetingId: string;
  responseData: {
    title: string;
    responses: {
      question: {
        id: number;
      };
      text: string;
    }[];
  };
}

interface ChangeAgendaTopicStatusStatePayload {
  data: ChangeAgendaTopicStatusResponseDto;
  meetingId: string;
}

type AddSprintMeetingSectionStatePayload =
  AddSprintMeetingSectionResponseDto & {
    title: string;
    responses: {
      question: {
        id: number;
      };
      text: string;
    }[];
  };

export const sprintMeetingSlice = createSlice({
  name: "sprintMeeting",
  initialState,
  reducers: {
    fetchMeeting: (state, action: PayloadAction<Meeting>) => {
      const meeting = state.find((meeting) => meeting.id === action.payload.id);

      if (!meeting) {
        state.push(action.payload);
      }

      return;
    },
    addMeetingState: (state, action: PayloadAction<AddMeetingResponseDto>) => {
      const meeting = state.find((meeting) => meeting.id === action.payload.id);

      if (!meeting) {
        state.push(action.payload);
      }

      return;
    },
    editMeetingState: (state, action: PayloadAction<EditMeetingResponseDto>) =>
      state.map((meeting) => {
        if (meeting.id === action.payload.id) {
          return { ...meeting, ...action.payload };
        } else {
          return meeting;
        }
      }),
    addAgendaState: (
      state,
      action: PayloadAction<AddAgendaTopicResponseDto>,
    ) => {
      const { teamMeetingId } = action.payload;

      const meeting = state.find((m) => m.id === teamMeetingId);

      if (!meeting?.agendas) {
        meeting!.agendas = [];
      }

      meeting!.agendas.push(action.payload);
    },
    editAgendaState: (state, action: PayloadAction<EditAgendaStatePayload>) => {
      const { data, meetingId } = action.payload;
      const meeting = state.find((m) => m.id === Number(meetingId));

      const agendaIndex = meeting?.agendas?.findIndex(
        (agenda) => agenda.id === data.id,
      );

      if (agendaIndex !== -1) {
        meeting!.agendas![agendaIndex!] = {
          ...action.payload.data,
        };
      }
    },
    deleteAgendaState: (
      state,
      action: PayloadAction<DeleteAgendaTopicResponseDto>,
    ) => {
      const { id, teamMeetingId } = action.payload;
      const meeting = state.find((m) => m.id === teamMeetingId);

      meeting!.agendas = meeting?.agendas?.filter((agenda) => agenda.id !== id);
    },
    addSprintMeetingSectionState: (
      state,
      action: PayloadAction<AddSprintMeetingSectionStatePayload>,
    ) => {
      const { meetingId, id, formId, responses, title } = action.payload;

      const meeting = state.find((m) => m.id === Number(meetingId));

      if (meeting && !meeting?.formResponseMeeting) {
        meeting.formResponseMeeting = [];
      }

      meeting?.formResponseMeeting?.push({
        id,
        form: {
          id: formId,
          title,
        },
        responseGroup: {
          responses: responses.map((response) => ({
            question: {
              id: response.question.id,
            },
            text: "",
          })),
        },
      });
    },
    editSprintMeetingSectonState: (
      state,
      action: PayloadAction<EditSprintMeetingSectonStatePayload>,
    ) => {
      const { data, meetingId, responseData } = action.payload;
      const meeting = state.find((m) => m.id === Number(meetingId));

      const formResponse = meeting?.formResponseMeeting?.find(
        (meeting) => meeting.form.title === responseData.title,
      );

      if (formResponse?.responseGroup.responses.length === 0) {
        formResponse.responseGroup.responses.push(
          ...responseData.responses.map((response) => ({
            question: {
              id: response.question.id,
            },
            text: "",
          })),
        );
      }

      data.forEach((updatedResponse) => {
        const formMeetingIndex = meeting!.formResponseMeeting!.findIndex(
          (formMeeting) =>
            formMeeting.responseGroup.responses.some(
              (r) => r.question.id === updatedResponse.questionId,
            ),
        );

        const formMeeting = meeting!.formResponseMeeting![formMeetingIndex];

        const responseIndex = formMeeting.responseGroup.responses.findIndex(
          (r) => r.question.id === updatedResponse.questionId,
        );

        formMeeting.responseGroup.responses[responseIndex].text =
          updatedResponse.text;
      });
    },
    changeAgendaTopicStatusState: (
      state,
      action: PayloadAction<ChangeAgendaTopicStatusStatePayload>,
    ) => {
      const { data, meetingId } = action.payload;
      const meeting = state.find((m) => m.id === Number(meetingId));

      const agendaIndex = meeting?.agendas?.findIndex(
        (agenda) => agenda.id === data.id,
      );

      meeting!.agendas![agendaIndex!].status = data.status;
    },
  },
});

export const {
  fetchMeeting,
  addMeetingState,
  editMeetingState,
  addAgendaState,
  editAgendaState,
  deleteAgendaState,
  editSprintMeetingSectonState,
  changeAgendaTopicStatusState,
  addSprintMeetingSectionState,
} = sprintMeetingSlice.actions;

export default sprintMeetingSlice.reducer;
