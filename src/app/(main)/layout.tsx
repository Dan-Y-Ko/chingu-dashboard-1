"use client";

import "reflect-metadata";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Navbar } from "@chingu-x/components/navbar";
import { Spinner } from "@chingu-x/components/spinner";
import ModeToggle from "@/shared/components/ModeToggle";
import AuthHeader from "@/shared/components/navbar/AuthHeader";
import { useAppDispatch } from "@/store/hooks";
import { clientSignIn } from "@/store/features/auth/authSlice";
import routePaths from "@/shared/utils/routePaths";
import { getUserState } from "@/store/features/user/userSlice";
import { CacheTag } from "@/shared/utils/cacheTag";
import {
  sprintsAdapter,
  userAdapter,
  voyageTeamAdapter,
} from "@/shared/utils/adapters";
import { currentDate } from "@/shared/utils/getCurrentDate";
import ChinguMenu from "@/shared/components/navbar/ChinguMenu";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { setCurrentVoyageTeam } from "@/store/features/current-voyage-team/currentVoyageTeamSlice";
import Sidebar from "@/shared/components/sidebar/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    isPending: fetchCurrentUserPending,
    isError: isfetchCurrentUserError,
    data: currentUser,
  } = useQuery({
    queryKey: [CacheTag.me],
    queryFn: getUserQuery,
    staleTime: 1000 * 60 * 30, // This sets it to 30 minutes, which is how long the access token lasts
  });

  const {
    isPending: fetchAllSprintsPending,
    error: fetchAllSprintsError,
    isError: isfetchAllSprintsError,
    data: allSprints,
  } = useQuery({
    queryKey: [CacheTag.fetchAllSprints],
    queryFn: getAllSprintsQuery,
  });

  async function getUserQuery() {
    return await userAdapter.fetchUser({ currentDate });
  }

  async function getAllSprintsQuery() {
    return await sprintsAdapter.fetchAllSprints();
  }

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

  if (currentUser) {
    dispatch(clientSignIn());
    dispatch(getUserState(currentUser));
  }

  if (currentUser && allSprints) {
    const currentTeam = voyageTeamAdapter.getCurrentVoyageTeam({
      user: currentUser,
      sprints: allSprints,
      currentDate: currentDate,
    });

    dispatch(setCurrentVoyageTeam(currentTeam));
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
            {fetchCurrentUserPending || fetchAllSprintsPending ? (
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
