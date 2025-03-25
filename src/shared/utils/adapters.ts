import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type { FormsClientAdapter } from "@chingu-x/modules/forms";
import type { TimezoneClientAdapter } from "@chingu-x/modules/timezone";
import type { FeaturesClientAdapter } from "@chingu-x/modules/features";

export const formsAdapter = resolve<FormsClientAdapter>(
  TYPES.FormsClientAdapter,
);

export const timezoneAdapter = resolve<TimezoneClientAdapter>(
  TYPES.TimezoneClientAdapter,
);

export const featuresAdapter = resolve<FeaturesClientAdapter>(
  TYPES.FeaturesClientAdapter,
);
