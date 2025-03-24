import { useQuery } from "@tanstack/react-query";
import { useFetchSprintMeetingForm } from "@/features/sprint-meeting/hooks/useSprintMeetingAdapters";

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
    queryKey: [],
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
