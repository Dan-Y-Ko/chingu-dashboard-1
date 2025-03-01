"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { Button } from "@chingu-x/components/button";
import { Spinner } from "@chingu-x/components/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Textarea from "@/components/inputs/Textarea";
import { validateTextInput } from "@/utils/form/validateInput";
import { PlanningQuestions, Forms } from "@/utils/form/formsEnums";
import useServerAction from "@/hooks/useServerAction";
import {
  editSection,
  type EditSectionBody,
} from "@/myVoyage/sprints/sprintsService";
import { useAppDispatch, useSprintMeeting } from "@/store/hooks";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { sprintMeetingAdapter } from "@/utils/adapters";
import {
  EditSprintMeetingSectionResponseDto,
  EditSprintPlanningSectionClientRequestDto,
  SectionBody,
} from "@chingu-x/modules/sprint-meeting";
import { CacheTag } from "@/utils/cacheTag";

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

export default function Planning() {
  const [data, setData] = useState<Section>();
  const dispatch = useAppDispatch();
  const params = useParams<{
    sprintNumber: string;
    meetingId: string;
  }>();

  const [meetingId] = [params.meetingId];

  const queryClient = useQueryClient();
  const meeting = useSprintMeeting();

  const currentMeeting = sprintMeetingAdapter.getSprintMeeting({
    meeting,
    meetingId,
  });

  const { goal, timeline } = sprintMeetingAdapter.getSprintPlanningQuestions({
    meeting: currentMeeting!,
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
    onSuccess: (data) => {
      queryClient.removeQueries({
        queryKey: [CacheTag.sprints, CacheTag.sprintMeetingId],
      });

      // dispatch(editSprintReviewState({ data, meetingId }));
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
    reset,
    formState: { errors, isDirty, isValid, dirtyFields },
  } = useForm<ValidationSchema>({
    mode: "onTouched",
    resolver: zodResolver(validationSchema),
  });

  useEffect(() => {
    reset({
      goal,
      timeline,
    });
  }, [goal, timeline, reset]);

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
