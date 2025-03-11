"use client";

import "reflect-metadata";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import type { Sprint } from "@chingu-x/modules/sprints";
import { BannerContainer } from "@chingu-x/components/banner-container";
import { Banner } from "@chingu-x/components/banner";
import { useEffect } from "react";
import { Spinner } from "@chingu-x/components/spinner";
import VoyageSubmittedMessage from "./components/VoyageSubmittedMessage";
import { currentDate } from "@/utils/getCurrentSprint";
import { CacheTag } from "@/utils/cacheTag";
import { ErrorType } from "@/utils/error";
import ErrorComponent from "@/components/Error";
import { useAppDispatch, useCurrentVoyageTeam, useUser } from "@/store/hooks";
import { sprintsAdapter, voyageTeamAdapter } from "@/utils/adapters";
import { fetchSprints } from "@/store/features/sprint/sprintSlice";
import routePaths from "@/utils/routePaths";

interface SprintsPageProps {
  params: {
    teamId: string;
    sprintNumber: string;
  };
}

export default function SprintsPage({ params }: SprintsPageProps) {
  const { teamId } = params;
  const user = useUser();
  const currentVoyageTeam = useCurrentVoyageTeam();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { isPending, isError, error, data } = useQuery({
    queryKey: [CacheTag.sprints, { teamId, user: `${user.id}` }],
    queryFn: fetchSprintsQuery,
  });

  async function fetchSprintsQuery() {
    return await sprintsAdapter.fetchSprints({ teamId });
  }

  useEffect(() => {
    if (data) {
      dispatch(fetchSprints(data));
    }
  }, [data, dispatch]);

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
        errorType={ErrorType.FETCH_SPRINT}
        message={error.message}
      />
    );
  }

  if (
    voyageTeamAdapter.getVoyageProjectSubmissionStatus({
      currentVoyageTeam,
      teamId,
    })
  ) {
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

  const { teamMeetings, number } = sprintsAdapter.getCurrentSprint({
    sprints: data.sprints,
    currentDate,
  }) as Sprint;

  const currentSprintNumber = number;

  if (teamMeetings.length !== 0) {
    router.push(
      routePaths.sprintWeekPage(
        teamId,
        currentSprintNumber.toString(),
        teamMeetings[0].toString(),
      ),
    );
  } else {
    router.push(
      routePaths.emptySprintPage(teamId, currentSprintNumber.toString()),
    );
  }
}
