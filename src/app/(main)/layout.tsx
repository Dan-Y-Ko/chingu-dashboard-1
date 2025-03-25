"use client";

import "reflect-metadata";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Navbar } from "@chingu-x/components/navbar";
import { Spinner } from "@chingu-x/components/spinner";
import { useEffect } from "react";
import ModeToggle from "@/shared/components/ModeToggle";
import AuthHeader from "@/features/auth/components/AuthHeader";
import { useAppDispatch } from "@/shared/store";
import routePaths from "@/shared/utils/routePaths";
import { CacheTag } from "@/shared/utils/cacheTag";
import { currentDate } from "@/shared/utils/getCurrentDate";
import ChinguMenu from "@/shared/components/navbar/ChinguMenu";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { setCurrentVoyageTeam } from "@/features/voyage-team/store/currentVoyageTeamSlice";
import Sidebar from "@/shared/components/sidebar/Sidebar";
import { useGetCurrentVoyageTeam } from "@/features/voyage-team/hooks/useVoyageTeamAdapters";
import { useFetchUserQuery } from "@/features/user/hooks/useFetchUserQuery";
import { sprintsAdapter } from "@/features/sprints/hooks/useSprintsAdapters";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { isFetchCurrentUserPending, isfetchCurrentUserError } =
    useFetchUserQuery();

  if (isfetchCurrentUserError) {
    router.push(routePaths.signIn());
  }

  if (isfetchAllSprintsError) {
    dispatch(
      onOpenModal({
        type: "error",
        content: { message: fetchAllSprintsError.message },
      }),
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col">
      <Navbar logo={<ChinguMenu />}>
        <>
          <ModeToggle />
          <>
            <AuthHeader />
          </>
        </>
      </Navbar>
      <div className="relative flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex w-full flex-1 flex-col items-center overflow-y-auto p-10">
          <div className="flex w-full max-w-[1500px] flex-col gap-y-10">
            {isFetchCurrentUserPending || fetchAllSprintsPending ? (
              <div className="flex min-h-screen items-center justify-center">
                <Spinner />
              </div>
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
