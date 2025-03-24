import { useAppSelector } from "@/shared/store";

export const useSprintStateSelector = () =>
  useAppSelector((state) => state.sprint);
