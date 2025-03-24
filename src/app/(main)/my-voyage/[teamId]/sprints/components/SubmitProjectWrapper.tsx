"use client";

import "reflect-metadata";
import { useRouter } from "next/navigation";
import type { Sprint } from "@chingu-x/modules/sprints";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@chingu-x/components/spinner";
import VoyageSubmissionForm from "./forms/VoyageSubmissionForm";
import { ErrorType } from "@/shared/utils/error";
import ErrorComponent from "@/shared/components/Error";
import { useUser } from "@/store/hooks";
import { formsAdapter, sprintsAdapter } from "@/shared/utils/adapters";
import { currentDate } from "@/shared/utils/getCurrentDate";
import { CacheTag } from "@/shared/utils/cacheTag";
import routePaths from "@/shared/utils/routePaths";
import { useSprintStateSelector } from "@/features/sprints/hooks/useSprintStateSelector";

interface SubmitProjectWrapperProps {
  params: {
    teamId: string;
    sprintNumber: string;
  };
}

export default function SubmitProjectWrapper({
  params,
}: SubmitProjectWrapperProps) {
  const { teamId } = params;
  const sprintNumber = Number(params.sprintNumber);
  const user = useUser();
  const sprints = useSprintStateSelector();
  const router = useRouter();

  const { number } = sprintsAdapter.getCurrentSprint({
    currentDate,
    sprints: sprints.sprints,
  }) as Sprint;

  const currentSprintNumber = number;

  if (currentSprintNumber && currentSprintNumber !== sprintNumber) {
    router.push(
      routePaths.emptySprintPage(teamId, currentSprintNumber.toString()),
    );
  }

  const { isPending, isError, error, data } = useQuery({
    queryKey: [
      CacheTag.voyageProjectSubmissionForm,
      { teamId, user: `${user.id}` },
    ],
    queryFn: fetchVoyageProjectSubmitFormQuery,
  });

  async function fetchVoyageProjectSubmitFormQuery() {
    return await formsAdapter.fetchSubmitVoyageProjectForm();
  }

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorComponent
        errorType={ErrorType.FETCH_FORM_QUESTIONS}
        message={error.message}
      />
    );
  }

  return (
    <VoyageSubmissionForm
      params={params}
      title={data.title}
      description={data.description}
      questions={data.questions}
    />
  );
}
