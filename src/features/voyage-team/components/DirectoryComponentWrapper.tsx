"use client";

import "reflect-metadata";
import { Spinner } from "@chingu-x/components/spinner";
import TeamMember from "./TeamMember";
import ErrorComponent from "@/shared/components/Error";
import { ErrorType } from "@/shared/utils/error";
import { useMyTeamStateSelector } from "@/features/voyage-team/hooks/useMyTeamStateSelector";
import { useFetchMyTeamQuery } from "@/features/voyage-team/hooks/useFetchMyTeamQuery";

interface TeamDirectoryProps {
  params: {
    teamId: string;
  };
}

export default function DirectoryComponentWrapper({
  params,
}: TeamDirectoryProps) {
  const myTeam = useMyTeamStateSelector();
  const { teamId } = params;
  const { isFetchMyTeamPending, isFetchMyTeamError, fetchMyTeamError } =
    useFetchMyTeamQuery({
      teamId,
    });

  if (isFetchMyTeamError) {
    <ErrorComponent
      errorType={ErrorType.FETCH_MY_TEAM}
      message={fetchMyTeamError!.message}
    />;
  }

  if (isFetchMyTeamPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {/* For screens > 1920px */}
      <div className="flex w-full flex-col gap-y-10 rounded-2xl border border-transparent bg-transparent p-10 pb-4 text-base-300 3xl:gap-y-0 3xl:bg-base-200">
        {/* header - table only */}
        <div className="mb-6 hidden items-center text-xl font-semibold text-base-300 3xl:grid 3xl:grid-cols-5">
          <h2>Name</h2>
          <h2>Discord ID</h2>
          <h2>Time Zone</h2>
          <h2>Position</h2>
          <h2>Average Hour/Sprint</h2>
        </div>
        {/* data */}
        {myTeam.voyageTeamMembers.map((teamMember) => (
          <TeamMember key={teamMember.id} teamMember={teamMember} />
        ))}
      </div>
    </>
  );
}
