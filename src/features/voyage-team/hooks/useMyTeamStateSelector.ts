import { useAppSelector } from "@/shared/store";

export const useMyTeamStateSelector = () =>
  useAppSelector((state) => state.myTeam);
