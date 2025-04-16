"use client";

import "reflect-metadata";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BannerContainer } from "@chingu-x/components/banner-container";
import { Banner } from "@chingu-x/components/banner";
import routePaths from "@/shared/utils/routePaths";
import VoyageSubmittedMessage from "@/features/sprints/components/VoyageSubmittedMessage";
import { useIsVoyageProjectSubmittedStatus } from "@/features/voyage-team/hooks/useVoyageTeamAdapters";
import { useGetCurrentSprint } from "@/features/sprints/hooks/useSprintsAdapters";
import { useFetchSprintsQuery } from "@/features/sprints/hooks/useFetchSprintsQuery";
import { useGetSprintMeetingId } from "@/features/sprint-meeting/hooks/useSprintMeetingAdapters";
import { useSprintStateSelector } from "@/features/sprints/hooks/useSprintStateSelector";

interface SprintsPageProps {
  params: {
    teamId: string;
    sprintNumber: string;
  };
}

export default function SprintsPage({ params }: SprintsPageProps) {
  const { teamId, sprintNumber } = params;
  const router = useRouter();
  const sprints = useSprintStateSelector();
  const { currentSprint } = useGetCurrentSprint();
  useFetchSprintsQuery({
    teamId,
  });
  const { isVoyageProjectSubmitted } = useIsVoyageProjectSubmittedStatus({
    teamId,
  });
  const currentSprintNumber = currentSprint?.number;
  const { getSprintMeetingId } = useGetSprintMeetingId();
  const sprintMeetingId = getSprintMeetingId({
    sprints: sprints.sprints,
    sprintNumber: Number(sprintNumber),
  });

  useEffect(() => {
    if (!isVoyageProjectSubmitted) {
      if (currentSprint) {
        if (sprintMeetingId) {
          router.push(
            routePaths.sprintWeekPage(
              teamId,
              sprintNumber.toString(),
              sprintMeetingId.toString(),
            ),
          );
        } else {
          router.push(
            routePaths.emptySprintPage(teamId, currentSprintNumber!.toString()),
          );
        }
      }
    }
  }, [
    sprintMeetingId,
    sprintNumber,
    currentSprintNumber,
    isVoyageProjectSubmitted,
    router,
    currentSprint,
    teamId,
  ]);

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

  return null;
}
