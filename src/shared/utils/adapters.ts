import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type { MyTeamClientAdapter } from "@chingu-x/modules/my-team";
import type { FormsClientAdapter } from "@chingu-x/modules/forms";
import type { TimezoneClientAdapter } from "@chingu-x/modules/timezone";
import type { FeaturesClientAdapter } from "@chingu-x/modules/features";

export const myTeamAdapter = resolve<MyTeamClientAdapter>(
  TYPES.MyTeamClientAdapter,
);

export const formsAdapter = resolve<FormsClientAdapter>(
  TYPES.FormsClientAdapter,
);

export const timezoneAdapter = resolve<TimezoneClientAdapter>(
  TYPES.TimezoneClientAdapter,
);

export const featuresAdapter = resolve<FeaturesClientAdapter>(
  TYPES.FeaturesClientAdapter,
);
