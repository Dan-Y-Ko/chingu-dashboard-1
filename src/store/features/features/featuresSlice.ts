import type {
  EditFeatureClientResponseDto,
  Features,
  FeaturesList,
} from "@chingu-x/modules/features";
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
    editFeatureState: (
      state,
      action: PayloadAction<EditFeatureClientResponseDto>,
    ) => {
      const category = state.find(
        (feature) => feature.categoryId === action.payload.featureCategoryId,
      );

      const feature = category!.features.find(
        (feature) => feature.id === action.payload.id,
      );

      feature!.description = action.payload.description;
      feature!.updatedAt = action.payload.updatedAt;
    },
  },
});

export const { fetchFeatures, addFeatureState, editFeatureState } =
  featuresSlice.actions;

export default featuresSlice.reducer;
