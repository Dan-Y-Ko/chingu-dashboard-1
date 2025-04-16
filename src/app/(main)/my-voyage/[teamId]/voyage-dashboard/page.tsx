"use client";

import "reflect-metadata";
import { useFetchSprintsQuery } from "@/features/sprints/hooks/useFetchSprintsQuery";
import { useGetCurrentSprint } from "@/features/sprints/hooks/useSprintsAdapters";
import VoyageSupport from "@/features/support/components/VoyageSupport";
import MyVoyageOverviewContainer from "@/features/voyage-overview-widgets/components/MyVoyageOverviewContainer";
import CheckInWidget from "@/features/weekly-checkin-widget/components/CheckInWidget";

interface VoyageDashboardProps {
  teamId: string;
}
export default function VoyageDashboardPage({ teamId }: VoyageDashboardProps) {
  // let currentSprintNumber: number | null = null;
  // let sprintsData: Sprint[] = [];
  // let meetingsData: Event[] = [];
  // let voyageNumber: number | null = null;
  // let voyageData: Voyage = {} as Voyage;

  // if (teamId !== undefined) {
  //   const data = await getDashboardData(user, error, Number(teamId));
  //   currentSprintNumber = data.currentSprintNumber;
  //   sprintsData = data.sprintsData;
  //   meetingsData = data.meetingsData;
  //   voyageNumber = data.voyageNumber;
  //   voyageData = data.voyageData;
  // }
  useFetchSprintsQuery({
    teamId,
  });

  const { currentSprint } = useGetCurrentSprint();
  // const currentSprintNumber = currentSprint?.number;

  return (
    <div className="flex w-full flex-col gap-x-6 max-[1470px]:gap-y-6 min-[1470px]:grid min-[1470px]:grid-cols-2">
      <div className="col-span-1 flex grow-[2] flex-col gap-y-6">
        {/* <CalendarWidget
          sprintsData={sprintsData ?? undefined}
          currentSprintNumber={currentSprintNumber}
          meetingsData={meetingsData}
          voyageNumber={voyageNumber}
          teamId={teamId}
        /> */}
        {currentSprint && (
          <CheckInWidget currentSprint={currentSprint} teamId={teamId} />
        )}

        <VoyageSupport />
      </div>
      <MyVoyageOverviewContainer />
    </div>
  );
}
