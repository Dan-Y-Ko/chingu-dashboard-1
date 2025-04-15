import { useState } from "react";
import { Avatar } from "@chingu-x/components/avatar";
import Image from "next/image";
import { AvatarGroup } from "@chingu-x/components/avatar-group";
import { Tooltip } from "@chingu-x/components/tooltip";
import { Button } from "@chingu-x/components/button";
import { cn } from "@chingu-x/components/tw-merge";
import { Spinner } from "@chingu-x/components/spinner";
import type { ProjectIdeaVotes } from "@chingu-x/modules/ideation";
import { useParams } from "next/navigation";
import { useAddIdeationVoteMutation } from "@/features/ideation/hooks/useAddIdeationVoteMutation";
import { useRemoveIdeationVoteMutation } from "@/features/ideation/hooks/useRemoveIdeationVoteMutation";
import {
  useGetIdeationById,
  useHasCurrenUserVote,
} from "@/features/ideation/hooks/useIdeationAdapters";

interface VoteCardProps {
  projectIdeaId: number;
  users: ProjectIdeaVotes[];
  className?: string;
}

function VoteCard({ projectIdeaId, users, className }: VoteCardProps) {
  const { teamId } = useParams<{ teamId: string }>();
  const [tooltipHovered, setTooltipHovered] = useState<string>("");
  const { ideation } = useGetIdeationById({ ideationId: projectIdeaId });
  const { hasCurrentUserVote } = useHasCurrenUserVote({ ideation });
  const { isAddIdeationVotePending, addIdeationVoteMutation } =
    useAddIdeationVoteMutation({ teamId });

  const { isRemoveIdeationVotePending, removeIdeationVoteMutation } =
    useRemoveIdeationVoteMutation({ teamId });

  function handleVote() {
    if (hasCurrentUserVote) {
      removeIdeationVoteMutation({ ideationId: projectIdeaId });
    } else {
      addIdeationVoteMutation({ ideationId: projectIdeaId });
    }
  }

  function buttonContent() {
    if (isAddIdeationVotePending || isRemoveIdeationVotePending) {
      return <Spinner />;
    }

    if (hasCurrentUserVote) {
      return "Remove Vote";
    } else {
      return "Add Vote";
    }
  }

  return (
    <div className={cn("w-[200px] rounded-lg bg-base-100", className)}>
      <section className="flex flex-col items-start gap-y-4 p-4">
        <h1 className="text-3xl font-semibold text-base-300">{users.length}</h1>
        <h2 className="text-xl font-semibold text-base-300">{`Vote${
          users.length > 1 ? "s" : ""
        }`}</h2>
        <AvatarGroup>
          {users.map((user) => (
            <Tooltip
              key={user.votedBy.member.id}
              content={`${user.votedBy.member.firstName}`}
              customClassName="text-xs font-medium w-fit"
              position="bottom"
              tooltipWidth="small"
              isDisplay={tooltipHovered === user.votedBy.member.id}
              hovered={tooltipHovered === user.votedBy.member.id}
            >
              <Avatar
                customClassName="border border-base-content h-6 w-6"
                onMouseEnter={() => {
                  setTooltipHovered(user.votedBy.member.id);
                }}
                onMouseLeave={() => {
                  setTooltipHovered("");
                }}
              >
                <Image
                  src={user.votedBy.member.avatar}
                  alt={`${user.votedBy.member.firstName}'s avatar`}
                  width={24}
                  height={24}
                ></Image>
              </Avatar>
            </Tooltip>
          ))}
        </AvatarGroup>
        <Button
          type="submit"
          size="lg"
          variant={`${hasCurrentUserVote ? "error" : "primary"}`}
          className={`w-full ${hasCurrentUserVote ? "text-base-300" : ""}`}
          onClick={handleVote}
          disabled={isAddIdeationVotePending || isRemoveIdeationVotePending}
        >
          {buttonContent()}
        </Button>
      </section>
    </div>
  );
}

export default VoteCard;
