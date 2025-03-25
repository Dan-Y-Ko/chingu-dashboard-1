import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type { MyTeamClientAdapter } from "@chingu-x/modules/my-team";

export const myTeamAdapter = resolve<MyTeamClientAdapter>(
  TYPES.MyTeamClientAdapter,
);
