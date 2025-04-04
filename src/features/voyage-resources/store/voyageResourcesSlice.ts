import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { VoyageResource } from "@chingu-x/modules/voyage-resources";

const initialState: {
  voyageResources: VoyageResource[];
} = {
  voyageResources: [],
};

export const voyageResourcesSlice = createSlice({
  name: "resources",
  initialState,
  reducers: {
    fetchResourcesState: (state, action: PayloadAction<VoyageResource[]>) => {
      state.voyageResources = action.payload;
    },
  },
});

export const { fetchResourcesState } = voyageResourcesSlice.actions;

export default voyageResourcesSlice.reducer;
