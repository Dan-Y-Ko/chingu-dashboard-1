import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type { TimezoneClientAdapter } from "@chingu-x/modules/timezone";
import type { FeaturesClientAdapter } from "@chingu-x/modules/features";

export const timezoneAdapter = resolve<TimezoneClientAdapter>(
  TYPES.TimezoneClientAdapter,
);

export const featuresAdapter = resolve<FeaturesClientAdapter>(
  TYPES.FeaturesClientAdapter,
);
