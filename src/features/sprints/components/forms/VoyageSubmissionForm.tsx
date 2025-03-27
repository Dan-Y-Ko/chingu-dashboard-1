"use client";

import { type SubmitHandler, useForm } from "react-hook-form";
import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Question } from "@chingu-x/modules/forms";
import { Button } from "@chingu-x/components/button";
import { Spinner } from "@chingu-x/components/spinner";
import BaseFormPage from "@/shared/components/form/BaseFormPage";
import FormInput from "@/shared/components/form/FormInput";
import { createValidationSchema } from "@/shared/utils/form/createValidationSchema";
import { useEditMeetingNotesMutation } from "@/features/sprints/hooks/useSubmitVoyageProjectFormMutation";

interface VoyageSubmissionFormProps {
  params: {
    teamId: string;
    sprintNumber: string;
  };
  title: string;
  description: string;
  questions: Question[];
}

export default function VoyageSubmissionForm({
  params,
  title,
  description,
  questions,
}: VoyageSubmissionFormProps) {
  const { sprintNumber, teamId } = params;
  const { isSubmitVoyageProjectMutationPending, submitVoyageProjectMutation } =
    useEditMeetingNotesMutation({ sprintNumber, teamId });

  const { validationSchema, defaultValues } = createValidationSchema(questions);
  type ValidationSchema = z.infer<typeof validationSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    submitVoyageProjectMutation({
      data,
      questions,
      voyageTeamId: Number(teamId),
    });
  };

  return (
    <BaseFormPage title={title} description={description}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-y-10"
      >
        {questions.map((question) => {
          const { id } = question;

          return (
            <div key={`question ${id}`}>
              <FormInput
                question={question}
                register={register}
                errors={errors}
              />
            </div>
          );
        })}
        <Button
          type="submit"
          title="submit"
          disabled={isSubmitVoyageProjectMutationPending}
          size="lg"
          variant="primary"
        >
          {isSubmitVoyageProjectMutationPending ? <Spinner /> : "Submit Voyage"}
        </Button>
      </form>
    </BaseFormPage>
  );
}
