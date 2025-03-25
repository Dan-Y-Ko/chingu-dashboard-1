import { useAppSelector } from "@/shared/store";

export const useMyTeam = () => useAppSelector((state) => state.myTeam);
