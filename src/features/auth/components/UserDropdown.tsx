"use client";

import "reflect-metadata";
import Link from "next/link";
import { Button } from "@chingu-x/components/button";
import { DropDown } from "@chingu-x/components/navbar";
import { useCurrentVoyageTeamStateSelector } from "@/features/voyage-team/hooks/useCurrentVoyageTeamStateSelector";
import { useLogoutMutation } from "@/features/auth/hooks/useLogoutMutation";

interface DropdownProps {
  openState?: boolean;
}

export default function UserDropDown({ openState }: DropdownProps) {
  const { logoutMutation } = useLogoutMutation();
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
    logoutMutation();
  }

  return (
    <DropDown openState={openState}>
      <div className="rounded-lg bg-secondary-content p-2 text-xs [&>*]:m-1">
        <p className="text-[10px] font-medium text-neutral-focus">My Voyage:</p>
        {currentTeam[0]?.voyageTeam.name ? (
          <p className="text-base font-medium text-base-300">{currentVoyage}</p>
        ) : (
          <p className="font-semibold text-base-300">{currentVoyage}</p>
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
