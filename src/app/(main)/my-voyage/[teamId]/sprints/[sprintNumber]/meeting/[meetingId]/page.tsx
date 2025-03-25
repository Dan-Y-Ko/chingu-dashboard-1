"use client";

import "reflect-metadata";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Sprint } from "@chingu-x/modules/sprints";
import { Forms } from "@chingu-x/modules/forms";
import { useQuery } from "@tanstack/react-query";
import { BannerContainer } from "@chingu-x/components/banner-container";
import { Banner } from "@chingu-x/components/banner";
import { Spinner } from "@chingu-x/components/spinner";
import { useEffect } from "react";
import { currentDate } from "@/shared/utils/getCurrentDate";
import { ErrorType } from "@/shared/utils/error";
import ErrorComponent from "@/shared/components/Error";
import { useAppDispatch } from "@/shared/store";
import {
  sprintsAdapter,
  useGetCurrentSprint,
} from "@/features/sprints/hooks/useSprintsAdapters";
import { sprintMeetingAdapter } from "@/features/sprint-meeting/hooks/useSprintMeetingAdapters";
import { CacheTag } from "@/shared/utils/cacheTag";
import { fetchMeeting } from "@/store/features/sprint-meeting/sprintMeetingSlice";
import routePaths from "@/shared/utils/routePaths";
import { useIsVoyageProjectSubmittedStatus } from "@/features/voyage-team/hooks/useVoyageTeamAdapters";
import ProgressStepper from "@/features/sprints/components/ProgressStepper";
import SprintActions from "@/features/sprints/components/SprintActions";
import MeetingOverview from "@/features/sprint-meeting/components/meeting-overview/MeetingOverview";
import Agendas from "@/features/sprint-meeting/components/agenda/Agendas";
import Sections from "@/features/sprint-meeting/components/sections/Sections";
import { useSprintMeetingStateSelector } from "@/features/sprint-meeting/hooks/useSprintMeetingStateSelector";
import { useSprintStateSelector } from "@/features/sprints/hooks/useSprintStateSelector";
import { useUserStateSelector } from "@/features/user/hooks/useUserStateSelector";

interface SprintWeekPageProps {
  params: {
    teamId: string;
    sprintNumber: string;
    meetingId: string;
  };
}

export default function SprintWeekPage({ params }: SprintWeekPageProps) {
  const { teamId } = params;
  const { sprintNumber, meetingId } = params;
  const user = useUserStateSelector();
  const sprints = useSprintStateSelector();
  const sprintMeeting = useSprintMeetingStateSelector();
  const router = useRouter();

  const { currentSprint } = useGetCurrentSprint();

  const currentSprintNumber = currentSprint!.number;

  const agendas =
    sprintMeetingAdapter.getSprintMeeting({
      meeting: sprintMeeting,
      meetingId,
    })?.agendas ?? [];

  const { isVoyageProjectSubmitted } = useIsVoyageProjectSubmittedStatus({
    teamId,
  });

  useEffect(() => {
    if (sprints.sprints.length < 1) {
      router.push(routePaths.sprintsPage(teamId));
    }
  }, [router, sprints.sprints.length, teamId]);

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

  // Redirect if a user tries to access a sprint which hasn't started yet
  if (Number(sprintNumber) > currentSprintNumber) {
    router.push(
      routePaths.emptySprintPage(teamId, currentSprintNumber.toString()),
    );
  }

  // Check if a checkin form for the current sprint has been submitted
  const sprintCheckinIsSubmitted = sprintsAdapter.getSprintCheckinStatus({
    user,
    sprintId: currentSprint!.id,
  });

  if (isVoyageProjectSubmitted) {
    router.push(routePaths.sprintsPage(teamId));
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
      <MeetingOverview
        title={data.title!}
        dateTime={data.dateTime!}
        meetingLink={data.meetingLink!}
        description={data.description!}
      />
      <Agendas params={params} topics={agendas} />
      <Sections
        params={params}
        notes={data.notes}
        planning={data.formResponseMeeting!.find(
          (section) => section.form.id === Number(Forms.planning),
        )}
        review={data.formResponseMeeting!.find(
          (section) => section.form.id === Number(Forms.review),
        )}
      />
    </div>
  );
}
