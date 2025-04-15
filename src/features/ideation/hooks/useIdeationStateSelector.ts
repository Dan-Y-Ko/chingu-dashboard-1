import { useAppSelector } from "@/shared/store";

export const useIdeationStateSelector = () =>
  useAppSelector((state) => state.ideation);
