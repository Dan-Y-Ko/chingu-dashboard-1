import { useEffect, useState } from "react";
import { CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";
import {
  useGetMeetingDate,
  useGetMeetingTimeWithTZAbbreviation,
} from "@/features/timezone/hooks/useTimezoneAdapters";

interface DateTimeComponentWrapper {
  dateTime: string;
}

export default function DateTimeComponent({
  dateTime,
}: DateTimeComponentWrapper) {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { getMeetingDate } = useGetMeetingDate({ dateTime });
  const { getMeetingTime } = useGetMeetingTimeWithTZAbbreviation({ dateTime });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <p className="flex items-center gap-x-2">
        <CalendarDaysIcon className="h-[15px] w-[15px]" />
        {getMeetingDate}
      </p>
      <p className="flex items-center gap-x-2">
        <ClockIcon className="h-[15px] w-[15px]" />
        {getMeetingTime}
      </p>
    </>
  );
}
