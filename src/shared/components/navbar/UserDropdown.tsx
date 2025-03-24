"use client";

import "reflect-metadata";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LogoutResponseDto } from "@chingu-x/modules/auth";
import { Button } from "@chingu-x/components/button";
import { DropDown } from "@chingu-x/components/navbar";
import { clientSignOut } from "@/features/auth/store/authSlice";
import routePaths from "@/shared/utils/routePaths";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { CacheTag } from "@/shared/utils/cacheTag";
import { authAdapter } from "@/shared/utils/adapters";
import { useAppDispatch } from "@/shared/store";
import { useUserStateSelector } from "@/features/user/hooks/useUserStateSelector";

interface DropdownProps {
  openState?: boolean;
}

export default function UserDropDown({ openState }: DropdownProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const allVoyages = useUserStateSelector().voyageTeamMembers;
  const activeVoyage = allVoyages?.find(
    (item) => item.voyageTeam.voyage.status.name === "Active",
  );

  let currentVoyage;

  if (activeVoyage?.voyageTeam.name) {
    currentVoyage = `Team - Tier ${activeVoyage.voyageTeam.name
      .split("-")[1]
      .split("tier")[1]
      .toUpperCase()} ${activeVoyage.voyageTeam.name
      .split("-")[0]
      .toUpperCase()}`;
  } else {
    currentVoyage = "Please join a voyage to see your status information.";
  }

  function handleClick() {
    mutate();
  }

  async function logoutMutation(): Promise<LogoutResponseDto> {
    return await authAdapter.logout();
  }

  const { mutate } = useMutation<LogoutResponseDto, Error, void>({
    mutationKey: [CacheTag.logout],
    mutationFn: logoutMutation,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: [CacheTag.me] });
      dispatch(clientSignOut());
      router.replace(routePaths.signIn());
    },
    onError: (error: Error) => {
      dispatch(
        onOpenModal({ type: "error", content: { message: error.message } }),
      );
    },
  });

  return (
    <DropDown openState={openState}>
      <div className="rounded-lg bg-secondary-content p-2 text-xs [&>*]:m-1">
        <p className="text-[10px] font-medium text-neutral-focus">My Voyage:</p>
        {activeVoyage?.voyageTeam.name ? (
          <p className="border border-transparent text-base font-medium text-base-300">
            {currentVoyage}
          </p>
        ) : (
          <p className="border-transparent font-semibold text-base-300">
            {currentVoyage}
          </p>
        )}
      </div>
      <Link href="/hello404">
        <Button
          type="button"
          variant="link"
          size="lg"
          className="m-0 flex w-full justify-start p-2 hover:bg-base-100 hover:text-base-300"
        >
          Settings
        </Button>
      </Link>
      <Button
        type="button"
        onClick={handleClick}
        variant="link"
        size="lg"
        className="m-0 flex w-full justify-start p-2 hover:bg-base-100 hover:text-base-300"
      >
        Sign Out
      </Button>
    </DropDown>
  );
}
