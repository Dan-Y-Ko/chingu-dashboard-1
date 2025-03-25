import type {
  LoginClientRequestDto,
  LoginResponseDto,
} from "@chingu-x/modules/auth";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { authAdapter } from "./useAuthAdapters";
import { useAppDispatch } from "@/shared/store";
import { clientSignIn } from "@/features/auth/store/authSlice";
import routePaths from "@/shared/utils/routePaths";
import { onOpenModal } from "@/store/features/modal/modalSlice";

export function useLoginMutation() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { mutate: loginMutation, isPending: isLoginMutationPending } =
    useMutation<LoginResponseDto, Error, LoginClientRequestDto>({
      mutationFn: loginMutationFn,
      onSuccess: () => {
        dispatch(clientSignIn());
        router.replace(routePaths.dashboardPage());
      },
      onError: (error: Error) => {
        dispatch(
          onOpenModal({ type: "error", content: { message: error.message } }),
        );
      },
    });

  async function loginMutationFn({
    email,
    password,
  }: LoginClientRequestDto): Promise<LoginResponseDto> {
    return await authAdapter.login({ email, password });
  }

  return {
    isLoginMutationPending,
    loginMutation,
  };
}
