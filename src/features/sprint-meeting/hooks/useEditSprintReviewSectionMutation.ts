import type {
  EditSprintMeetingSectionResponseDto,
  EditSprintReviewSectionClientRequestDto,
} from "@chingu-x/modules/sprint-meeting";
import { useMutation } from "@tanstack/react-query";
import { useFetchSprintMeetingFormQuery } from "./useFetchSprintMeetingFormQuery";
import {
  useEditSprintReviewSection,
  useGetSprintMeetingSectionResponses,
} from "./useSprintMeetingAdapters";
import { useAppDispatch } from "@/shared/store";
import { editSprintMeetingSectonState } from "@/features/sprint-meeting/store/sprintMeetingSlice";
import { onOpenModal } from "@/store/features/modal/modalSlice";

interface UseEditSprintReviewSectionMutationProps {
  id: number;
  meetingId: string;
}

export function useEditSprintReviewSectionMutation({
  id,
  meetingId,
}: UseEditSprintReviewSectionMutationProps) {
  const dispatch = useAppDispatch();
  const { fetchSprintMeetingFormFn } = useFetchSprintMeetingFormQuery({
    id,
    meetingId,
  });
  const { getSprintMeetingSectionResponses } =
    useGetSprintMeetingSectionResponses();
  const { editSprintReviewSection } = useEditSprintReviewSection();

  const {
    mutate: editSprintReviewSectionMutation,
    isPending: isEditSprintReviewSectionPending,
  } = useMutation<
    EditSprintMeetingSectionResponseDto,
    Error,
    EditSprintReviewSectionClientRequestDto
  >({
    mutationFn: editSprintReviewSectionMutationFn,
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

  async function editSprintReviewSectionMutationFn({
    meetingId,
    data,
  }: EditSprintReviewSectionClientRequestDto): Promise<EditSprintMeetingSectionResponseDto> {
    return await editSprintReviewSection({
      meetingId,
      data,
    });
  }

  return {
    isEditSprintReviewSectionPending,
    editSprintReviewSectionMutation,
  };
}
