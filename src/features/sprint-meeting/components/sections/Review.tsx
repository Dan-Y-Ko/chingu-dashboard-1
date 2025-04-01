"use client";

import { z } from "zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import type { SectionBody } from "@chingu-x/modules/sprint-meeting";
import { Button } from "@chingu-x/components/button";
import { Spinner } from "@chingu-x/components/spinner";
import Textarea from "@/shared/components/inputs/Textarea";
import { validateTextInput } from "@/shared/utils/form/validateInput";
import {
  useGetSprintMeeting,
  useGetSprintReviewQuestions,
} from "@/features/sprint-meeting/hooks/useSprintMeetingAdapters";
import { useEditSprintReviewSectionMutation } from "@/features/sprint-meeting/hooks/useEditSprintReviewSectionMutation";

const validationSchema = z.object({
  what_right: validateTextInput({
    inputName: "This field",
    required: true,
  }),
  what_to_improve: validateTextInput({
    inputName: "This field",
    required: true,
  }),
  what_to_change: validateTextInput({
    inputName: "This field",
    required: true,
  }),
});

export type ValidationSchema = z.infer<typeof validationSchema>;

interface ReviewProps {
  id: number;
}

export default function Review({ id }: ReviewProps) {
  const { meetingId } = useParams<{
    meetingId: string;
  }>();
  const { meeting } = useGetSprintMeeting({ meetingId });
  const { what_right, what_to_improve, what_to_change } =
    useGetSprintReviewQuestions({ meeting });
  const { isEditSprintReviewSectionPending, editSprintReviewSectionMutation } =
    useEditSprintReviewSectionMutation({ id, meetingId });

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

    editSprintReviewSectionMutation({
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
        id="what_right"
        label="What went right?"
        placeholder="Share your thoughts on what went right."
        rows={2}
        {...register("what_right")}
        errorMessage={errors.what_right?.message}
        defaultValue={what_right ?? ""}
      />
      <Textarea
        id="what_to_improve"
        label="What could be improved?"
        placeholder="Share your thoughts on what could be improved for the next sprint."
        rows={2}
        {...register("what_to_improve")}
        errorMessage={errors.what_to_improve?.message}
        defaultValue={what_to_improve ?? ""}
      />
      <Textarea
        id="what_to_change"
        label="Changes to be made for the next Sprint?"
        placeholder="Share your thoughts on what could change for the next sprint."
        rows={2}
        {...register("what_to_change")}
        errorMessage={errors.what_to_change?.message}
        defaultValue={what_to_change ?? ""}
      />
      <Button
        type="submit"
        variant="outline"
        size="md"
        className="min-w-[75px] self-center"
        disabled={!isDirty || !isValid || isEditSprintReviewSectionPending}
      >
        {isEditSprintReviewSectionPending ? <Spinner /> : "Save"}
      </Button>
    </form>
  );
}
