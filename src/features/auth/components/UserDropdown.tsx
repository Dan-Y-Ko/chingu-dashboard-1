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
import { useCurrentVoyageTeamStateSelector } from "@/features/voyage-team/hooks/useCurrentVoyageTeamStateSelector";

interface DropdownProps {
  openState?: boolean;
}

export default function UserDropDown({ openState }: DropdownProps) {
  const currentTeam = useCurrentVoyageTeamStateSelector();
  let currentVoyage;

  if (currentTeam[0]?.voyageTeam.name) {
    currentVoyage = `Team - Tier ${currentTeam[0].voyageTeam.name
      .split("-")[1]
      .split("tier")[1]
      .toUpperCase()} ${currentTeam[0].voyageTeam.name
      .split("-")[0]
      .toUpperCase()}`;
  } else {
    currentVoyage = "Please join a voyage to see your status information.";
  }

  function handleClick() {
    mutate();
  }

  return (
    <DropDown openState={openState}>
      <div className="rounded-lg bg-secondary-content p-2 text-xs [&>*]:m-1">
        <p className="text-[10px] font-medium text-neutral-focus">My Voyage:</p>
        {currentTeam[0]?.voyageTeam.name ? (
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
