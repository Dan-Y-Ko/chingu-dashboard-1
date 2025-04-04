import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type {
  AddVoyageResourceClientRequestDto,
  DeleteVoyageResourceClientRequestDto,
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

export function useAddVoyageResource() {
  const addVoyageResource = async ({
    teamId,
    url,
    title,
  }: AddVoyageResourceClientRequestDto) =>
    await voyageResourcesAdapter.addVoyageResource({ teamId, url, title });

  return { addVoyageResource };
}

export function useDeleteVoyageResource() {
  const deleteVoyageResource = async ({
    resourceId,
  }: DeleteVoyageResourceClientRequestDto) =>
    await voyageResourcesAdapter.deleteVoyageResource({ resourceId });

  return { deleteVoyageResource };
}
