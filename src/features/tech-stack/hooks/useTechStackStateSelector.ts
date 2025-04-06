import { useAppSelector } from "@/shared/store";

export const useTechStackStateSelector = () =>
  useAppSelector((state) => state.techStack);
