"use client";

import { useEffect } from "react";
import {
  type ResourceData,
  fetchResources,
} from "@/features/voyage-resources/store/resourcesSlice";
import { useAppDispatch } from "@/store/hooks";

export interface ResourceProviderProps {
  payload: ResourceData[];
}

export default function ResourcesProvider({ payload }: ResourceProviderProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchResources(payload));
  }, [dispatch, payload]);

  return null;
}
