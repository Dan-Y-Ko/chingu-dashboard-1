import { useParams, useRouter } from "next/navigation";
import { Button } from "@chingu-x/components/button";
import { Spinner } from "@chingu-x/components/spinner";
import {
  type FinalizedList,
  finalizeTechStack,
} from "@/app/(main)/my-voyage/[teamId]/tech-stack/techStackService";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import type { SelectedItems } from "@/features/tech-stack/types/types";
import editFinalList from "../utils/editFinalList";

export interface BaseButtonProps {
  allCategoriesSelected?: boolean;
  selectedItems: SelectedItems;
}

export interface FinalizedProps extends BaseButtonProps {
  isFinalized: true;
  previousSelected: SelectedItems;
}

export interface NotFinalizedProps extends BaseButtonProps {
  isFinalized: false;
  previousSelected?: SelectedItems;
}

export type ConfirmationButtonProps = FinalizedProps | NotFinalizedProps;

export default function ConfirmationButton({
  isFinalized,
  allCategoriesSelected,
  selectedItems,
  previousSelected,
}: ConfirmationButtonProps) {
  const params = useParams();
  const teamId = Number(params.teamId);
  const router = useRouter();

  const handleClick = async () => {
    if (isFinalized) {
      const selection = editFinalList(previousSelected, selectedItems);

      const finalList: FinalizedList = {
        categories: selection.map((cat) => ({
          categoryId: cat.categoryId,
          techs: cat.techs,
        })),
      };

      const [res, error] = await finalizeTechStackAction({
        teamId,
        finalizedList: finalList,
      });
      if (res) {
        router.push(routePaths.techStackPage(teamId.toString()));
      }
      if (error) {
        dispatch(
          onOpenModal({ type: "error", content: { message: error.message } }),
        );
      }
    } else {
      const selection = createFinalList(selectedItems);

      const finalList: FinalizedList = {
        categories: selection.map((cat) => ({
          categoryId: cat.categoryId,
          techs: cat.techs,
        })),
      };

      const [res, error] = await finalizeTechStackAction({
        teamId,
        finalizedList: finalList,
      });
      if (res) {
        router.push(routePaths.techStackPage(teamId.toString()));
      }
      if (error) {
        dispatch(
          onOpenModal({ type: "error", content: { message: error.message } }),
        );
      }
    }

    setFinalizeTechStackLoading(false);
  };

  function renderButtonContent() {
    if (finalizeTechStackLoading) {
      return <Spinner />;
    }
    const text = isFinalized
      ? "Save Changes"
      : "Finalize Tech Stack Selection.";
    return text;
  }

  return (
    <Button
      variant="secondary"
      disabled={finalizeTechStackLoading || !allCategoriesSelected}
      className="mb-4 mt-10 w-full"
      onClick={handleClick}
    >
      {renderButtonContent()}
    </Button>
  );
}
