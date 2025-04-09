import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { UseMutateFunction } from "@tanstack/react-query";
import type {
  DeleteAgendaTopicClientRequestDto,
  DeleteAgendaTopicResponseDto,
} from "@chingu-x/modules/sprint-meeting";
import type {
  DeleteFeatureClientRequestDto,
  DeleteFeatureClientResponseDto,
} from "@chingu-x/modules/features";
import type {
  DeleteVoyageResourceClientRequestDto,
  DeleteVoyageResourceResponseDto,
} from "@chingu-x/modules/voyage-resources";
import type {
  DeleteTechStackItemClientRequestDto,
  DeleteTechStackItemResponseDto,
} from "@chingu-x/modules/tech-stack";

export type ModalType =
  | "error"
  | "gettingHelp"
  | "confirmation"
  | "viewResource"
  | "checkInSuccess";

interface ModalState {
  id?: number;
  type: ModalType | undefined;
  isOpen: boolean;
  content?: ContentPayload;
  payload?: DeletePayload;
}

export interface BaseModalOpenActionPayload {
  id?: number;
  type: Exclude<ModalType, "error" | "confirmation">;
  content?: ContentPayload;
  payload?: DeletePayload;
}

export interface ErrorModalOpenActionPayload
  extends Omit<BaseModalOpenActionPayload, "type"> {
  type: "error";
  content: Required<Pick<ContentPayload, "message">>;
}

export interface ConfirmationModalOpenActionPayload
  extends Omit<BaseModalOpenActionPayload, "type"> {
  type: "confirmation";
  content: Required<ContentPayload>;
  payload: Required<DeletePayload>;
}

export interface ContentPayload {
  title?: string;
  message?: string;
  confirmationText?: string;
  cancelText?: string;
}

export interface DeletePayload {
  params?: DeleteProps;
  deleteFunction?: DeleteFunctionTypes;
}

export type DeleteProps =
  | DeleteAgendaTopicProps
  | DeleteFeatureProps
  | DeleteVoyageResourcesProps
  | DeleteTechStackProps;

interface DeleteAgendaTopicProps {
  agendaId: string;
}

interface DeleteFeatureProps {
  featureId: number;
}

interface DeleteVoyageResourcesProps {
  resourceId: number;
}

interface DeleteTechStackProps {
  teamTechItemId: number;
}

type DeleteFunctionTypes =
  | UseMutateFunction<
      DeleteAgendaTopicResponseDto,
      Error,
      DeleteAgendaTopicClientRequestDto,
      unknown
    >
  | UseMutateFunction<
      DeleteFeatureClientResponseDto,
      Error,
      DeleteFeatureClientRequestDto,
      unknown
    >
  | UseMutateFunction<
      DeleteVoyageResourceResponseDto,
      Error,
      DeleteVoyageResourceClientRequestDto,
      unknown
    >
  | UseMutateFunction<
      DeleteTechStackItemResponseDto,
      Error,
      DeleteTechStackItemClientRequestDto,
      unknown
    >;

export type ModalOpenActionPayload =
  | BaseModalOpenActionPayload
  | ErrorModalOpenActionPayload
  | ConfirmationModalOpenActionPayload;

const initialState: ModalState = {
  id: 0,
  type: undefined,
  isOpen: false,
  content: {},
  payload: {},
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    onOpenModal: (
      state: ModalState,
      action: PayloadAction<ModalOpenActionPayload>,
    ) => {
      const { id, type, content, payload } = action.payload;

      state.id = id;
      state.isOpen = true;
      state.type = type;
      state.content = content;
      state.payload = payload;
    },
    onCloseModal: () => initialState,
  },
});

export const { onOpenModal, onCloseModal } = modalSlice.actions;

export default modalSlice.reducer;
