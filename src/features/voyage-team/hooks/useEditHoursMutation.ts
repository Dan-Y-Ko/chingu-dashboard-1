import type {
  EditHoursClientRequestDto,
  EditHoursResponseDto,
} from "@chingu-x/modules/my-team";
import { useMutation } from "@tanstack/react-query";
import type { SetStateAction } from "react";
import { useEditHours } from "./useMyTeamAdapters";
import { editHoursState } from "@/features/voyage-team/store/myTeamSlice";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { useUserStateSelector } from "@/features/user/hooks/useUserStateSelector";
import { useAppDispatch } from "@/shared/store";

interface UseEditHoursMutationProps {
  setIsEditing: (value: SetStateAction<boolean>) => void;
}

export function useEditHoursMutation({
  setIsEditing,
}: UseEditHoursMutationProps) {
  const dispatch = useAppDispatch();
  const user = useUserStateSelector();
  const { editHours } = useEditHours();

  const { mutate: editHoursMutation, isPending: isEditHoursMutationPending } =
    useMutation<EditHoursResponseDto, Error, EditHoursClientRequestDto>({
      mutationFn: editHoursMutationFn,
      onSuccess: (_, variables) => {
        const { hrPerSprint } = variables;
        setIsEditing(false);
        dispatch(editHoursState({ user, hrPerSprint }));
      },
      onError: (error: Error) => {
        dispatch(
          onOpenModal({ type: "error", content: { message: error.message } }),
        );
      },
    });

  async function editHoursMutationFn({
    teamId,
    hrPerSprint,
  }: EditHoursClientRequestDto): Promise<EditHoursResponseDto> {
    return await editHours({ teamId, hrPerSprint });
  }

  return {
    isEditHoursMutationPending,
    editHoursMutation,
  };
}
