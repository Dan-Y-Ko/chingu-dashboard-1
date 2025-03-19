import type { FeaturesList } from "@chingu-x/modules/features";
import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: FeaturesList = [];

export const featuresSlice = createSlice({
  name: "features",
  initialState,
  reducers: {
    fetchFeatures: (_, action: PayloadAction<FeaturesList>) => action.payload,
  },
});

export const { fetchFeatures } = featuresSlice.actions;

export default featuresSlice.reducer;
