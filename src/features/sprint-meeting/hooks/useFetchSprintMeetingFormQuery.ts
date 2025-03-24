import { useQuery } from "@tanstack/react-query";
import { sprintMeetingAdapter } from "@/features/sprint-meeting/hooks/useSprintMeetingAdapters";

interface UseFetchSprintMeetingFormQueryProps {
  id: number;
  meetingId: string;
}

export function useFetchSprintMeetingFormQuery({
  id,
  meetingId,
}: UseFetchSprintMeetingFormQueryProps) {
  //   const { fetchSprintMeetingForm } = useFetchSprintMeetingForm({
  //     meetingId,
  //     formId: id,
  //   });

  useQuery({
    queryKey: [],
    queryFn: fetchSprintMeetingFormFn,
    enabled: false,
  });

  async function fetchSprintMeetingFormFn() {
    return await sprintMeetingAdapter.fetchSprintMeetingForm({
      meetingId,
      formId: id,
    });
  }

  return {
    fetchSprintMeetingFormFn,
  };
}
