"use client";

import "reflect-metadata";
import { useRouter } from "next/navigation";
import { Navbar } from "@chingu-x/components/navbar";
import { Spinner } from "@chingu-x/components/spinner";
import ModeToggle from "@/shared/components/ModeToggle";
import AuthHeader from "@/features/auth/components/AuthHeader";
import { useAppDispatch } from "@/shared/store";
import routePaths from "@/shared/utils/routePaths";
import ChinguMenu from "@/shared/components/navbar/ChinguMenu";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import Sidebar from "@/shared/components/sidebar/Sidebar";
import { useFetchUserQuery } from "@/features/user/hooks/useFetchUserQuery";
import { useFetchAllSprintsQuery } from "@/features/sprints/hooks/useFetchAllSprintsQuery";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isFetchCurrentUserPending, isfetchCurrentUserError } =
    useFetchUserQuery();
  const {
    isFetchAllSprintsPending,
    isfetchAllSprintsError,
    fetchAllSprintsError,
  } = useFetchAllSprintsQuery();

  if (isfetchCurrentUserError) {
    router.push(routePaths.signIn());
  }

  if (isfetchAllSprintsError) {
    dispatch(
      onOpenModal({
        type: "error",
        content: { message: fetchAllSprintsError!.message },
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
            {isFetchCurrentUserPending || isFetchAllSprintsPending ? (
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
