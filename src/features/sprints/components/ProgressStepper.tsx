"use client";

import { useParams, useRouter } from "next/navigation";
import { RocketLaunchIcon } from "@heroicons/react/24/outline";
import { Stepper, type SteppersItem } from "@chingu-x/components/stepper";
import routePaths from "@/shared/utils/routePaths";
import { useGetSprintMeetingId } from "@/features/sprint-meeting/hooks/useSprintMeetingAdapters";
import { useSprintStateSelector } from "@/features/sprints/hooks/useSprintStateSelector";

function getStatus(sprintNumber: number, currentSprintNumber: number) {
  if (sprintNumber < currentSprintNumber) {
    return "completed";
  } else if (sprintNumber === currentSprintNumber) {
    return "current";
  } else {
    return "remaining";
  }
}

interface ProgressStepperProps {
  currentSprintNumber: number;
}

export default function ProgressStepper({
  currentSprintNumber,
}: ProgressStepperProps) {
  const router = useRouter();
  const params = useParams<{ teamId: string; sprintNumber: string }>();
  const sprints = useSprintStateSelector();
  const { getSprintMeetingId } = useGetSprintMeetingId();

  function handleClick(sprintNumber: number) {
    const meetingId = getSprintMeetingId({
      sprints: sprints.sprints,
      sprintNumber,
    });

    if (meetingId) {
      router.push(
        routePaths.sprintWeekPage(
          params.teamId,
          sprintNumber.toString(),
          meetingId.toString(),
        ),
      );
    } else {
      router.push(
        routePaths.emptySprintPage(params.teamId, sprintNumber.toString()),
      );
    }
  }

  const steppers = [
    {
      icon: <RocketLaunchIcon className="h-[1.125rem]" />,
      isActive: params.sprintNumber == "1",
      name: "Sprint 1",
      onClickEvent: () => handleClick(1),
      status: getStatus(1, currentSprintNumber),
    },
    {
      icon: <RocketLaunchIcon className="h-[1.125rem]" />,
      isActive: params.sprintNumber == "2",
      name: "Sprint 2",
      onClickEvent: () => handleClick(2),
      status: getStatus(2, currentSprintNumber),
    },
    {
      icon: <RocketLaunchIcon className="h-[1.125rem]" />,
      isActive: params.sprintNumber == "3",
      name: "Sprint 3",
      onClickEvent: () => handleClick(3),
      status: getStatus(3, currentSprintNumber),
    },
    {
      icon: <RocketLaunchIcon className="h-[1.125rem]" />,
      isActive: params.sprintNumber == "4",
      name: "Sprint 4",
      onClickEvent: () => handleClick(4),
      status: getStatus(4, currentSprintNumber),
    },
    {
      icon: <RocketLaunchIcon className="h-[1.125rem]" />,
      isActive: params.sprintNumber == "5",
      name: "Sprint 5",
      onClickEvent: () => handleClick(5),
      status: getStatus(5, currentSprintNumber),
    },
    {
      icon: <RocketLaunchIcon className="h-[1.125rem]" />,
      isActive: params.sprintNumber == "6",
      name: "Sprint 6",
      onClickEvent: () => handleClick(6),
      status: getStatus(6, currentSprintNumber),
    },
  ] as SteppersItem[];

  return (
    <Stepper stepperWidth="w-full" steppers={steppers} styleType="icons" />
  );
}
