import { useAppSelector } from "@/shared/store";

export const useModal = () => useAppSelector((state) => state.modal);
