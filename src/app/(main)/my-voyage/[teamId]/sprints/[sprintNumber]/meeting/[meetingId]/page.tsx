"use client";

import "reflect-metadata";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Forms } from "@chingu-x/modules/forms";
import { BannerContainer } from "@chingu-x/components/banner-container";
import { Banner } from "@chingu-x/components/banner";
import { Spinner } from "@chingu-x/components/spinner";
import { useEffect } from "react";
import { ErrorType } from "@/shared/utils/error";
import ErrorComponent from "@/shared/components/Error";
import {
  useGetCurrentSprint,
  useGetSprintCheckinStatus,
} from "@/features/sprints/hooks/useSprintsAdapters";
import {
  useGetSprintAgendas,
  useGetSprintMeeting,
} from "@/features/sprint-meeting/hooks/useSprintMeetingAdapters";
import routePaths from "@/shared/utils/routePaths";
import { useIsVoyageProjectSubmittedStatus } from "@/features/voyage-team/hooks/useVoyageTeamAdapters";
import ProgressStepper from "@/features/sprints/components/ProgressStepper";
import SprintActions from "@/features/sprints/components/SprintActions";
import MeetingOverview from "@/features/sprint-meeting/components/meeting-overview/MeetingOverview";
import Agendas from "@/features/sprint-meeting/components/agenda/Agendas";
import Sections from "@/features/sprint-meeting/components/sections/Sections";
import { useSprintStateSelector } from "@/features/sprints/hooks/useSprintStateSelector";
import { useFetchSprintMeetingQuery } from "@/features/sprint-meeting/hooks/useFetchSprintMeetingQuery";

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
  const sprints = useSprintStateSelector();
  const router = useRouter();
  const { meeting } = useGetSprintMeeting({ meetingId });
  const { agendas } = useGetSprintAgendas({ meetingId });
  const { isVoyageProjectSubmitted } = useIsVoyageProjectSubmittedStatus({
    teamId,
  });
  const { currentSprint } = useGetCurrentSprint();
  const currentSprintNumber = currentSprint?.number;

  const {
    isFetchSprintMeetingPendng,
    isFetchSprintMeetingError,
    fetchSprintMeetingError,
  } = useFetchSprintMeetingQuery({ meetingId, teamId });

  useEffect(() => {
    if (sprints.sprints.length < 1) {
      router.push(routePaths.sprintsPage(teamId));
    }
  }, [router, sprints.sprints.length, teamId]);

  // Check if a checkin form for the current sprint has been submitted
  const { sprintCheckinIsSubmitted } = useGetSprintCheckinStatus({
    id: currentSprint!.id,
  });

  // Redirect if a user tries to access a sprint which hasn't started yet
  useEffect(() => {
    if (currentSprintNumber) {
      if (Number(sprintNumber) > currentSprintNumber) {
        router.push(
          routePaths.emptySprintPage(teamId, currentSprintNumber.toString()),
        );
      }
    }
  }, [currentSprintNumber, router, sprintNumber, teamId]);

  if (isFetchSprintMeetingPendng) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isFetchSprintMeetingError) {
    return (
      <ErrorComponent
        errorType={ErrorType.FETCH_SPRINT}
        message={fetchSprintMeetingError!.message}
      />
    );
  }

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
      {currentSprint && (
        <>
          <ProgressStepper currentSprintNumber={currentSprintNumber!} />
          <SprintActions
            params={params}
            sprintCheckinIsSubmitted={sprintCheckinIsSubmitted}
            voyageProjectIsSubmitted={isVoyageProjectSubmitted}
            currentSprintNumber={currentSprintNumber!}
          />
        </>
      )}

      {meeting && (
        <MeetingOverview
          title={meeting.title!}
          dateTime={meeting.dateTime!}
          meetingLink={meeting.meetingLink!}
          description={meeting.description!}
        />
      )}
      <Agendas params={params} topics={agendas} />
      {meeting && (
        <Sections
          params={params}
          notes={meeting.notes}
          planning={meeting.formResponseMeeting?.find(
            (section) => section.form.id === Number(Forms.planning),
          )}
          review={meeting.formResponseMeeting?.find(
            (section) => section.form.id === Number(Forms.review),
          )}
        />
      )}
    </div>
  );
}
