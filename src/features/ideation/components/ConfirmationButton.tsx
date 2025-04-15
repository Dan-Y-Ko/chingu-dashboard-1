import { useParams } from "next/navigation";
import { Button } from "@chingu-x/components/button";
import { Spinner } from "@chingu-x/components/spinner";
import { type FinalizedIdeation } from "./FinalizeIdeationList";
import { useFinalizeIdeationMutation } from "@/features/ideation/hooks/useFinalizeIdeationMutation";

interface ConfirmationButtonProps {
  finalizedIdeation: FinalizedIdeation;
}

export default function ConfirmationButton({
  finalizedIdeation,
}: ConfirmationButtonProps) {
  const { teamId } = useParams<{ teamId: string }>();
  const { isFinalizeIdeationPending, finalizeIdeationMutation } =
    useFinalizeIdeationMutation({ teamId });

  function handleClick() {
    finalizeIdeationMutation({ teamId, ideationId: finalizedIdeation.id });
  }

  function renderButtonContent() {
    if (isFinalizeIdeationPending) {
      return <Spinner />;
    }

    return "Finalize Project Idea Selection";
  }

  return (
    <Button
      variant="secondary"
      disabled={!finalizedIdeation}
      className="mb-4 mt-10 w-full"
      onClick={handleClick}
    >
      {renderButtonContent()}
    </Button>
  );
}
