import type {
  RequestResetPasswordClientRequestDto,
  RequestResetPasswordResponseDto,
} from "@chingu-x/modules/auth";
import { useMutation } from "@tanstack/react-query";
import { authAdapter } from "./useAuthAdapters";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { useAppDispatch } from "@/shared/store";

export function useRequestRestPasswordMutation() {
  const dispatch = useAppDispatch();

  const {
    mutate: requestResetPasswordMutation,
    isPending: isRequestResetPasswordMutationPending,
  } = useMutation<
    RequestResetPasswordResponseDto,
    Error,
    RequestResetPasswordClientRequestDto
  >({
    mutationFn: requestResetPasswordMutationFn,
    onError: (error: Error) => {
      dispatch(
        onOpenModal({ type: "error", content: { message: error.message } }),
      );
    },
  });

  async function requestResetPasswordMutationFn({
    email,
  }: RequestResetPasswordClientRequestDto): Promise<RequestResetPasswordResponseDto> {
    return await authAdapter.requestResetPassword({ email });
  }

  return {
    isRequestResetPasswordMutationPending,
    requestResetPasswordMutation,
  };
}
