"use client";

import "reflect-metadata";
import { useRouter } from "next/navigation";
import { Spinner } from "@chingu-x/components/spinner";
import { useEffect } from "react";
import { ErrorType } from "@/shared/utils/error";
import ErrorComponent from "@/shared/components/Error";
import { useGetCurrentSprint } from "@/features/sprints/hooks/useSprintsAdapters";
import routePaths from "@/shared/utils/routePaths";
import VoyageSubmissionForm from "@/features/sprints/components/forms/VoyageSubmissionForm";
import { useFetchVoyageProjectSubmitFormQuery } from "@/features/sprints/hooks/useFetchVoyageProjectSubmitFormQuery";

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

  const {
    isFetchVoyageProjectSubmitFormPending,
    isFetchVoyageProjectSubmitFormError,
    fetchVoyageProjectSubmitFormError,
    voyageProjectSubmitForm,
  } = useFetchVoyageProjectSubmitFormQuery({ teamId });

  useEffect(() => {
    if (currentSprintNumber && currentSprintNumber !== sprintNumber) {
      router.push(
        routePaths.emptySprintPage(teamId, currentSprintNumber.toString()),
      );
    }
  }, [currentSprintNumber, router, sprintNumber, teamId]);

  if (isFetchVoyageProjectSubmitFormPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isFetchVoyageProjectSubmitFormError) {
    return (
      <ErrorComponent
        errorType={ErrorType.FETCH_FORM_QUESTIONS}
        message={fetchVoyageProjectSubmitFormError!.message}
      />
    );
  }

  return (
    <VoyageSubmissionForm
      params={params}
      title={voyageProjectSubmitForm!.title}
      description={voyageProjectSubmitForm!.description}
      questions={voyageProjectSubmitForm!.questions}
    />
  );
}
