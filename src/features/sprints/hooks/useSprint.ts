import { useAppSelector } from "@/shared/store";

export const useSprint = () => useAppSelector((state) => state.sprint);
