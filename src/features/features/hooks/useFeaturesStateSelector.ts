import { useAppSelector } from "@/shared/store";

export const useFeatures = () => useAppSelector((state) => state.features);
