import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type {
  FeaturesClientAdapter,
  FetchFeaturesClientRequestDto,
} from "@chingu-x/modules/features";

export const featuresAdapter = resolve<FeaturesClientAdapter>(
  TYPES.FeaturesClientAdapter,
);

export function useFetchFeatures() {
  const fetchFeatures = async ({ teamId }: FetchFeaturesClientRequestDto) =>
    await featuresAdapter.fetchFeatures({ teamId });

  return { fetchFeatures };
}
