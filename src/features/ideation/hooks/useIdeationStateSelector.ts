import { useAppSelector } from "@/shared/store";

export const useIdeationStateSelector = () =>
  useAppSelector((state) => state.ideation);
export const useFinalizedIdeationStateSelector = () =>
  useAppSelector((state) =>
    state.ideation.projectIdeas.find((project) => project.isSelected === true),
  );
