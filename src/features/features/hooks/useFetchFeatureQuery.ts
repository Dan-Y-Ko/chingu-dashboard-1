import { useQuery } from "@tanstack/react-query";
import { useFetchFeature } from "./useFeaturesAdapters";
import { CacheTag } from "@/shared/utils/cacheTag";

interface UseFetchFeatureQueryProps {
  id: number;
}

export function useFetchFeatureQuery({ id }: UseFetchFeatureQueryProps) {
  const { fetchFeature } = useFetchFeature();

  useQuery({
    queryKey: [CacheTag.feature, id],
    queryFn: () => getFeatureQuery(id),
    enabled: false,
  });

  async function getFeatureQuery(featureId: number) {
    return await fetchFeature({ featureId });
  }
}
