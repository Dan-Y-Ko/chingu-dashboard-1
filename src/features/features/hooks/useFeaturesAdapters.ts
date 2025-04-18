import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type {
  AddFeatureClientRequestDto,
  DeleteFeatureClientRequestDto,
  EditFeatureClientRequestDto,
  FeaturesClientAdapter,
  FetchFeaturesClientRequestDto,
  SaveOrderClientRequestDto,
} from "@chingu-x/modules/features";
import { useFeaturesStateSelector } from "./useFeaturesStateSelector";

export const featuresAdapter = resolve<FeaturesClientAdapter>(
  TYPES.FeaturesClientAdapter,
);

export function useFetchFeatures() {
  const fetchFeatures = async ({ teamId }: FetchFeaturesClientRequestDto) =>
    await featuresAdapter.fetchFeatures({ teamId });

  return { fetchFeatures };
}

export function useSaveOrder() {
  const saveOrder = async ({
    featureId,
    order,
    featureCategoryId,
  }: SaveOrderClientRequestDto) =>
    await featuresAdapter.saveOrder({
      featureId,
      order,
      featureCategoryId,
    });

  return { saveOrder };
}

export function useEditFeature() {
  const editFeature = async ({
    featureId,
    teamMemberId,
    description,
  }: EditFeatureClientRequestDto) =>
    await featuresAdapter.editFeature({
      featureId,
      teamMemberId,
      description,
    });

  return { editFeature };
}

export function useDeleteFeature() {
  const deleteFeature = async ({ featureId }: DeleteFeatureClientRequestDto) =>
    await featuresAdapter.deleteFeature({ featureId });

  return { deleteFeature };
}

export function useAddFeature() {
  const addFeature = async ({
    teamId,
    description,
    featureCategoryId,
  }: AddFeatureClientRequestDto) =>
    await featuresAdapter.addFeature({
      teamId,
      description,
      featureCategoryId,
    });

  return { addFeature };
}

export function useGetMustHaveFeatures() {
  const features = useFeaturesStateSelector();

  const allFeatures = features.flatMap((group) => group.features);

  const mustHaveFeatures = featuresAdapter.getMustHaveFeatures({
    features: allFeatures,
  });

  return { mustHaveFeatures };
}
