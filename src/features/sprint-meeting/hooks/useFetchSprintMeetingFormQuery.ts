import { useQuery } from "@tanstack/react-query";
import { useFetchSprintMeetingForm } from "@/features/sprint-meeting/hooks/useSprintMeetingAdapters";
import { CacheTag } from "@/shared/utils/cacheTag";

interface UseFetchSprintMeetingFormQueryProps {
  id: number;
  meetingId: string;
}

export function useFetchSprintMeetingFormQuery({
  id,
  meetingId,
}: UseFetchSprintMeetingFormQueryProps) {
  const { fetchSprintMeetingForm } = useFetchSprintMeetingForm();

  useQuery({
    queryKey: [CacheTag.fetchSprintMeetingFormFn, { meetingId }],
    queryFn: fetchSprintMeetingFormFn,
    enabled: false,
  });

  async function fetchSprintMeetingFormFn() {
    return await fetchSprintMeetingForm({ meetingId, formId: id });
  }

  return {
    fetchSprintMeetingFormFn,
  };
}
