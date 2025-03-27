"use client";

import "reflect-metadata";
import { BannerContainer } from "@chingu-x/components/banner-container";
import { Banner } from "@chingu-x/components/banner";
import Image from "next/image";
import { Spinner } from "@chingu-x/components/spinner";
import {
  useGetCurrentSprint,
  useGetSprintCheckinStatus,
} from "@/features/sprints/hooks/useSprintsAdapters";
import { useIsVoyageProjectSubmittedStatus } from "@/features/voyage-team/hooks/useVoyageTeamAdapters";
import ProgressStepper from "@/features/sprints/components/ProgressStepper";
import SprintActions from "@/features/sprints/components/SprintActions";
import EmptySprintState from "@/features/sprints/components/EmptySprintState";
import { useSprintPageRedirect } from "@/features/sprints/hooks/useSprintPageRedirect";

interface EmptySprintPageProps {
  params: {
    teamId: string;
    sprintNumber: string;
  };
}

export default function EmptySprintPage({ params }: EmptySprintPageProps) {
  const { teamId, sprintNumber } = params;
  const { isVoyageProjectSubmitted } = useIsVoyageProjectSubmittedStatus({
    teamId,
  });

  useSprintPageRedirect({ sprintNumber, teamId });

  // Get current sprint number
  const { currentSprint } = useGetCurrentSprint();

  const currentSprintNumber = currentSprint!.number;

  // Check if a checkin form for the current sprint has been submitted
  const { sprintCheckinIsSubmitted } = useGetSprintCheckinStatus({
    id: currentSprint!.id,
  });

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
