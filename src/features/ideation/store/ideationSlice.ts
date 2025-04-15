import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { PURGE } from "redux-persist";
import type { Ideation } from "@chingu-x/modules/ideation";
import { clientSignOut } from "@/features/auth/store/authSlice";

interface IdeationState {
  projectIdeas: Ideation[];
}

const initialState: IdeationState = {
  projectIdeas: [],
};

export const ideationSlice = createSlice({
  name: "ideation",
  initialState,
  reducers: {
    fetchIdeationsState: (state, action: PayloadAction<Ideation[]>) => {
      state.projectIdeas = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(PURGE, () => {
      void storage.removeItem("persist:root");
    });
    builder.addCase(clientSignOut, () => initialState);
  },
});

export const { fetchIdeationsState } = ideationSlice.actions;

export default ideationSlice.reducer;
