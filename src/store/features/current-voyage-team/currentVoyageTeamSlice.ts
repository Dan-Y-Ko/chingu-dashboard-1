import type { UserVoyageTeamMember } from "@chingu-x/modules/voyage-team";
import { createSlice } from "@reduxjs/toolkit";

const initialState: UserVoyageTeamMember[] = [];

export const currentVoyageTeamSlice = createSlice({
  name: "currentVoyageTeam",
  initialState,
  reducers: {},
});

export const {} = currentVoyageTeamSlice.actions;

export default currentVoyageTeamSlice.reducer;
