"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { Button } from "@chingu-x/components/button";
import { Spinner } from "@chingu-x/components/spinner";
import Textarea from "@/shared/components/inputs/Textarea";
import { validateTextInput } from "@/shared/utils/form/validateInput";
import { sprintMeetingAdapter } from "@/features/sprint-meeting/hooks/useSprintMeetingAdapters";
import { useSprintMeetingStateSelector } from "@/features/sprint-meeting/hooks/useSprintMeetingStateSelector";
import { useEditMeetingNotesMutation } from "@/features/sprint-meeting/hooks/useEditMeetingNotesMutation";

const validationSchema = z.object({
  notes: validateTextInput({
    inputName: "This field",
    required: true,
  }),
});

export type ValidationSchema = z.infer<typeof validationSchema>;

export default function Notes() {
  const [data, setData] = useState<string>();
  const { meetingId } = useParams<{
    meetingId: string;
  }>();
  const meeting = useSprintMeetingStateSelector();
  const { isEditMeetingNotesPending, editMeetingNotesMutation } =
    useEditMeetingNotesMutation();

  useEffect(() => {
    const meetingNote = sprintMeetingAdapter.getSprintMeeting({
      meeting,
      meetingId,
    })?.notes;

    setData(meetingNote);
  }, [meeting, meetingId]);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<ValidationSchema>({
    mode: "onTouched",
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    editMeetingNotesMutation({ meetingId, ...data });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-y-2 pt-10"
    >
      <Textarea
        id="notes"
        placeholder="Add any notes for this meeting here"
        rows={2}
        {...register("notes")}
        errorMessage={errors.notes?.message}
        defaultValue={data ?? ""}
      />
      <Button
        type="submit"
        variant="outline"
        size="md"
        className="min-w-[75px] self-center"
        disabled={!isDirty || !isValid || isEditMeetingNotesPending}
      >
        {isEditMeetingNotesPending ? <Spinner /> : "Save"}
      </Button>
    </form>
  );
}
