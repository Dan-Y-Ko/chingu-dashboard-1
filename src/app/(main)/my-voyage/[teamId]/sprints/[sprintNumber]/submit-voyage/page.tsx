"use client";

import "reflect-metadata";
import { useRouter } from "next/navigation";
import type { Sprint } from "@chingu-x/modules/sprints";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@chingu-x/components/spinner";
import { ErrorType } from "@/shared/utils/error";
import ErrorComponent from "@/shared/components/Error";
import { formsAdapter } from "@/shared/utils/adapters";
import {
  sprintsAdapter,
  useGetCurrentSprint,
} from "@/features/sprints/hooks/useSprintsAdapters";
import { currentDate } from "@/shared/utils/getCurrentDate";
import { CacheTag } from "@/shared/utils/cacheTag";
import routePaths from "@/shared/utils/routePaths";
import { useSprintStateSelector } from "@/features/sprints/hooks/useSprintStateSelector";
import { useUserStateSelector } from "@/features/user/hooks/useUserStateSelector";
import VoyageSubmissionForm from "@/features/sprints/components/forms/VoyageSubmissionForm";
import { useEffect } from "react";

interface VoyageSubmissionPageProps {
  params: {
    teamId: string;
    meetingId: string;
    sprintNumber: string;
  };
}

export default function VoyageSubmissionPage({
  params,
}: VoyageSubmissionPageProps) {
  const { teamId } = params;
  const sprintNumber = Number(params.sprintNumber);
  const router = useRouter();
  const { currentSprint } = useGetCurrentSprint();
  const currentSprintNumber = currentSprint?.number;

  useEffect(() => {
    if (currentSprintNumber && currentSprintNumber !== sprintNumber) {
      router.push(
        routePaths.emptySprintPage(teamId, currentSprintNumber.toString()),
      );
    }
  }, [currentSprintNumber, router, sprintNumber, teamId]);

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
