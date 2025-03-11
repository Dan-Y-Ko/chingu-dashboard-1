import type { UserVoyageTeamMember } from "@chingu-x/modules/voyage-team";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: UserVoyageTeamMember[] = [];

export const currentVoyageTeamSlice = createSlice({
  name: "currentVoyageTeam",
  initialState,
  reducers: {
    setCurrentVoyageTeam: (_, action: PayloadAction<UserVoyageTeamMember[]>) =>
      action.payload,
  },
});

export const { setCurrentVoyageTeam } = currentVoyageTeamSlice.actions;

export default currentVoyageTeamSlice.reducer;
