import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@chingu-x/components/badge";
import Image from "next/image";
import { Avatar } from "@chingu-x/components/avatar";
import { Button } from "@chingu-x/components/button";
import { cn } from "@chingu-x/components/tw-merge";
import routePaths from "@/shared/utils/routePaths";
import {
  useGetIdeationById,
  useIsCurrentUserVote,
} from "@/features/ideation/hooks/useIdeationAdapters";

interface ContributionCardPropsBase {
  className?: string;
  isIdeationFinalized: boolean;
}

interface IdeationFinalizedProps {
  isIdeationFinalized: true;
  projectIdeaId: number;
}

interface IdeationNotFinalizedProps {
  isIdeationFinalized: false;
  projectIdeaId: number;
}

type ContributionCardProps = ContributionCardPropsBase &
  (IdeationFinalizedProps | IdeationNotFinalizedProps);

export default function ContributionCard({
  className,
  projectIdeaId,
  isIdeationFinalized,
}: ContributionCardProps) {
  const { teamId } = useParams<{ teamId: string }>();
  const { ideation } = useGetIdeationById({ ideationId: projectIdeaId });
  const { isCurrentUserVote } = useIsCurrentUserVote({ ideation });
  const {
    contributedBy: { member },
  } = ideation;

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
        {isCurrentUserVote && !isIdeationFinalized ? (
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
