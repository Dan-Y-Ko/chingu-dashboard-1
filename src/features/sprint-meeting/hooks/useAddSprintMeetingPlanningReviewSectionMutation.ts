import type {
  AddSprintMeetingSectionClientRequestDto,
  AddSprintMeetingSectionResponseDto,
} from "@chingu-x/modules/sprint-meeting";
import { useMutation } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import { useFetchSprintMeetingFormQuery } from "./useFetchSprintMeetingFormQuery";
import {
  useAddSprintMeetingPlanningReviewSection,
  useGetSprintMeetingSectionResponses,
} from "./useSprintMeetingAdapters";
import { useAppDispatch } from "@/shared/store";
import { addSprintMeetingSectionState } from "@/features/sprint-meeting/store/sprintMeetingSlice";
import { onOpenModal } from "@/store/features/modal/modalSlice";

interface UseAddSprintMeetingPlanningReviewSectionMutationProps {
  id: number;
  meetingId: string;
  reorderSections: ((title: string) => void) | undefined;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function useAddSprintMeetingPlanningReviewSectionMutation({
  id,
  meetingId,
  reorderSections,
  setIsOpen,
}: UseAddSprintMeetingPlanningReviewSectionMutationProps) {
  const dispatch = useAppDispatch();
  const { fetchSprintMeetingFormFn } = useFetchSprintMeetingFormQuery({
    id,
    meetingId,
  });

  const { getSprintMeetingSectionResponses } =
    useGetSprintMeetingSectionResponses();

  const { addSprintMeetingPlanningReviewSection } =
    useAddSprintMeetingPlanningReviewSection();

  const {
    mutate: addSprintMeetingReviewSectionMutation,
    isPending: isAddSprintMeetingReviewSectionPending,
  } = useMutation<
    AddSprintMeetingSectionResponseDto,
    Error,
    AddSprintMeetingSectionClientRequestDto
  >({
    mutationFn: addSprintMeetingSectionMutationFn,
    onSuccess: async (data) => {
      try {
        const sprintMeetingForm = await fetchSprintMeetingFormFn();
        const responseData = getSprintMeetingSectionResponses({
          sprintMeetingForm,
        });

        dispatch(addSprintMeetingSectionState({ ...data, ...responseData }));
        reorderSections && reorderSections(responseData.title);
        setIsOpen(true);
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

  async function addSprintMeetingSectionMutationFn({
    meetingId,
    formId,
  }: AddSprintMeetingSectionClientRequestDto): Promise<AddSprintMeetingSectionResponseDto> {
    return await addSprintMeetingPlanningReviewSection({ meetingId, formId });
  }

  return {
    isAddSprintMeetingReviewSectionPending,
    addSprintMeetingReviewSectionMutation,
  };
}
