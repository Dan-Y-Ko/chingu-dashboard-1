import { Button } from "@chingu-x/components/button";
import { Spinner } from "@chingu-x/components/spinner";
import { useParams } from "next/navigation";
import { useRemoveTechStackVoteMutation } from "@/features/tech-stack/hooks/useRemoveTechStackVoteMutation";

interface RemoveVoteBtnProps {
  techItemId: number;
}

export default function RemoveVoteBtn({ techItemId }: RemoveVoteBtnProps) {
  const { teamId } = useParams<{ teamId: string }>();
  const { isRemoveTechStackVotePending, removeTechStackVoteMutation } =
    useRemoveTechStackVoteMutation({ teamId });

  const handleClick = () => {
    removeTechStackVoteMutation({ teamTechItemId: techItemId });
  };

  return (
    <Button
      variant="error"
      size="xs"
      className={`justify-self-end rounded-3xl font-semibold ${
        isRemoveTechStackVotePending && "w-3/4"
      }`}
      onClick={handleClick}
      disabled={isRemoveTechStackVotePending}
    >
      {isRemoveTechStackVotePending ? <Spinner /> : "Remove Vote"}
    </Button>
  );
}
