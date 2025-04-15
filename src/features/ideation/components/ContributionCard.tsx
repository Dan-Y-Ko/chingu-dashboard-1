import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@chingu-x/components/badge";
import Image from "next/image";
import { Avatar } from "@chingu-x/components/avatar";
import { Button } from "@chingu-x/components/button";
import { cn } from "@chingu-x/components/tw-merge";
import type { VoyageMember } from "@chingu-x/modules/features";
import { useUserStateSelector } from "@/features/user/hooks/useUserStateSelector";
import routePaths from "@/shared/utils/routePaths";

interface ContributionCardPropsBase {
  className?: string;
  contributed_by: {
    member: VoyageMember;
  };
  isIdeationFinalized: boolean;
}

interface IdeationFinalizedProps {
  isIdeationFinalized: true;
  projectIdeaId?: number;
}

interface IdeationNotFinalizedProps {
  isIdeationFinalized: false;
  projectIdeaId: number;
}

type ContributionCardProps = ContributionCardPropsBase &
  (IdeationFinalizedProps | IdeationNotFinalizedProps);

export default function ContributionCard({
  contributed_by,
  className,
  projectIdeaId,
  isIdeationFinalized,
}: ContributionCardProps) {
  const { teamId } = useParams<{ teamId: string }>();
  const { id } = useUserStateSelector();
  const [ownVote, setOwnVote] = useState<boolean>(false);
  const { member } = contributed_by;

  useEffect(() => {
    if (member.id === id) {
      setOwnVote(true);
    }
  }, [member, id]);

  return (
    <div className={cn("w-[200px] rounded-lg bg-base-100", className)}>
      <section className="flex flex-col items-start gap-y-4 p-4">
        <h1 className="text-base font-medium text-base-300">Contributed By</h1>
        {/* TO DO: replace undefined with default avatar when it is ready. */}
        <Badge title={member.firstName}>
          {member.avatar ? (
            <Avatar customClassName="h-4 w-4">
              <Image
                src={member.avatar}
                alt={`${member.firstName}'s avatar`}
                width={20}
                height={20}
              />
            </Avatar>
          ) : undefined}
        </Badge>
        {ownVote && !isIdeationFinalized ? (
          <Link
            href={routePaths.editIdeationPage(teamId, projectIdeaId.toString())}
            className="w-full"
          >
            <Button variant="outline" className="w-full">
              Edit Project
            </Button>
          </Link>
        ) : null}
      </section>
    </div>
  );
}
