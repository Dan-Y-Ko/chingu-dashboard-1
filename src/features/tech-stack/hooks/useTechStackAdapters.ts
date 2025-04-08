import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type {
  FetchTechStackClientRequestDto,
  TechStackClientAdapter,
} from "@chingu-x/modules/tech-stack";

export const techStackAdapter = resolve<TechStackClientAdapter>(
  TYPES.TechStackClientAdapter,
);

export function useFetchTechStack() {
  const fetchTechStack = async ({ teamId }: FetchTechStackClientRequestDto) =>
    await techStackAdapter.fetchTechStack({ teamId });

  return { fetchTechStack };
}
