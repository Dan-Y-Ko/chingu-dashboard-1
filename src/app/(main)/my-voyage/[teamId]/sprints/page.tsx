"use client";

import "reflect-metadata";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import type { Sprint } from "@chingu-x/modules/sprints";
import { useEffect, useState } from "react";
import { Spinner } from "@chingu-x/components/spinner";
import { currentDate } from "@/shared/utils/getCurrentDate";
import { CacheTag } from "@/shared/utils/cacheTag";
import { ErrorType } from "@/shared/utils/error";
import ErrorComponent from "@/shared/components/Error";
import { useAppDispatch } from "@/shared/store";
import { sprintsAdapter } from "@/shared/utils/adapters";
import { fetchSprints } from "@/features/sprints/store/sprintSlice";
import routePaths from "@/shared/utils/routePaths";
import { useUser } from "@/store/hooks";

interface SprintsPageProps {
  params: {
    teamId: string;
    sprintNumber: string;
  };
}

export default function SprintsPage({ params }: SprintsPageProps) {
  const { teamId } = params;

  const user = useUser();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [sprintsData, setSprintsData] = useState<Sprint>();
  const [currentSprintNumber, setCurrentSprintNumber] = useState<number>(0);

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
    if (sprintsData && sprintsData.teamMeetings.length !== 0) {
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
  }, [currentSprintNumber, router, teamId, sprintsData]);

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
}
