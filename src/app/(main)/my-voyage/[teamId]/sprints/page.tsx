"use client";

import "reflect-metadata";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import type { Sprint } from "@chingu-x/modules/sprints";
import { useEffect, useState } from "react";
import { Spinner } from "@chingu-x/components/spinner";
import { BannerContainer } from "@chingu-x/components/banner-container";
import { Banner } from "@chingu-x/components/banner";
import { currentDate } from "@/shared/utils/getCurrentDate";
import { CacheTag } from "@/shared/utils/cacheTag";
import { ErrorType } from "@/shared/utils/error";
import ErrorComponent from "@/shared/components/Error";
import { useAppDispatch } from "@/shared/store";
import { sprintsAdapter } from "@/shared/utils/adapters";
import { fetchSprints } from "@/features/sprints/store/sprintSlice";
import routePaths from "@/shared/utils/routePaths";
import VoyageSubmittedMessage from "@/features/sprints/components/VoyageSubmittedMessage";
import { useIsVoyageProjectSubmittedStatus } from "@/features/voyage-team/hooks/useVoyageTeamAdapters";
import { useUserStateSelector } from "@/features/user/hooks/useUserStateSelector";

interface SprintsPageProps {
  params: {
    teamId: string;
    sprintNumber: string;
  };
}

export default function SprintsPage({ params }: SprintsPageProps) {
  const { teamId } = params;
  const user = useUserStateSelector();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [sprintsData, setSprintsData] = useState<Sprint>();
  const [currentSprintNumber, setCurrentSprintNumber] = useState<number>(0);

  const { isVoyageProjectSubmitted } = useIsVoyageProjectSubmittedStatus({
    teamId,
  });

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

  useEffect(() => {
    if (data) {
      const sprintsData = sprintsAdapter.getCurrentSprint({
        sprints: data.sprints,
        currentDate,
      });

      setSprintsData(sprintsData);
    }
  }, [data]);

  useEffect(() => {
    if (sprintsData) {
      setCurrentSprintNumber(sprintsData.number);
    }
  }, [sprintsData]);

  useEffect(() => {
    if (!isVoyageProjectSubmitted) {
      if (sprintsData) {
        if (sprintsData.teamMeetings.length !== 0) {
          router.push(
            routePaths.sprintWeekPage(
              teamId,
              currentSprintNumber.toString(),
              sprintsData.teamMeetings[0].toString(),
            ),
          );
        }

        router.push(
          routePaths.emptySprintPage(teamId, currentSprintNumber.toString()),
        );
      }
    }
  }, [
    currentSprintNumber,
    router,
    teamId,
    sprintsData,
    isVoyageProjectSubmitted,
  ]);

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
