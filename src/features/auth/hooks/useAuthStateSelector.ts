import { useAppSelector } from "@/shared/store";

export const useAuthStateSelector = () => useAppSelector((state) => state.auth);
