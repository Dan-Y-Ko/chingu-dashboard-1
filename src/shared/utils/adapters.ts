import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type { FeaturesClientAdapter } from "@chingu-x/modules/features";

export const featuresAdapter = resolve<FeaturesClientAdapter>(
  TYPES.FeaturesClientAdapter,
);
