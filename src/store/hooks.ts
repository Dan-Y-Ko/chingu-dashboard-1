import { useAppSelector } from "@/shared/store";

export const useModal = () => useAppSelector((state) => state.modal);
export const useIdeation = () => useAppSelector((state) => state.ideation);
export const useFinalizedIdeation = () =>
  useAppSelector((state) =>
    state.ideation.projectIdeas.find((project) => project.isSelected === true),
  );

export const useResource = () => useAppSelector((state) => state.resources);
export const useFeatures = () => useAppSelector((state) => state.features);
export const useTechStack = () => useAppSelector((state) => state.techStack);
