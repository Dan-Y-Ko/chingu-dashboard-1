"use client";

import "reflect-metadata";
import { useRouter } from "next/navigation";
import type { Sprint } from "@chingu-x/modules/sprints";
import { BannerContainer } from "@chingu-x/components/banner-container";
import { Banner } from "@chingu-x/components/banner";
import Image from "next/image";
import { useEffect } from "react";
import { currentDate } from "@/shared/utils/getCurrentDate";
import { useUser } from "@/store/hooks";
import { sprintsAdapter } from "@/shared/utils/adapters";
import routePaths from "@/shared/utils/routePaths";
import {
  useIsVoyageProjectSubmittedStatus,
  voyageTeamAdapter,
} from "@/features/voyage-team/hooks/useVoyageTeamAdapters";
import { useCurrentVoyageTeamStateSelector } from "@/features/voyage-team/hooks/useCurrentVoyageTeamStateSelector";
import VoyageSubmittedMessage from "@/features/sprints/components/VoyageSubmittedMessage";
import ProgressStepper from "@/features/sprints/components/ProgressStepper";
import SprintActions from "@/features/sprints/components/SprintActions";
import EmptySprintState from "@/features/sprints/components/EmptySprintState";
import { sprintMeetingAdapter } from "@/features/sprint-meeting/hooks/useSprintMeetingAdapters";
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
  const user = useUser();
  // const currentVoyageTeam = useCurrentVoyageTeamStateSelector();
  const sprints = useSprintStateSelector();
  const router = useRouter();

  const { isVoyageProjectSubmitted } = useIsVoyageProjectSubmittedStatus({
    teamId,
  });

  // Check if a meeting exists
  const meetingId = sprintMeetingAdapter.getSprintMeetingId({
    sprints: sprints.sprints,
    sprintNumber,
  });

  // Get current sprint number
  const { number, id } = sprintsAdapter.getCurrentSprint({
    currentDate,
    sprints: sprints.sprints,
  }) as Sprint;

  const currentSprintNumber = number;

  useEffect(() => {
    // Redirect if a user tries to access a sprint which hasn't started yet
    if (sprintNumber > currentSprintNumber) {
      router.push(
        routePaths.emptySprintPage(teamId, currentSprintNumber.toString()),
      );
      // If a user tries to access this page directly, check if the current sprint's meetingId exists.
      // If so, redirect to the existing meeting page.
    }

    if (meetingId) {
      router.push(
        routePaths.sprintWeekPage(
          teamId,
          sprintNumber.toString(),
          meetingId.toString(),
        ),
      );
    }
  }, [currentSprintNumber, meetingId, router, sprintNumber, teamId]);

  // Check if a checkin form for the current sprint has been submitted
  const sprintCheckinIsSubmitted = sprintsAdapter.getSprintCheckinStatus({
    user,
    sprintId: id,
  });

  if (isVoyageProjectSubmitted) {
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
        <VoyageSubmittedMessage />
      </div>
    );
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
        sprintCheckinIsSubmitted={sprintCheckinIsSubmitted}
        voyageProjectIsSubmitted={isVoyageProjectSubmitted}
        currentSprintNumber={currentSprintNumber}
      />
      <EmptySprintState />
    </div>
  );
}
