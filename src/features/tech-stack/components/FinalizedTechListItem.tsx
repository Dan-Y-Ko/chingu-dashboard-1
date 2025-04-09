import { Avatar } from "@chingu-x/components/avatar";
import Image from "next/image";
import { AvatarGroup } from "@chingu-x/components/avatar-group";
import type { TechStackItemVotes } from "@chingu-x/modules/tech-stack";
import React from "react";

interface FinalizedTechListItemProps {
  name: string;
  votes: TechStackItemVotes[];
}
export default function FinalizedTechListItem({
  name,
  votes,
}: FinalizedTechListItemProps) {
  const avatars = votes.map((vote) => vote.votedBy.member);

  return (
    <div className="flex h-12 items-center rounded-md bg-base-100 px-4 py-2">
      <h1 className="w-1/3 font-medium">{name}</h1>
      <AvatarGroup>
        {avatars.map((member) => (
          <Avatar key={member.id}>
            <Image
              src={member.avatar}
              alt={`${member.firstName}'s avatar`}
              width={24}
              height={24}
            />
          </Avatar>
        ))}
      </AvatarGroup>
    </div>
  );
}
