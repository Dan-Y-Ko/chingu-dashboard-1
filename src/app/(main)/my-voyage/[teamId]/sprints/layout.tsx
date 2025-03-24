"use client";

import "reflect-metadata";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Spinner } from "@chingu-x/components/spinner";
import ErrorComponent from "@/shared/components/Error";
import { fetchTeamDirectory } from "@/store/features/my-team/myTeamSlice";
import { useAppDispatch } from "@/shared/store";
import { myTeamAdapter } from "@/shared/utils/adapters";
import { CacheTag } from "@/shared/utils/cacheTag";
import { ErrorType } from "@/shared/utils/error";
import { useUserStateSelector } from "@/features/user/hooks/useUserStateSelector";

interface LayoutProps {
  children: React.ReactNode;
  params: {
    teamId: string;
  };
}

export default function Layout({ children, params }: LayoutProps) {
  const user = useUserStateSelector();
  const dispatch = useAppDispatch();
  const { teamId } = params;

  const { isPending, isError, error, data } = useQuery({
    queryKey: [CacheTag.myTeam, { teamId, user: `${user.id}` }],
    queryFn: () => getMyTeamQuery(),
  });

  async function getMyTeamQuery() {
    return await myTeamAdapter.fetchMyTeam({ teamId, user });
  }

  useEffect(() => {
    if (data) {
      dispatch(fetchTeamDirectory(data));
    }
  }, [data, dispatch]);

  if (isError) {
    <ErrorComponent
      errorType={ErrorType.FETCH_MY_TEAM}
      message={error.message}
    />;
  }

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }
  return <>{children}</>;
}
