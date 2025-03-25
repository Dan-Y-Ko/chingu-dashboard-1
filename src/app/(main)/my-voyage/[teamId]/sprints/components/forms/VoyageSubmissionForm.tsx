"use client";

import { type SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Question } from "@chingu-x/modules/forms";
import type {
  SubmitVoyageProjectClientRequestDto,
  SubmitVoyageProjectResponseDto,
} from "@chingu-x/modules/sprints";
import { Button } from "@chingu-x/components/button";
import { Spinner } from "@chingu-x/components/spinner";
import BaseFormPage from "@/shared/components/form/BaseFormPage";
import FormInput from "@/shared/components/form/FormInput";
import { useAppDispatch } from "@/shared/store";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { createValidationSchema } from "@/shared/utils/form/createValidationSchema";
import routePaths from "@/shared/utils/routePaths";
import { CacheTag } from "@/shared/utils/cacheTag";
import { sprintsAdapter } from "@/features/sprints/hooks/useSprintsAdapters";
import { submitVoyageProject } from "@/features/sprints/store/sprintSlice";

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
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [teamId, sprintNumber] = [Number(params.teamId), params.sprintNumber];

  const { mutate, isPending } = useMutation<
    SubmitVoyageProjectResponseDto,
    Error,
    SubmitVoyageProjectClientRequestDto
  >({
    mutationFn: submitVoyageProjectFormMutation,
    mutationKey: [CacheTag.submitVoyageProjectForm],
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [CacheTag.sprints, CacheTag.sprintMeetingId],
      });
      router.push(routePaths.emptySprintPage(teamId.toString(), sprintNumber));
      dispatch(submitVoyageProject({ teamId }));
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
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  async function submitVoyageProjectFormMutation({
    data,
    questions,
    voyageTeamId,
  }: SubmitVoyageProjectClientRequestDto): Promise<SubmitVoyageProjectResponseDto> {
    return await sprintsAdapter.submitVoyageProject({
      data,
      questions,
      voyageTeamId,
    });
  }

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    mutate({ data, questions, voyageTeamId: teamId });
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
          disabled={isPending}
          size="lg"
          variant="primary"
        >
          {isPending ? <Spinner /> : "Submit Voyage"}
        </Button>
      </form>
    </BaseFormPage>
  );
}
