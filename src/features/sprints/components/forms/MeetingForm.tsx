"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { type SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinkIcon } from "@heroicons/react/24/outline";
import type {
  AddMeetingClientRequestDto,
  AddMeetingResponseDto,
  EditMeetingClientRequestDto,
  EditMeetingResponseDto,
  Meeting,
} from "@chingu-x/modules/sprint-meeting";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@chingu-x/components/button";
import { Spinner } from "@chingu-x/components/spinner";
import { TextInput } from "@chingu-x/components/inputs";
import DateTimePicker from "@/shared/components/inputs/DateTimePicker";
import Textarea from "@/shared/components/inputs/Textarea";
import {
  validateDateTimeInput,
  validateTextInput,
} from "@/shared/utils/form/validateInput";
import { persistor, useAppDispatch } from "@/shared/store";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import routePaths from "@/shared/utils/routePaths";
import {
  sprintMeetingAdapter,
  useGetSprintMeeting,
} from "@/features/sprint-meeting/hooks/useSprintMeetingAdapters";
import {
  addMeetingState,
  editMeetingState,
} from "@/store/features/sprint-meeting/sprintMeetingSlice";
import { useSprintMeetingStateSelector } from "@/features/sprint-meeting/hooks/useSprintMeetingStateSelector";
import { useUserStateSelector } from "@/features/user/hooks/useUserStateSelector";
import {
  useGetMeetingLongDateTimeFormat,
  useGetSprintEndDate,
  useGetSprintStartDate,
} from "@/features/timezone/hooks/useTimezoneAdapters";
import { useAddMeetingMutation } from "@/features/sprint-meeting/hooks/useAddMeetingMutation";

export default function MeetingForm() {
  const router = useRouter();
  const { teamId, sprintNumber, meetingId } = useParams<{
    teamId: string;
    sprintNumber: string;
    meetingId: string;
  }>();
  const dispatch = useAppDispatch();
  const sprintMeeting = useSprintMeetingStateSelector();
  const { timezone } = useUserStateSelector();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [meetingData, setMeetingData] = useState<Meeting>();
  const { sprintStartDate } = useGetSprintStartDate({ sprintNumber });
  const { sprintEndDate } = useGetSprintEndDate({ sprintNumber });
  const { meetingLongDateTimeFormat } = useGetMeetingLongDateTimeFormat({
    meetingData,
  });
  const { meeting } = useGetSprintMeeting({ meetingId });
  const { isAddMeetingPending, addMeetingMutation } = useAddMeetingMutation({
    teamId,
    sprintNumber,
  });

  const validationSchema = z.object({
    title: validateTextInput({
      inputName: "Title",
      required: true,
      maxLen: 50,
    }),
    description: validateTextInput({
      inputName: "Description",
      required: true,
    }),
    dateTime: validateDateTimeInput({
      minDate: sprintStartDate,
      maxDate: sprintEndDate,
      timezone,
    }),
    meetingLink: validateTextInput({
      inputName: "Meeting link",
      isUrl: true,
    }),
  });

  type ValidationSchema = z.infer<typeof validationSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<ValidationSchema>({
    mode: "onTouched",
    resolver: zodResolver(validationSchema),
  });

  const { dateTime } = watch();

  const setCustomValue = (id: "dateTime", value: Date) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const { mutate: editMeeting, isPending: editMeetingPending } = useMutation<
    EditMeetingResponseDto,
    Error,
    EditMeetingClientRequestDto
  >({
    mutationFn: editMeetingMutation,
    onSuccess: (data) => {
      router.push(
        routePaths.sprintWeekPage(teamId, sprintNumber, data.id.toString()),
      );
      dispatch(editMeetingState(data));
    },
    onError: (error: Error) => {
      dispatch(
        onOpenModal({ type: "error", content: { message: error.message } }),
      );
    },
  });

  async function editMeetingMutation({
    meetingId,
    timezone,
    ...data
  }: EditMeetingClientRequestDto): Promise<EditMeetingResponseDto> {
    return await sprintMeetingAdapter.editMeeting({
      meetingId,
      timezone,
      ...data,
    });
  }

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    if (editMode) {
      editMeeting({ timezone, meetingId, ...data });
    } else {
      addMeetingMutation({ data, teamId, sprintNumber, timezone });
    }
  };

  useEffect(() => {
    if (meetingId) {
      setMeetingData(meeting);
      setEditMode(true);
    }
  }, [meetingId, sprintMeeting, meeting]);

  useEffect(() => {
    if (meetingData && meetingData.dateTime) {
      reset({
        title: meetingData?.title,
        description: meetingData?.description,
        meetingLink: meetingData?.meetingLink,
        dateTime: meetingLongDateTimeFormat,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingData, reset]);

  useEffect(
    () => () => {
      void persistor.purge();
    },
    [],
  );

  function renderButtonContent() {
    if (isAddMeetingPending || editMeetingPending) {
      return <Spinner />;
    }

    return editMode ? "Save Changes" : "Save";
  }

  return (
    <div className="mx-auto flex w-full max-w-[871px] flex-col items-center rounded-2xl bg-base-200 p-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-y-4"
      >
        <div className="mb-6 flex flex-col gap-y-4">
          <h2 className="text-3xl font-bold text-base-300">
            {editMode ? "Edit" : "Create"} Meeting
          </h2>
          <p className="text-lg font-medium text-base-300">
            {editMode ? "Edit the" : "Create a new"} meeting for your team.
          </p>
        </div>
        <TextInput
          id="title"
          label="title"
          placeholder="ex. Sprint Planning, Standup, etc."
          {...register("title")}
          errorMessage={errors.title?.message}
          maxLength={50}
          defaultValue={meetingData?.title ?? ""}
        />
        <Textarea
          id="description"
          label="description"
          placeholder="Please provide a brief description of the goals for this meeting."
          {...register("description")}
          errorMessage={errors.description?.message}
          defaultValue={meetingData?.description ?? ""}
        />
        <DateTimePicker
          id="date"
          placeholder="Select meeting date and time"
          label="Date & Time"
          selectedValue={dateTime}
          {...register("dateTime")}
          errorMessage={errors?.dateTime?.message}
          onChange={(value: Date) => setCustomValue("dateTime", value)}
        />
        <TextInput
          id="meetingLink"
          label="Meeting link"
          inputGroupContent={<LinkIcon />}
          placeholder="Provide a link to the meeting"
          {...register("meetingLink")}
          errorMessage={errors.meetingLink?.message}
          defaultValue={meetingData?.meetingLink ?? ""}
        />
        <Button
          type="submit"
          title="submit"
          disabled={
            !isDirty || !isValid || isAddMeetingPending || editMeetingPending
          }
          size="lg"
          variant="primary"
        >
          {renderButtonContent()}
        </Button>
        <Button
          type="button"
          title="cancel"
          size="lg"
          variant="link"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </form>
    </div>
  );
}
