"use client";
import { useEffect } from "react";
import { fetchTechStack } from "@/features/tech-stack/store/techStackSlice";
import type { TechStackData } from "@/features/tech-stack/store/techStackSlice";
import { useAppDispatch } from "@/store/hooks";

export interface TechStackProviderProps {
  payload: TechStackData[];
}

export default function TechStackProvider({ payload }: TechStackProviderProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTechStack(payload));
  }, [dispatch, payload]);

  return null;
}
