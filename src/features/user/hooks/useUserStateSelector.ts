import { useAppSelector } from "@/shared/store";

export const useUserStateSelector = () => useAppSelector((state) => state.user);
