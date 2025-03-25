import type {
  ResetPasswordClientRequestDto,
  ResetPasswordResponseDto,
} from "@chingu-x/modules/auth";
import { useMutation } from "@tanstack/react-query";
import { useResetPassword } from "./useAuthAdapters";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { useAppDispatch } from "@/shared/store";

interface UseResetPasswordMutationProps {
  onClick: () => void;
}

export function useResetPasswordMutation({
  onClick,
}: UseResetPasswordMutationProps) {
  const dispatch = useAppDispatch();
  const { resetPassword } = useResetPassword();

  const { mutate: resetPasswordMutation, isPending: isResetPasswordPending } =
    useMutation<ResetPasswordResponseDto, Error, ResetPasswordClientRequestDto>(
      {
        mutationFn: resetPasswordMutationFn,
        onSuccess: () => {
          onClick();
        },
        onError: (error: Error) => {
          dispatch(
            onOpenModal({ type: "error", content: { message: error.message } }),
          );
        },
      },
    );

  async function resetPasswordMutationFn({
    password,
    token,
  }: ResetPasswordClientRequestDto): Promise<ResetPasswordResponseDto> {
    return await resetPassword({ password, token });
  }

  return {
    isResetPasswordPending,
    resetPasswordMutation,
  };
}
