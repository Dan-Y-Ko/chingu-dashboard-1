"use client";

import "reflect-metadata";
import { Spinner } from "@chingu-x/components/spinner";
import ErrorComponent from "@/shared/components/Error";
import { ErrorType } from "@/shared/utils/error";
import { useFetchMyTeamQuery } from "@/features/voyage-team/hooks/useFetchMyTeamQuery";

interface LayoutProps {
  children: React.ReactNode;
  params: {
    teamId: string;
  };
}

export default function Layout({ children, params }: LayoutProps) {
  const { teamId } = params;
  const { isFetchMyTeamPending, isFetchMyTeamError, fetchMyTeamError } =
    useFetchMyTeamQuery({ teamId });

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
  return <>{children}</>;
}
