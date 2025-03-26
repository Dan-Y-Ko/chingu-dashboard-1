import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useFetchMeeting } from "./useSprintMeetingAdapters";
import { CacheTag } from "@/shared/utils/cacheTag";
import { useAppDispatch } from "@/shared/store";
import { fetchMeetingState } from "@/store/features/sprint-meeting/sprintMeetingSlice";

interface UseFetchSprintMeetingQueryProps {
  meetingId: string;
}

export function useFetchSprintMeetingQuery({
  meetingId,
}: UseFetchSprintMeetingQueryProps) {
  const dispatch = useAppDispatch();
  const { fetchMeeting } = useFetchMeeting();

  const {
    isPending: isFetchSprintMeetingPendng,
    isError: isFetchSprintMeetingError,
    error: fetchSprintMeetingError,
    data,
  } = useQuery({
    queryKey: [CacheTag.sprintMeetingId, { meetingId: `${meetingId}` }],
    queryFn: fetchMeetingQuery,
    staleTime: 1000 * 60 * 5,
  });

  async function fetchMeetingQuery() {
    return await fetchMeeting({ meetingId });
  }

  useEffect(() => {
    if (data) {
      dispatch(fetchMeetingState(data));
    }
  }, [data, dispatch]);

  return {
    isFetchSprintMeetingPendng,
    isFetchSprintMeetingError,
    fetchSprintMeetingError,
  };
}
