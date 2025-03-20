import type { Features, FeaturesList } from "@chingu-x/modules/features";
import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: FeaturesList = [];

export const featuresSlice = createSlice({
  name: "features",
  initialState,
  reducers: {
    fetchFeatures: (_, action: PayloadAction<FeaturesList>) => action.payload,
    addFeatureState: (state, action: PayloadAction<Features>) => {
      const featureIndex = state.findIndex(
        (feature) => feature.categoryId === action.payload.category.id,
      );

      state[featureIndex].features.push(action.payload);
    },
  },
});

export const { fetchFeatures, addFeatureState } = featuresSlice.actions;

export default featuresSlice.reducer;
