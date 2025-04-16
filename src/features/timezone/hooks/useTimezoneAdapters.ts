import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type { TimezoneClientAdapter } from "@chingu-x/modules/timezone";
import type { Meeting } from "@chingu-x/modules/sprint-meeting";
import type { VoyageResource } from "@chingu-x/modules/voyage-resources";
import { useSprintStateSelector } from "@/features/sprints/hooks/useSprintStateSelector";
import { useUserStateSelector } from "@/features/user/hooks/useUserStateSelector";

export const timezoneAdapter = resolve<TimezoneClientAdapter>(
  TYPES.TimezoneClientAdapter,
);

interface UseGetSprintStartDateProps {
  sprintNumber: string;
}

export function useGetSprintStartDate({
  sprintNumber,
}: UseGetSprintStartDateProps) {
  const { sprints } = useSprintStateSelector();
  const { timezone } = useUserStateSelector();

  let sprintStartDate;

  if (sprints.length !== 0) {
    sprintStartDate = timezoneAdapter.getSprintStartDateBySprintNumber({
      sprints,
      sprintNumber,
      timezone,
    });
  }

  return { sprintStartDate };
}

interface UseGetSprintEndDateProps {
  sprintNumber: string;
}

export function useGetSprintEndDate({
  sprintNumber,
}: UseGetSprintEndDateProps) {
  const { sprints } = useSprintStateSelector();
  const { timezone } = useUserStateSelector();

  let sprintEndDate;

  if (sprints.length !== 0) {
    sprintEndDate = timezoneAdapter.getSprintEndDateBySprintNumber({
      sprints,
      sprintNumber,
      timezone,
    });
  }

  return { sprintEndDate };
}

interface UseGetMeetingLongDateTimeFormatProps {
  meetingData: Meeting | undefined;
}

export function useGetMeetingLongDateTimeFormat({
  meetingData,
}: UseGetMeetingLongDateTimeFormatProps) {
  const { timezone } = useUserStateSelector();

  let meetingLongDateTimeFormat;

  if (meetingData) {
    meetingLongDateTimeFormat = timezoneAdapter.getMeetingLongDateTimeFormat({
      meetingDateTime: meetingData.dateTime!,
      timezone,
    });
  }

  return { meetingLongDateTimeFormat };
}

interface UseGetMeetingDateProps {
  dateTime: string;
}

export function useGetMeetingDate({ dateTime }: UseGetMeetingDateProps) {
  const { timezone } = useUserStateSelector();

  const getMeetingDate = timezoneAdapter.getMeetingDate({ dateTime, timezone });

  return { getMeetingDate };
}

interface UseGetMeetingTimeWithTZAbbreviationProps {
  dateTime: string;
}

export function useGetMeetingTimeWithTZAbbreviation({
  dateTime,
}: UseGetMeetingTimeWithTZAbbreviationProps) {
  const { timezone } = useUserStateSelector();

  const getMeetingTime = timezoneAdapter.getMeetingTimeWithTZAbbreviation({
    dateTime,
    timezone,
  });

  return { getMeetingTime };
}

interface UseGetVoyageResourceDateProps {
  voyageResources: VoyageResource[];
  timezone: string;
}

export function useGetVoyageResourceDate({
  voyageResources,
  timezone,
}: UseGetVoyageResourceDateProps) {
  const voyageResourceDate = timezoneAdapter.getVoyageResourceDate({
    voyageResources,
    timezone,
  });

  return { voyageResourceDate };
}
