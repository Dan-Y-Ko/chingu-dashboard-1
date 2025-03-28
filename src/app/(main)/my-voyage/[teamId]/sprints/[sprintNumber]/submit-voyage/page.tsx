"use client";

import "reflect-metadata";
import { Spinner } from "@chingu-x/components/spinner";
import { ErrorType } from "@/shared/utils/error";
import ErrorComponent from "@/shared/components/Error";
import VoyageSubmissionForm from "@/features/sprints/components/forms/VoyageSubmissionForm";
import { useFetchVoyageProjectSubmitFormQuery } from "@/features/sprints/hooks/useFetchVoyageProjectSubmitFormQuery";
import { useSprintPageRedirect } from "@/features/sprints/hooks/useSprintPageRedirect";

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
  const { teamId, sprintNumber } = params;

  useSprintPageRedirect({ sprintNumber, teamId });

  const {
    isFetchVoyageProjectSubmitFormPending,
    isFetchVoyageProjectSubmitFormError,
    fetchVoyageProjectSubmitFormError,
    voyageProjectSubmitForm,
  } = useFetchVoyageProjectSubmitFormQuery({ teamId });

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
