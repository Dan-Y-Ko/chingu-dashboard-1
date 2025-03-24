import { useAppSelector } from "@/shared/store";

export const useCurrentVoyageTeamStateSelector = () =>
  useAppSelector((state) => state.currentVoyageTeam);
