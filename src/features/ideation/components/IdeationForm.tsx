"use client";

import { type SubmitHandler, useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrashIcon } from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";
import { Button } from "@chingu-x/components/button";
import { Spinner } from "@chingu-x/components/spinner";
import { TextInput } from "@chingu-x/components/inputs";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { validateTextInput } from "@/shared/utils/form/validateInput";
import { useIdeationStateSelector } from "../hooks/useIdeationStateSelector";
import { useGetIdeationById } from "../hooks/useIdeationAdapters";
import routePaths from "@/shared/utils/routePaths";
import { persistor } from "@/shared/store";
import {
  EditIdeationClientRequestDto,
  Ideation,
} from "@chingu-x/modules/ideation";

const validationSchema = z.object({
  title: validateTextInput({
    inputName: "Title",
    required: true,
    minLen: 3,
    maxLen: 50,
  }),
  description: validateTextInput({
    inputName: "Description",
    required: true,
    minLen: 10,
  }),
  vision: validateTextInput({
    inputName: "Vision statement",
    required: true,
    minLen: 10,
  }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

// todo: add confirmation modal when user cancels or goes back
// when this is supported

export default function IdeationForm() {
  const router = useRouter();
  const params = useParams<{ teamId: string; ideationId: string }>();
  const teamId = +params.teamId;
  const ideationId = Number(params.ideationId);
  const { ideation } = useGetIdeationById({ ideationId });
  const [editMode, setEditMode] = useState<boolean>(false);
  const [ideationData, setIdeationData] = useState<Ideation>();
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const dispatch = useAppDispatch();

  const {
    runAction: editIdeationAction,
    isLoading: editIdeationLoading,
    setIsLoading: setEditIdeationLoading,
  } = useServerAction(editIdeation);

  const {
    runAction: addIdeationAction,
    isLoading: addIdeationLoading,
    setIsLoading: setAddIdeationLoading,
  } = useServerAction(addIdeation);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, isValid, dirtyFields },
  } = useForm<ValidationSchema>({
    mode: "onTouched",
    resolver: zodResolver(validationSchema),
  });

  const { title, description, vision } = watch();

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    if (editMode) {
      const ideationId = +params.ideationId;

      interface MyObject extends EditIdeationClientRequestDto {
        [key: string]: unknown;
      }

      const filteredData: MyObject = {
        ideationId,
      };

      for (const key in dirtyFields) {
        if (dirtyFields.hasOwnProperty(key)) {
          filteredData[key] = (data as { [key: string]: string })[key];
        }
      }

      const [res, error] = await editIdeationAction(filteredData);

      if (res) {
        router.push(routePaths.ideationPage(teamId.toString()));
      }

      if (error) {
        dispatch(
          onOpenModal({ type: "error", content: { message: error.message } }),
        );

        setEditIdeationLoading(false);
      }
    } else {
      const payload = { ...data, teamId };

      const [res, error] = await addIdeationAction(payload);

      if (res) {
        router.push(routePaths.ideationPage(teamId.toString()));
      }

      if (error) {
        dispatch(
          onOpenModal({ type: "error", content: { message: error.message } }),
        );
        setAddIdeationLoading(false);
      }
    }
  };

  function handleDelete() {
    const route = routePaths.ideationPage(teamId.toString());
    dispatch(
      onOpenModal({
        type: "confirmation",
        content: {
          title: "Confirm Deletion",
          message:
            "Are you sure you want to delete? You will permanently lose all the information and will not be able to recover it.",
          confirmationText: "Delete Project",
          cancelText: "Keep It",
        },
        payload: {
          params: {
            ideationId,
          },
          redirect: { router, route },
          deleteFunction: deleteIdeation,
        },
      }),
    );
  }

  useEffect(() => {
    if (!ideation) {
      router.push(routePaths.ideationPage(teamId.toString()));
    }

    setIdeationData(ideation);
    setEditMode(true);
  }, [ideation, router, teamId]);

  useEffect(() => {
    reset({
      title: ideationData?.title,
      description: ideationData?.description,
      vision: ideationData?.vision,
    });
  }, [ideationData, reset]);

  // purge won't work as expected in dev with strict mode enabled. Works
  // as intended in prod
  useEffect(
    () => () => {
      void persistor.purge();
    },
    [],
  );

  function renderButtonContent() {
    if (editIdeationLoading || addIdeationLoading) {
      return <Spinner />;
    }

    return editMode ? "Save Changes" : "Save";
  }

  return (
    <div className="flex justify-center">
      <div className="flex w-[871px] flex-col items-center rounded-2xl bg-base-200 p-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full max-w-[650px] flex-col gap-y-4"
        >
          <div className="flex flex-col gap-y-4">
            <h1 className="text-3xl font-bold text-base-300">
              {editMode ? "Edit Project" : "Add Project"}
            </h1>
            <p className="text-lg font-medium text-base-300">
              Share your project idea with the team.
            </p>
          </div>
          <TextInput
            id="title"
            label="title"
            placeholder="Enter your voyage project idea"
            {...register("title")}
            errorMessage={errors.title?.message}
            maxLength={50}
            defaultValue={ideationData?.title ?? ""}
          />
          <Textarea
            id="description"
            label="description"
            placeholder="Describe your idea. What problem or challenge do you aim to address or solve? What is the primary purpose and goal of your idea? Who are your intemded users?"
            {...register("description")}
            errorMessage={errors.description?.message}
            defaultValue={ideationData?.description ?? ""}
          />
          <Textarea
            id="visionStatement"
            label="vision statement"
            placeholder="Share your inspiring vision. How will you provide value and benefits to users? What long term impact do you hope to achieve?"
            {...register("vision")}
            errorMessage={errors.vision?.message}
            defaultValue={ideationData?.vision ?? ""}
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
                Delete Project
              </Button>
            )}
            <Button
              type="submit"
              title="submit"
              disabled={
                !isDirty ||
                !isValid ||
                editIdeationLoading ||
                addIdeationLoading
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
            variant="neutral"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </form>
      </div>
    </div>
  );
}
