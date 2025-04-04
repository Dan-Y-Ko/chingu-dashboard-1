import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { VoyageResource } from "@chingu-x/modules/voyage-resources";

const initialState: {
  voyageResources: VoyageResource[];
} = {
  voyageResources: [],
};

export const resourcesSlice = createSlice({
  name: "resources",
  initialState,
  reducers: {
    fetchResourcesState: (state, action: PayloadAction<VoyageResource[]>) => {
      state.voyageResources = action.payload;
    },
  },
});

export const { fetchResourcesState } = resourcesSlice.actions;

export default resourcesSlice.reducer;
