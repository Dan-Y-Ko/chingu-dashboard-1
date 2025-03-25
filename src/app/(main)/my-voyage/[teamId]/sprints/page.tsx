"use client";

import "reflect-metadata";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@chingu-x/components/spinner";
import { BannerContainer } from "@chingu-x/components/banner-container";
import { Banner } from "@chingu-x/components/banner";
import { ErrorType } from "@/shared/utils/error";
import ErrorComponent from "@/shared/components/Error";
import routePaths from "@/shared/utils/routePaths";
import VoyageSubmittedMessage from "@/features/sprints/components/VoyageSubmittedMessage";
import { useIsVoyageProjectSubmittedStatus } from "@/features/voyage-team/hooks/useVoyageTeamAdapters";
import { useGetCurrentSprint } from "@/features/sprints/hooks/useSprintsAdapters";
import { useFetchSprintsQuery } from "@/features/sprints/hooks/useFetchSprints";

interface SprintsPageProps {
  params: {
    teamId: string;
    sprintNumber: string;
  };
}

export default function SprintsPage({ params }: SprintsPageProps) {
  const { teamId } = params;
  const router = useRouter();
  const { sprintsState } = useGetCurrentSprint();
  const { isFetchSprintsPending, isFetchSprintsError, fetchSprintsError } =
    useFetchSprintsQuery({
      teamId,
    });
  const { isVoyageProjectSubmitted } = useIsVoyageProjectSubmittedStatus({
    teamId,
  });
  const currentSprintNumber = sprintsState?.number;

  useEffect(() => {
    if (!isVoyageProjectSubmitted) {
      if (sprintsState) {
        if (sprintsState.teamMeetings.length !== 0) {
          router.push(
            routePaths.sprintWeekPage(
              teamId,
              currentSprintNumber!.toString(),
              sprintsState.teamMeetings[0].toString(),
            ),
          );
        }

        router.push(
          routePaths.emptySprintPage(teamId, currentSprintNumber!.toString()),
        );
      }
    }
  }, [
    currentSprintNumber,
    isVoyageProjectSubmitted,
    router,
    sprintsState,
    teamId,
  ]);

  if (isFetchSprintsPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isFetchSprintsError) {
    return (
      <ErrorComponent
        errorType={ErrorType.FETCH_SPRINT}
        message={fetchSprintsError!.message}
      />
    );
  }

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
