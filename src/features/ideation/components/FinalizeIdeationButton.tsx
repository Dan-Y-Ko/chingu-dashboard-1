import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@chingu-x/components/button";
import { useIdeationStateSelector } from "@/features/ideation/hooks/useIdeationStateSelector";
import routePaths from "@/shared/utils/routePaths";

export default function FinalizeIdeationButton() {
  const { teamId } = useParams<{ teamId: string }>();
  const { projectIdeas } = useIdeationStateSelector();

  return (
    <Link href={routePaths.finalizeIdeationPage(teamId)} className="w-full">
      <Button
        variant="secondary"
        size="lg"
        className="w-full"
        disabled={
          projectIdeas.length === 0 ||
          !projectIdeas.some((i) => i.projectIdeaVotes.length > 0)
        }
      >
        Finalize Selection
      </Button>
    </Link>
  );
}
