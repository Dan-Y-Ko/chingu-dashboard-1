import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type {
  AuthClientAdapter,
  ResetPasswordClientRequestDto,
} from "@chingu-x/modules/auth";

export const authAdapter = resolve<AuthClientAdapter>(TYPES.AuthClientAdapter);

export function useLogout() {
  const logout = async () => await authAdapter.logout();

  return { logout };
}

export function useResetPassword() {
  const resetPassword = async ({
    password,
    token,
  }: ResetPasswordClientRequestDto) =>
    await authAdapter.resetPassword({ password, token });

  return { resetPassword };
}
