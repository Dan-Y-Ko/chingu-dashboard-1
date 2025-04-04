import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type {
  FetchVoyageResourcesClientRequestDto,
  VoyageResourcesClientAdapter,
} from "@chingu-x/modules/voyage-resources";

export const voyageResourcesAdapter = resolve<VoyageResourcesClientAdapter>(
  TYPES.VoyageResourcesClientAdapter,
);

export function useFetchVoyageResources() {
  const fetchVoyageResources = async ({
    teamId,
  }: FetchVoyageResourcesClientRequestDto) =>
    await voyageResourcesAdapter.fetchVoyageResources({ teamId });

  return { fetchVoyageResources };
}
