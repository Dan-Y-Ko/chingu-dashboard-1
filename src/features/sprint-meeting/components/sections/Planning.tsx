"use client";

import { z } from "zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { Button } from "@chingu-x/components/button";
import { Spinner } from "@chingu-x/components/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  EditSprintMeetingSectionResponseDto,
  EditSprintPlanningSectionClientRequestDto,
  SectionBody,
} from "@chingu-x/modules/sprint-meeting";
import Textarea from "@/shared/components/inputs/Textarea";
import { validateTextInput } from "@/shared/utils/form/validateInput";
import { useAppDispatch } from "@/shared/store";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import {
  sprintMeetingAdapter,
  useGetSprintMeeting,
  useGetSprintPlanningQuestions,
} from "@/features/sprint-meeting/hooks/useSprintMeetingAdapters";
import { CacheTag } from "@/shared/utils/cacheTag";
import { editSprintMeetingSectonState } from "@/store/features/sprint-meeting/sprintMeetingSlice";
import { useSprintMeetingStateSelector } from "@/features/sprint-meeting/hooks/useSprintMeetingStateSelector";
import { useFetchSprintMeetingFormQuery } from "@/features/sprint-meeting/hooks/useFetchSprintMeetingFormQuery";

const validationSchema = z.object({
  goal: validateTextInput({
    inputName: "This field",
    required: true,
  }),
  timeline: validateTextInput({
    inputName: "This field",
    required: true,
  }),
});

export type ValidationSchema = z.infer<typeof validationSchema>;

interface PlanningProps {
  id: number;
}

export default function Planning({ id }: PlanningProps) {
  const dispatch = useAppDispatch();
  const { meetingId } = useParams<{
    meetingId: string;
  }>();
  const { meeting } = useGetSprintMeeting({ meetingId });
  const queryClient = useQueryClient();
  const { goal, timeline } = useGetSprintPlanningQuestions({ meeting });
  const { fetchSprintMeetingFormFn } = useFetchSprintMeetingFormQuery({
    id,
    meetingId,
  });

  const {
    mutate: editSprintPlanningSection,
    isPending: editSprintPlanningSectionPending,
  } = useMutation<
    EditSprintMeetingSectionResponseDto,
    Error,
    EditSprintPlanningSectionClientRequestDto
  >({
    mutationFn: editSprintPlanningSectionMutation,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: [CacheTag.sprints, CacheTag.sprintMeetingId],
      });

      try {
        const sprintMeetingForm = await fetchSprintMeetingFormFn();
        const responseData =
          sprintMeetingAdapter.getSprintMeetingSectionResponses({
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

  async function editSprintPlanningSectionMutation({
    meetingId,
    data,
  }: EditSprintPlanningSectionClientRequestDto): Promise<EditSprintMeetingSectionResponseDto> {
    return await sprintMeetingAdapter.editSprintPlanningSection({
      meetingId,
      data,
    });
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid, dirtyFields },
  } = useForm<ValidationSchema>({
    mode: "onTouched",
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    // Get only modified data
    interface MyObject extends Partial<SectionBody> {
      [key: string]: unknown;
    }

    const filteredData: MyObject = {};

    for (const key in dirtyFields) {
      if (dirtyFields.hasOwnProperty(key)) {
        filteredData[key] = (data as { [key: string]: string })[key];
      }
    }

    editSprintPlanningSection({
      meetingId,
      data: filteredData,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-y-2 pt-10"
    >
      <Textarea
        id="goal"
        label="Sprint Goal"
        placeholder="What is the primary goal of the next sprint?"
        rows={2}
        {...register("goal")}
        errorMessage={errors.goal?.message}
        defaultValue={goal ?? ""}
      />
      <Textarea
        id="timeline"
        label="Timeline/Tasks"
        placeholder="What are some of the goals we want to achieve during this sprint? What are some milestones & deadlines to reach during this sprint?"
        rows={2}
        {...register("timeline")}
        errorMessage={errors.timeline?.message}
        defaultValue={timeline ?? ""}
      />
      <Button
        type="submit"
        variant="outline"
        size="md"
        className="min-w-[75px] self-center"
        disabled={!isDirty || !isValid || editSprintPlanningSectionPending}
      >
        {editSprintPlanningSectionPending ? <Spinner /> : "Save"}
      </Button>
    </form>
  );
}
