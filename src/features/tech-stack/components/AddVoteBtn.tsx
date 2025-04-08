import { Button } from "@chingu-x/components/button";
import { Spinner } from "@chingu-x/components/spinner";
import { useAddTechStackVoteMutation } from "@/features/tech-stack/hooks/useAddTechStackVoteMutation";

interface AddVoteBtnProps {
  techItemId: number;
}

export default function AddVoteBtn({ techItemId }: AddVoteBtnProps) {
  const { isAddTechStackVotePending, addTechStackVoteMutation } =
    useAddTechStackVoteMutation();

  const handleClick = () => {
    addTechStackVoteMutation({ teamTechItemId: techItemId });
  };

  return (
    <div className="col-span-3 flex justify-end">
      <Button
        variant="primary"
        size="xs"
        className={`rounded-3xl font-semibold ${isAddTechStackVotePending && "w-3/4"}`}
        onClick={handleClick}
        disabled={isAddTechStackVotePending}
      >
        {isAddTechStackVotePending ? <Spinner /> : "Add Vote"}
      </Button>
    </div>
  );
}
