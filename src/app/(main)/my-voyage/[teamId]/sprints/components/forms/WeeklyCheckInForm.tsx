"use client";

import { type SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Question, TeamMemberForCheckbox } from "@chingu-x/modules/forms";
import type {
  SubmitWeeklyCheckinClientRequestDto,
  SubmitWeeklyCheckinResponseDto,
} from "@chingu-x/modules/sprints";
import { Button } from "@chingu-x/components/button";
import { Spinner } from "@chingu-x/components/spinner";
import BaseFormPage from "@/shared/components/form/BaseFormPage";
import FormInput from "@/shared/components/form/FormInput";
import { useAppDispatch, useCurrentVoyageTeam } from "@/store/hooks";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { createValidationSchema } from "@/utils/form/createValidationSchema";
import routePaths from "@/utils/routePaths";
import { sprintsAdapter, voyageTeamAdapter } from "@/utils/adapters";
import { CacheTag } from "@/utils/cacheTag";
import { submitWeeklyCheckin } from "@/store/features/sprint/sprintSlice";

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
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const currentVoyageTeam = useCurrentVoyageTeam();
  const [teamId, sprintNumber] = [params.teamId, params.sprintNumber];

  const { mutate, isPending } = useMutation<
    SubmitWeeklyCheckinResponseDto,
    Error,
    SubmitWeeklyCheckinClientRequestDto
  >({
    mutationFn: submitWeeklyCheckinFormMutation,
    mutationKey: [CacheTag.submitWeeklyCheckinForm],
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [CacheTag.sprints, CacheTag.sprintMeetingId],
      });
      router.push(routePaths.emptySprintPage(teamId, sprintNumber));
      dispatch(submitWeeklyCheckin({ sprintId }));
      dispatch(onOpenModal({ type: "checkInSuccess" }));
    },
    onError: (error: Error) => {
      dispatch(
        onOpenModal({ type: "error", content: { message: error.message } }),
      );
    },
  });

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

  async function submitWeeklyCheckinFormMutation({
    data,
    questions,
    voyageTeamMemberId,
    sprintId,
  }: SubmitWeeklyCheckinClientRequestDto): Promise<SubmitWeeklyCheckinResponseDto> {
    return await sprintsAdapter.submitWeeklyCheckin({
      data,
      questions,
      voyageTeamMemberId,
      sprintId,
    });
  }

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    const voyageTeamMemberId = voyageTeamAdapter.getCurrentVoyageUserId({
      currentVoyageTeam,
      teamId,
    });

    mutate({ data, questions, voyageTeamMemberId, sprintId });
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
          disabled={isPending}
          size="lg"
          variant="primary"
        >
          {isPending ? <Spinner /> : "Submit Check In"}
        </Button>
      </form>
    </BaseFormPage>
  );
}
