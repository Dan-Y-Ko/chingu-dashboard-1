import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type {
  FetchMyTeamClientRequestDto,
  MyTeamClientAdapter,
} from "@chingu-x/modules/my-team";

export const myTeamAdapter = resolve<MyTeamClientAdapter>(
  TYPES.MyTeamClientAdapter,
);

export function useFetchMyTeam() {
  const fetchMyTeam = async ({ teamId, user }: FetchMyTeamClientRequestDto) =>
    await myTeamAdapter.fetchMyTeam({ teamId, user });

  return { fetchMyTeam };
}
