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
import { useSprintMeeting, useUser } from "@/store/hooks";
import { useAppDispatch } from "@/shared/store";
import { sprintMeetingAdapter, sprintsAdapter } from "@/shared/utils/adapters";
import { CacheTag } from "@/shared/utils/cacheTag";
import { fetchMeeting } from "@/store/features/sprint-meeting/sprintMeetingSlice";
import routePaths from "@/shared/utils/routePaths";
import { useSprint } from "@/features/sprints/hooks/useSprint";
import { voyageTeamAdapter } from "@/features/voyage-team/hooks/useVoyageTeamAdapters";
import { useCurrentVoyageTeamStateSelector } from "@/features/voyage-team/hooks/useCurrentVoyageTeamStateSelector";
import VoyageSubmittedMessage from "@/features/sprints/components/VoyageSubmittedMessage";
import ProgressStepper from "@/features/sprints/components/ProgressStepper";
import SprintActions from "@/features/sprints/components/SprintActions";
import MeetingOverview from "@/features/sprint-meeting/components/meetingOverview/MeetingOverview";
import Agendas from "@/features/sprint-meeting/components/agenda/Agendas";
import Sections from "@/features/sprint-meeting/components/sections/Sections";

interface SprintPageProps {
  params: {
    teamId: string;
    sprintNumber: string;
    meetingId: string;
  };
}

export default function SprintPage({ params }: SprintPageProps) {
  const { teamId } = params;
  const { sprintNumber, meetingId } = params;
  const user = useUser();
  const sprints = useSprint();
  const sprintMeeting = useSprintMeeting();
  const currentVoyageTeam = useCurrentVoyageTeamStateSelector();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { number, id } = sprintsAdapter.getCurrentSprint({
    currentDate,
    sprints: sprints.sprints,
  }) as Sprint;

  const currentSprintNumber = number;

  const agendas =
    sprintMeetingAdapter.getSprintMeeting({
      meeting: sprintMeeting,
      meetingId,
    })?.agendas ?? [];

  const isVoyageProjectSubmitted =
    voyageTeamAdapter.getVoyageProjectSubmissionStatus({
      currentVoyageTeam,
      teamId,
    });

  const { isPending, isError, error, data } = useQuery({
    queryKey: [
      CacheTag.sprintMeetingId,
      { teamId, user: `${user.id}`, meetingId: `${meetingId}` },
    ],
    queryFn: fetchMeetingQuery,
  });

  async function fetchMeetingQuery() {
    return await sprintMeetingAdapter.fetchMeeting({ meetingId });
  }

  useEffect(() => {
    if (data) {
      dispatch(fetchMeeting(data));
    }
  }, [data, dispatch]);

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
    sprintId: id,
  });

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
