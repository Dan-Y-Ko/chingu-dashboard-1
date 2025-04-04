import { useAppSelector } from "@/shared/store";

export const useVoyageResourceStateSelector = () =>
  useAppSelector((state) => state.voyageResources);
