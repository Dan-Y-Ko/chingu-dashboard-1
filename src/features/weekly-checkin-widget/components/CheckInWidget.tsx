import { ArrowRightIcon, DocumentCheckIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import React from "react";
import Link from "next/link";
import { isSameDay, sub } from "date-fns";
import { Badge } from "@chingu-x/components/badge";
import { Button } from "@chingu-x/components/button";
import type { Sprint } from "@chingu-x/modules/sprints";
import { useUserStateSelector } from "@/features/user/hooks/useUserStateSelector";
import routePaths from "@/shared/utils/routePaths";
import { useGetSprintCheckinStatus } from "@/features/sprints/hooks/useSprintsAdapters";
import { useGetSprintEndDate } from "@/features/timezone/hooks/useTimezoneAdapters";
import { useFetchMyTeamQuery } from "@/features/voyage-team/hooks/useFetchMyTeamQuery";

interface CheckInWidgetProps {
  currentSprint: Sprint;
  teamId: string;
}
function CheckInWidget({ currentSprint, teamId }: CheckInWidgetProps) {
  const user = useUserStateSelector();
  useFetchMyTeamQuery({ teamId });
  const { currentDateInUserTimezone } = user;
  const userDate = currentDateInUserTimezone ?? new Date();
  const { number, id } = currentSprint;
  const { sprintCheckinIsSubmitted } = useGetSprintCheckinStatus({ id });
  const { sprintEndDate } = useGetSprintEndDate({
    sprintNumber: number.toString(),
  });

  function renderWeeklyCheckinButton() {
    if (sprintCheckinIsSubmitted) {
      return (
        <Button variant="primary" size="lg" className="group" disabled={true}>
          <CheckCircleIcon className="h-[18px] w-[18px]" />
          Check-in Submitted
        </Button>
      );
    } else {
      return (
        <Button
          variant="primary"
          size="lg"
          className="group self-center"
          disabled={false}
        >
          <DocumentCheckIcon className="h-[18px] w-[18px]" />
          Submit Check-in
          <ArrowRightIcon className="h-[18px] w-0 transition-all group-hover:w-[18px]" />
        </Button>
      );
    }
  }

  const getBadgeValue = (userDate: Date): string => {
    if (sprintEndDate) {
      if (isSameDay(userDate, sprintEndDate)) {
        return "Due today";
      } else if (isSameDay(userDate, sub(sprintEndDate, { days: 1 }))) {
        return "Pending Submission";
      }
    }

    return "";
  };

  const badgeValue = getBadgeValue(userDate);

  return (
    <div className="flex flex-col rounded-2xl border-2 border-base-100 bg-base-200 p-6">
      <div className="flex flex-row justify-between pb-[9px]">
        <p className="text-xl font-semibold">Weekly Check-in</p>
        {badgeValue ? (
          <Badge
            title={badgeValue}
            variant={badgeValue === "Due today" ? "error" : "warning"}
          />
        ) : null}
      </div>
      <p className="pb-6 text-base font-medium">
        How did that last sprint with your team go?
      </p>
      <Link
        href={routePaths.weeklyCheckInPage(teamId, number.toString())}
        className="self-center"
      >
        {renderWeeklyCheckinButton()}
      </Link>
    </div>
  );
}

export default CheckInWidget;
