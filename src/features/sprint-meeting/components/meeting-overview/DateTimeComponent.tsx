import { useEffect, useState } from "react";
import { CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useUserStateSelector } from "@/features/user/hooks/useUserStateSelector";
import { timezoneAdapter } from "@/features/timezone/hooks/useTimezoneAdapters";

interface DateTimeComponentWrapper {
  dateTime: string;
}

export default function DateTimeComponent({
  dateTime,
}: DateTimeComponentWrapper) {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { timezone } = useUserStateSelector();

  const getMeetingDate = timezoneAdapter.getMeetingDate({ dateTime, timezone });

  const getMeetingTime = timezoneAdapter.getMeetingTimeWithTZAbbreviation({
    dateTime,
    timezone,
  });

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
