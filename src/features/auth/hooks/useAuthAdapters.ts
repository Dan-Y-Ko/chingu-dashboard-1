import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type { AuthClientAdapter } from "@chingu-x/modules/auth";

export const authAdapter = resolve<AuthClientAdapter>(TYPES.AuthClientAdapter);

export function useLogout() {
  const logout = async () => await authAdapter.logout();

  return { logout };
}
