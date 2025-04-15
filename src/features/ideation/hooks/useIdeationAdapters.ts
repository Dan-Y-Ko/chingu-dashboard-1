import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type {
  FetchIdeationClientRequestDto,
  IdeationClientAdapter,
} from "@chingu-x/modules/ideation";

export const ideationAdapter = resolve<IdeationClientAdapter>(
  TYPES.IdeationClientAdapter,
);

export function useFetchIdeation() {
  const fetchIdeation = async ({ teamId }: FetchIdeationClientRequestDto) => {
    await ideationAdapter.fetchIdeation({ teamId });
  };

  return { fetchIdeation };
}
