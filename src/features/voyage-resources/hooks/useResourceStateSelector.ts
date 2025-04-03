import { useAppSelector } from "@/shared/store";

export const useResourceStateSelector = () =>
  useAppSelector((state) => state.resources);
