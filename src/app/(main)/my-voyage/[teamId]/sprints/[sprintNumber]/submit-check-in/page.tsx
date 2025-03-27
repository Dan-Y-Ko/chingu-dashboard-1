"use client";

import "reflect-metadata";
import { useRouter } from "next/navigation";
import type { TeamMemberForCheckbox } from "@chingu-x/modules/forms";
import { useEffect } from "react";
import type { Sprint } from "@chingu-x/modules/sprints";
import { Spinner } from "@chingu-x/components/spinner";
import WeeklyCheckInForm from "@/features/sprints/components/forms/WeeklyCheckInForm";
import routePaths from "@/shared/utils/routePaths";
import { ErrorType } from "@/shared/utils/error";
import ErrorComponent from "@/shared/components/Error";
import {
  useGetCurrentSprint,
  useGetSprintCheckinStatus,
} from "@/features/sprints/hooks/useSprintsAdapters";
import { voyageTeamAdapter } from "@/features/voyage-team/hooks/useVoyageTeamAdapters";
import { useCurrentVoyageTeamStateSelector } from "@/features/voyage-team/hooks/useCurrentVoyageTeamStateSelector";
import { useSprintStateSelector } from "@/features/sprints/hooks/useSprintStateSelector";
import { useFetchWeeklyCheckinFormQuery } from "@/features/sprints/hooks/useFetchWeeklyCheckinFormQuery";
import { useMyTeamStateSelector } from "@/features/voyage-team/hooks/useMyTeamStateSelector";

interface WeeklyCheckInPageProps {
  params: {
    teamId: string;
    sprintNumber: string;
  };
}

export default function WeeklyCheckInPage({ params }: WeeklyCheckInPageProps) {
  const { teamId, sprintNumber } = params;
  const sprints = useSprintStateSelector();
  const currentVoyageTeam = useCurrentVoyageTeamStateSelector();
  const myTeam = useMyTeamStateSelector();
  const router = useRouter();
  let teamMembers = [] as TeamMemberForCheckbox[];
  const voyageTeamMemberId = voyageTeamAdapter.getCurrentVoyageUserId({
    currentVoyageTeam,
    teamId,
  });
  const {
    isFetchWeeklyCheckinFormPending,
    isFetchWeeklyCheckinFormError,
    fetchWeeklyCheckinFormError,
    weeklyCheckinForm,
  } = useFetchWeeklyCheckinFormQuery({ teamId, sprintNumber });
  const { currentSprint } = useGetCurrentSprint();
  const { number, id } = currentSprint as Sprint;
  const currentSprintNumber = number;
  const { sprintCheckinIsSubmitted } = useGetSprintCheckinStatus({ id });

  useEffect(() => {
    if (sprints.sprints.length === 0 || myTeam.voyageTeamMembers.length === 0) {
      router.push(routePaths.sprintsPage(teamId));
    }
  }, [sprints, myTeam, teamId, router]);

  // Check if a user wants to submit a checkin form for the current sprint.

  if (currentSprintNumber && currentSprintNumber !== Number(sprintNumber)) {
    router.push(
      routePaths.emptySprintPage(teamId, currentSprintNumber.toString()),
    );
  }

  // Check if a checkin form for the current sprint has been submitted.
  if (sprintCheckinIsSubmitted) {
    router.push(routePaths.emptySprintPage(teamId, sprintNumber.toString()));
  }

  if (isFetchWeeklyCheckinFormPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isFetchWeeklyCheckinFormError) {
    return (
      <ErrorComponent
        errorType={ErrorType.FETCH_FORM_QUESTIONS}
        message={fetchWeeklyCheckinFormError!.message}
      />
    );
  }

  // Get all teamMembers except for the current user
  if (voyageTeamMemberId) {
    teamMembers = myTeam.voyageTeamMembers
      .map((member) => ({
        id: member.id,
        avatar: member.member.avatar,
        firstName: member.member.firstName,
        lastName: member.member.lastName,
      }))
      .filter((member) => member.id !== voyageTeamMemberId);
  }

  return (
    <WeeklyCheckInForm
      params={params}
      description={weeklyCheckinForm!.description}
      questions={weeklyCheckinForm!.questions}
      teamMembers={teamMembers}
      sprintId={id}
    />
  );
}
