import type {
  EditSprintMeetingSectionResponseDto,
  EditSprintPlanningSectionClientRequestDto,
} from "@chingu-x/modules/sprint-meeting";
import { useMutation } from "@tanstack/react-query";
import { useFetchSprintMeetingFormQuery } from "./useFetchSprintMeetingFormQuery";
import {
  useEditSprintPlanningSection,
  useGetSprintMeetingSectionResponses,
} from "./useSprintMeetingAdapters";
import { useAppDispatch } from "@/shared/store";
import { editSprintMeetingSectonState } from "@/features/sprint-meeting/store/sprintMeetingSlice";
import { onOpenModal } from "@/store/features/modal/modalSlice";

interface UseEditSprintPlanningSectionMutationProps {
  id: number;
  meetingId: string;
}

export function useEditSprintPlanningSectionMutation({
  id,
  meetingId,
}: UseEditSprintPlanningSectionMutationProps) {
  const dispatch = useAppDispatch();
  const { fetchSprintMeetingFormFn } = useFetchSprintMeetingFormQuery({
    id,
    meetingId,
  });
  const { getSprintMeetingSectionResponses } =
    useGetSprintMeetingSectionResponses();
  const { editSprintPlanningSection } = useEditSprintPlanningSection();

  const {
    mutate: editSprintPlanningSectionMutation,
    isPending: isEditSprintPlanningSectionPending,
  } = useMutation<
    EditSprintMeetingSectionResponseDto,
    Error,
    EditSprintPlanningSectionClientRequestDto
  >({
    mutationFn: editSprintPlanningSectionMutationFn,
    onSuccess: async (data) => {
      try {
        const sprintMeetingForm = await fetchSprintMeetingFormFn();
        const responseData = getSprintMeetingSectionResponses({
          sprintMeetingForm,
        });
        dispatch(
          editSprintMeetingSectonState({ data, meetingId, responseData }),
        );
      } catch (error) {
        dispatch(
          onOpenModal({
            type: "error",
            content: { message: (error as Error).message },
          }),
        );
      }
    },
    onError: (error: Error) => {
      dispatch(
        onOpenModal({ type: "error", content: { message: error.message } }),
      );
    },
  });

  async function editSprintPlanningSectionMutationFn({
    meetingId,
    data,
  }: EditSprintPlanningSectionClientRequestDto): Promise<EditSprintMeetingSectionResponseDto> {
    return await editSprintPlanningSection({
      meetingId,
      data,
    });
  }

  return {
    isEditSprintPlanningSectionPending,
    editSprintPlanningSectionMutation,
  };
}
