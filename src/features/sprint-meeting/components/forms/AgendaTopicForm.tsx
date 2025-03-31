"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { type SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrashIcon } from "@heroicons/react/20/solid";
import type { Agenda } from "@chingu-x/modules/sprint-meeting";
import { Button } from "@chingu-x/components/button";
import { Spinner } from "@chingu-x/components/spinner";
import { TextInput } from "@chingu-x/components/inputs";
import Textarea from "@/shared/components/inputs/Textarea";
import { validateTextInput } from "@/shared/utils/form/validateInput";
import { useSprintMeetingStateSelector } from "@/features/sprint-meeting/hooks/useSprintMeetingStateSelector";
import { persistor, useAppDispatch } from "@/shared/store";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { sprintMeetingAdapter } from "@/features/sprint-meeting/hooks/useSprintMeetingAdapters";
import { useAddAgendaMutation } from "@/features/sprint-meeting/hooks/useAddAgendaMutation";
import { useEditAgendaMutation } from "@/features/sprint-meeting/hooks/useEditAgendaMutation";
import { useDeleteAgendaMutation } from "@/features/sprint-meeting/hooks/useDeleteAgendaMutation";

const validationSchema = z.object({
  title: validateTextInput({
    inputName: "Title",
    required: true,
  }),
  description: validateTextInput({
    inputName: "Description",
    required: true,
  }),
});

export type ValidationSchema = z.infer<typeof validationSchema>;

export default function AgendaTopicForm() {
  const router = useRouter();
  const { teamId, sprintNumber, meetingId, agendaId } = useParams<{
    teamId: string;
    sprintNumber: string;
    meetingId: string;
    agendaId: string;
  }>();

  const dispatch = useAppDispatch();
  const sprintMeeting = useSprintMeetingStateSelector();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [topicData, setTopicData] = useState<Agenda>();
  const { isAddAgendaPending, addAgendaMutation } = useAddAgendaMutation({
    teamId,
    sprintNumber,
    meetingId,
  });
  const { isEditAgendaPending, editAgendaMutation } = useEditAgendaMutation({
    teamId,
    sprintNumber,
    meetingId,
  });
  const { deleteAgendaMutation } =
    useDeleteAgendaMutation({
      teamId,
      sprintNumber,
      meetingId,
    });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<ValidationSchema>({
    mode: "onTouched",
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    if (editMode) {
      const payload = { ...data, agendaId };

      editAgendaMutation(payload);
    } else {
      const payload = { ...data, meetingId };

      addAgendaMutation(payload);
    }
  };

  function handleDelete() {
    dispatch(
      onOpenModal({
        type: "confirmation",
        content: {
          title: "Confirm Deletion",
          message:
            "Are you sure you want to delete? You will permanently lose all the information and will not be able to recover it.",
          confirmationText: "Delete Agenda Topic",
          cancelText: "Keep It",
        },
        payload: {
          params: {
            agendaId,
          },
          deleteFunction: deleteAgendaMutation,
        },
      }),
    );
  }

  useEffect(() => {
    if (agendaId) {
      const topic = sprintMeetingAdapter.getAgendaById({
        meeting: sprintMeeting,
        meetingId,
        agendaId,
      });

      setTopicData(topic);
      setEditMode(true);
    }
  }, [agendaId, meetingId, sprintMeeting]);

  useEffect(
    () => () => {
      void persistor.purge();
    },
    [],
  );

  function renderButtonContent() {
    if (isEditAgendaPending || isAddAgendaPending) {
      return <Spinner />;
    }

    return editMode ? "Save Changes" : "Add";
  }

  return (
    // TODO: Create some general form wrapper component
    <div className="mx-auto flex w-full max-w-[871px] flex-col items-center rounded-2xl bg-base-200 p-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-y-4 p-10"
      >
        <div className="mb-6 flex flex-col gap-y-4">
          <h2 className="text-3xl font-bold text-base-300">
            {editMode ? "Edit Topic on the Agenda" : "Add Agenda Topic"}
          </h2>
          <p className="text-lg font-medium text-base-300">
            {editMode
              ? "Edit an agenda topic for the meeting."
              : "What would you like to address during the meeting?"}
          </p>
        </div>
        <TextInput
          id="title"
          label="title"
          placeholder="What would you like to discuss at the meeting?"
          {...register("title")}
          errorMessage={errors.title?.message}
          maxLength={50}
          defaultValue={topicData?.title ?? ""}
        />
        <Textarea
          id="description"
          label="description"
          placeholder="Please provide a description and include details, links, and actionable items for this topic."
          {...register("description")}
          errorMessage={errors.description?.message}
          defaultValue={topicData?.description ?? ""}
        />
        <div className="flex w-full gap-x-10">
          {editMode && (
            <Button
              type="button"
              size="lg"
              variant="error"
              onClick={handleDelete}
              title="delete"
              className="w-1/2"
            >
              <TrashIcon className="h-4 w-4" />
              Delete
            </Button>
          )}
          <Button
            type="submit"
            title="submit"
            disabled={
              !isDirty || !isValid || isEditAgendaPending || isAddAgendaPending
            }
            size="lg"
            variant="primary"
            className={`${editMode ? "w-1/2" : "w-full"}`}
          >
            {renderButtonContent()}
          </Button>
        </div>
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
