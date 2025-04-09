import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@chingu-x/components/button";
import type { TechStackCategory } from "@chingu-x/modules/tech-stack";
import TechStackCard from "./TechStackCard";
import routePaths from "@/shared/utils/routePaths";
import { useCheckisFinalized } from "@/features/tech-stack/hooks/useTechStackAdapters";

interface TechStackContainerProps {
  data: TechStackCategory[];
}

export default function TechStackContainer({ data }: TechStackContainerProps) {
  const { teamId } = useParams<{ teamId: string }>();
  const { IsTechStackFinalized } = useCheckisFinalized();

  // const selectedTechItems = getSelectedTechItems(techCardData);
  // const isFinalized = selectedTechItems.length > 0;

  function renderContent() {
    // if (isFinalized) {
    //   return selectedTechItems.map((item) => (
    //     <FinalizedTechStackCard key={item.id} title={item.title} data={item} />
    //   ));
    // }

    return data.map((item) => (
      <li key={item.id}>
        <TechStackCard
          title={item.name}
          data={item.teamTechStackItems}
          techStackCategoryId={item.id}
        />
      </li>
    ));
  }

  return (
    <div className="w-full">
      <div className="mb-10 grid grid-cols-2 place-items-center min-[1920px]:grid-cols-3">
        <div className="col-start-2 flex min-w-[420px] flex-row-reverse sm:w-96 min-[1920px]:col-start-3">
          <Link href={routePaths.finalizeTechStackPage(teamId)}>
            <Button variant="secondary">
              {IsTechStackFinalized
                ? "Edit Final Selection"
                : "Finalize Selection"}
            </Button>
          </Link>
        </div>
      </div>
      <ul className="grid grid-cols-2 place-items-center gap-y-10 min-[1920px]:grid-cols-3">
        {renderContent()}
      </ul>
    </div>
  );
}
