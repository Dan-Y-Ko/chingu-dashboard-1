import type {
  DeleteFeatureClientRequestDto,
  EditFeatureClientResponseDto,
  Feature,
  FeaturesList,
} from "@chingu-x/modules/features";
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
    fetchFeatures: (_, action: PayloadAction<FeaturesList>) => action.payload,
    addFeatureState: (state, action: PayloadAction<Feature>) => {
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
    deleteFeatureState: (
      state,
      action: PayloadAction<DeleteFeatureClientRequestDto>,
    ) =>
      state.map((category) => ({
        ...category,
        features: category.features.filter(
          (feature) => feature.id !== action.payload.featureId,
        ),
      })),
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
  fetchFeatures,
  addFeatureState,
  editFeatureState,
  deleteFeatureState,
  saveOrderStateSameCategory,
  saveOrderStateDifferentCategory,
  rollbackOrderState,
} = featuresSlice.actions;

export default featuresSlice.reducer;
