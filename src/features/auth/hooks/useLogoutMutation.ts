import type { LogoutResponseDto } from "@chingu-x/modules/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useLogout } from "./useAuthAdapters";
import { useAppDispatch } from "@/shared/store";
import { CacheTag } from "@/shared/utils/cacheTag";
import { clientSignOut } from "@/features/auth/store/authSlice";
import routePaths from "@/shared/utils/routePaths";
import { onOpenModal } from "@/store/features/modal/modalSlice";

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { logout } = useLogout();

  const { mutate: logoutMutation } = useMutation<
    LogoutResponseDto,
    Error,
    void
  >({
    mutationKey: [CacheTag.logout],
    mutationFn: logoutMutationFn,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: [CacheTag.me] });
      dispatch(clientSignOut());
      router.replace(routePaths.signIn());
    },
    onError: (error: Error) => {
      dispatch(
        onOpenModal({ type: "error", content: { message: error.message } }),
      );
    },
  });

  async function logoutMutationFn(): Promise<LogoutResponseDto> {
    return await logout();
  }

  return {
    logoutMutation,
  };
}
