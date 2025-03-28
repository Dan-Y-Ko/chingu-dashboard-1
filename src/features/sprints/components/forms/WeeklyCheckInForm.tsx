"use client";

import { type SubmitHandler, useForm } from "react-hook-form";
import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Question, TeamMemberForCheckbox } from "@chingu-x/modules/forms";
import { Button } from "@chingu-x/components/button";
import { Spinner } from "@chingu-x/components/spinner";
import BaseFormPage from "@/shared/components/form/BaseFormPage";
import FormInput from "@/shared/components/form/FormInput";
import { createValidationSchema } from "@/shared/utils/form/createValidationSchema";
import { useGetCurrentVoyageUserId } from "@/features/voyage-team/hooks/useVoyageTeamAdapters";
import { useSubmitWeeklyCheckinFormMutation } from "@/features/sprints/hooks/useSubmitWeeklyCheckinFormMutation";

interface WeeklyCheckinFormProps {
  params: {
    teamId: string;
    sprintNumber: string;
  };
  description: string;
  questions: Question[];
  teamMembers: TeamMemberForCheckbox[];
  sprintId: number;
}

export default function WeeklyCheckinForm({
  params,
  description,
  questions,
  teamMembers,
  sprintId,
}: WeeklyCheckinFormProps) {
  const [teamId, sprintNumber] = [params.teamId, params.sprintNumber];
  const { isSubmitWeeklyCheckinMutationPending, submitWeeklyCheckinMutation } =
    useSubmitWeeklyCheckinFormMutation({
      teamId,
      sprintNumber,
      sprintId,
    });

  const { voyageTeamMemberId } = useGetCurrentVoyageUserId({ teamId });

  const { validationSchema, defaultValues } = createValidationSchema(questions);

  type ValidationSchema = z.infer<typeof validationSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    mode: "onSubmit",
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    submitWeeklyCheckinMutation({
      data,
      questions,
      voyageTeamMemberId,
      sprintId,
    });
  };

  return (
    <BaseFormPage
      title={`Sprint #${sprintNumber} Check-in`}
      description={description}
    >
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
                teamMembers={teamMembers}
              />
            </div>
          );
        })}
        <Button
          type="submit"
          title="submit"
          disabled={isSubmitWeeklyCheckinMutationPending}
          size="lg"
          variant="primary"
        >
          {isSubmitWeeklyCheckinMutationPending ? (
            <Spinner />
          ) : (
            "Submit Check In"
          )}
        </Button>
      </form>
    </BaseFormPage>
  );
}
