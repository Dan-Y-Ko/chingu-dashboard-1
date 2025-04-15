import { useAppSelector } from "@/shared/store";

export const useFinalizedIdeationStateSelector = () =>
  useAppSelector((state) =>
    state.ideation.projectIdeas.find((project) => project.isSelected === true),
  );
