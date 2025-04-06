import { useAppSelector } from "@/shared/store";

export const useModal = () => useAppSelector((state) => state.modal);
export const useIdeation = () => useAppSelector((state) => state.ideation);
export const useFinalizedIdeation = () =>
  useAppSelector((state) =>
    state.ideation.projectIdeas.find((project) => project.isSelected === true),
  );
