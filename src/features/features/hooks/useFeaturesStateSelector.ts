import { useAppSelector } from "@/shared/store";

export const useFeaturesStateSelector = () =>
  useAppSelector((state) => state.features);
