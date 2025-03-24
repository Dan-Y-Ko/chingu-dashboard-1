import { useAppSelector } from "@/shared/store";

export const useSprintMeetingStateSelector = () =>
  useAppSelector((state) => state.sprintMeeting);
