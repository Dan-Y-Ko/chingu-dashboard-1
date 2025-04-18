import type { Feature, FeaturesList } from "@chingu-x/modules/features";
import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

interface SaveOrderStateDifferentCategoryStatePayload {
  sourceList: FeaturesList[number];
  destList: FeaturesList[number];
}

const initialState: FeaturesList = [];

export const featuresSlice = createSlice({
  name: "features",
  initialState,
  reducers: {
    fetchFeaturesState: (_, action: PayloadAction<FeaturesList>) =>
      action.payload,
    saveOrderStateSameCategory: (state, action: PayloadAction<Feature[]>) => {
      const category = state.find(
        (category) => category.categoryId === action.payload[0].category.id,
      );

      category!.features = action.payload.map((card, idx) => ({
        ...card,
        order: idx + 1,
      }));
    },
    saveOrderStateDifferentCategory: (
      state,
      action: PayloadAction<SaveOrderStateDifferentCategoryStatePayload>,
    ) => {
      const OldCategory = state.find(
        (category) =>
          category.categoryId === action.payload.sourceList.categoryId,
      );

      const newCategory = state.find(
        (category) =>
          category.categoryId === action.payload.destList.categoryId,
      );

      OldCategory!.features = action.payload.sourceList.features.map(
        (card, idx) => ({
          ...card,
          order: idx + 1,
        }),
      );

      newCategory!.features = action.payload.destList.features.map(
        (card, idx) => ({
          ...card,
          order: idx + 1,
        }),
      );
    },
    rollbackOrderState: (_, action: PayloadAction<FeaturesList>) =>
      action.payload,
  },
});

export const {
  fetchFeaturesState,
  saveOrderStateSameCategory,
  saveOrderStateDifferentCategory,
  rollbackOrderState,
} = featuresSlice.actions;

export default featuresSlice.reducer;
