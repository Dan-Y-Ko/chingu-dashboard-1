"use client";

import "reflect-metadata";
import { useRouter } from "next/navigation";
import { BannerContainer } from "@chingu-x/components/banner-container";
import { Banner } from "@chingu-x/components/banner";
import Image from "next/image";
import { useEffect } from "react";
import { Spinner } from "@chingu-x/components/spinner";
import {
  useGetCurrentSprint,
  useGetSprintCheckinStatus,
} from "@/features/sprints/hooks/useSprintsAdapters";
import routePaths from "@/shared/utils/routePaths";
import { useIsVoyageProjectSubmittedStatus } from "@/features/voyage-team/hooks/useVoyageTeamAdapters";
import ProgressStepper from "@/features/sprints/components/ProgressStepper";
import SprintActions from "@/features/sprints/components/SprintActions";
import EmptySprintState from "@/features/sprints/components/EmptySprintState";
import { useGetSprintMeetingId } from "@/features/sprint-meeting/hooks/useSprintMeetingAdapters";
import { useSprintStateSelector } from "@/features/sprints/hooks/useSprintStateSelector";

interface EmptySprintPageProps {
  params: {
    teamId: string;
    sprintNumber: string;
  };
}

export default function EmptySprintPage({ params }: EmptySprintPageProps) {
  const { teamId } = params;
  const sprintNumber = Number(params.sprintNumber);
  const sprints = useSprintStateSelector();
  const router = useRouter();
  const { isVoyageProjectSubmitted } = useIsVoyageProjectSubmittedStatus({
    teamId,
  });
  const { getSprintMeetingId } = useGetSprintMeetingId();
  const sprintMeetingId = getSprintMeetingId({
    sprints: sprints.sprints,
    sprintNumber,
  });

  // Check if a meeting exists

  // Get current sprint number
  const { currentSprint } = useGetCurrentSprint();

  const currentSprintNumber = currentSprint!.number;

  useEffect(() => {
    // Redirect if a user tries to access a sprint which hasn't started yet
    if (currentSprintNumber) {
      if (sprintNumber > currentSprintNumber) {
        router.push(
          routePaths.emptySprintPage(teamId, currentSprintNumber.toString()),
        );
      }
    }

    // If a user tries to access this page directly, check if the current sprint's meetingId exists.
    // If so, redirect to the existing meeting page.
    if (sprintMeetingId) {
      router.push(
        routePaths.sprintWeekPage(
          teamId,
          sprintNumber.toString(),
          sprintMeetingId.toString(),
        ),
      );
    }
  }, [currentSprintNumber, sprintMeetingId, router, sprintNumber, teamId]);

  // Check if a checkin form for the current sprint has been submitted
  const { sprintCheckinIsSubmitted } = useGetSprintCheckinStatus({
    id: currentSprint!.id,
  });

  if (isVoyageProjectSubmitted) {
    router.push(routePaths.sprintsPage(teamId));
  }

  if (!currentSprint) {
    return <Spinner />;
  }

  return (
    <div className="flex w-full flex-col gap-y-10">
      <BannerContainer
        title="Sprints"
        description="A sprint agenda helps the team stay on track, communicate well, and improve. Basically, it's like speed dating for developers. Except we're not looking for a soulmate, we're just trying to get some quality work done."
      >
        <Banner
          imageLight={
            <Image
              src="/img/sprints_banner_light.png"
              alt="Light sprints banner"
              fill={true}
              sizes="276px"
              priority
              style={{ objectFit: "contain" }}
            />
          }
          imageDark={
            <Image
              src="/img/sprints_banner_dark.png"
              alt="Dark sprints banner"
              fill={true}
              sizes="276px"
              priority
              style={{ objectFit: "contain" }}
            />
          }
          height="h-[200px]"
          width="w-[276px]"
        />
      </BannerContainer>
      <ProgressStepper currentSprintNumber={currentSprintNumber} />
      <SprintActions
        params={params}
        sprintCheckinIsSubmitted={sprintCheckinIsSubmitted!}
        voyageProjectIsSubmitted={isVoyageProjectSubmitted}
        currentSprintNumber={currentSprintNumber}
      />
      <EmptySprintState />
    </div>
  );
}
