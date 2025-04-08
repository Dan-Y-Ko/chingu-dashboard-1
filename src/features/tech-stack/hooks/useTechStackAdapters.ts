import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type { TechStackClientAdapter } from "@chingu-x/modules/tech-stack";

export const techStackAdapter = resolve<TechStackClientAdapter>(
  TYPES.TechStackClientAdapter,
);
