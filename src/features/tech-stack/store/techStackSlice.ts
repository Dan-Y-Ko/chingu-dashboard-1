import type { TechStackCategory } from "@chingu-x/modules/tech-stack";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface TechStackState {
  techStack: TechStackCategory[];
}
const initialState: TechStackState = {
  techStack: [],
};

export const techStackSlice = createSlice({
  name: "tech-stack",
  initialState,
  reducers: {
    fetchTechStackState: (
      state,
      action: PayloadAction<TechStackCategory[]>,
    ) => {
      state.techStack = action.payload;
    },
  },
});

export const { fetchTechStackState } = techStackSlice.actions;
export default techStackSlice.reducer;
