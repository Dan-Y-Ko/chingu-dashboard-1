import type {
  RequestResetPasswordClientRequestDto,
  RequestResetPasswordResponseDto,
} from "@chingu-x/modules/auth";
import { useMutation } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import { useRequestResetPassword } from "./useAuthAdapters";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { useAppDispatch } from "@/shared/store";

interface UseRequestRestPasswordMutationProps {
  handleEmailCheck?: () => void;
  setEmail?: Dispatch<SetStateAction<string>>;
}

export function useRequestRestPasswordMutation({
  handleEmailCheck,
  setEmail,
}: UseRequestRestPasswordMutationProps) {
  const dispatch = useAppDispatch();
  const { requestResetPassword } = useRequestResetPassword();

  const {
    mutate: requestResetPasswordMutation,
    isPending: isRequestResetPasswordMutationPending,
  } = useMutation<
    RequestResetPasswordResponseDto,
    Error,
    RequestResetPasswordClientRequestDto
  >({
    mutationFn: requestResetPasswordMutationFn,
    onSuccess: (_, variables) => {
      if (handleEmailCheck && setEmail) {
        handleEmailCheck();
        setEmail(variables.email);
      }
    },
    onError: (error: Error) => {
      dispatch(
        onOpenModal({ type: "error", content: { message: error.message } }),
      );
    },
  });

  async function requestResetPasswordMutationFn({
    email,
  }: RequestResetPasswordClientRequestDto): Promise<RequestResetPasswordResponseDto> {
    return await requestResetPassword({ email });
  }

  return {
    isRequestResetPasswordMutationPending,
    requestResetPasswordMutation,
  };
}
