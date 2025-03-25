import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { sprintMeetingAdapter } from "./useSprintMeetingAdapters";
import { useUserStateSelector } from "@/features/user/hooks/useUserStateSelector";
import { CacheTag } from "@/shared/utils/cacheTag";
import { useAppDispatch } from "@/shared/store";
import { fetchMeeting } from "@/store/features/sprint-meeting/sprintMeetingSlice";

interface UseFetchSprintMeetingQueryProps {
  teamId: string;
  meetingId: string;
}

export function useFetchSprintMeetingQuery({
  teamId,
  meetingId,
}: UseFetchSprintMeetingQueryProps) {
  const user = useUserStateSelector();
  const dispatch = useAppDispatch();

  const {
    isPending: isFetchSprintMeetingPendng,
    isError: isFetchSprintMeetingError,
    error: fetchSprintMeetingError,
    data,
  } = useQuery({
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

  return {
    isFetchSprintMeetingPendng,
    isFetchSprintMeetingError,
    fetchSprintMeetingError,
  };
}
