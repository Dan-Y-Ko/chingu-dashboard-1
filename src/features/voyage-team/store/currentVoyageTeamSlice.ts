import type { UserVoyageTeamMember } from "@chingu-x/modules/voyage-team";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  submitVoyageProject,
  type SubmitVoyageProjectPayload,
} from "@/features/sprints/store/sprintSlice";

const initialState: UserVoyageTeamMember[] = [];

export const currentVoyageTeamSlice = createSlice({
  name: "currentVoyageTeam",
  initialState,
  reducers: {
    setCurrentVoyageTeam: (_, action: PayloadAction<UserVoyageTeamMember[]>) =>
      action.payload,
  },
  extraReducers(builder) {
    builder.addCase(
      submitVoyageProject,
      (state, action: PayloadAction<SubmitVoyageProjectPayload>) => {
        const { teamId } = action.payload;

        const currentTeam = state.find((team) => team.voyageTeamId === teamId);

        currentTeam!.voyageTeam.projectSubmitted = true;
      },
    );
  },
});

export const { setCurrentVoyageTeam } = currentVoyageTeamSlice.actions;

export default currentVoyageTeamSlice.reducer;
