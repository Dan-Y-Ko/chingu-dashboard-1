import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import { type User } from "@chingu-x/modules/user";
import { clientSignOut } from "@/features/auth/store/authSlice";
import {
  submitWeeklyCheckinState,
  type SubmitWeeklyCheckinPayload,
} from "@/features/sprints/store/sprintSlice";

const initialState: User = {
  id: "",
  firstName: "",
  lastName: "",
  countryCode: "",
  roles: [],
  oAuthProfiles: [
    {
      provider: {
        name: "discord",
      },
      providerUsername: "",
    },
  ],
  email: "",
  timezone: "",
  avatar: "",
  voyageTeamMembers: [],
  sprintCheckIn: [],
  currentDateInUserTimezone: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUserState: (state, action: PayloadAction<User>) => ({
      ...state,
      ...action.payload,
    }),
  },
  extraReducers(builder) {
    builder.addCase(clientSignOut, () => initialState);
    builder.addCase(
      submitWeeklyCheckinState,
      (state, action: PayloadAction<SubmitWeeklyCheckinPayload>) => {
        const { sprintId } = action.payload;
        state.sprintCheckIn = [...state.sprintCheckIn, sprintId];
      },
    );
  },
});

export const { getUserState } = userSlice.actions;

export default userSlice.reducer;
