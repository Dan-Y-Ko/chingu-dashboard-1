"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@chingu-x/components/button";
import type {
  TechStackCategory,
  TechStackItem,
} from "@chingu-x/modules/tech-stack";
import FinalizeTechCard from "./FinalizeTechCard";
import ConfirmationButton from "./ConfirmationButton";
import GetIcon from "@/features/tech-stack/components/GetIcons";
import { useTechStackStateSelector } from "@/features/tech-stack/hooks/useTechStackStateSelector";
import type { SelectedItems } from "@/features/tech-stack/types/types";
import { useCheckisFinalized } from "@/features/tech-stack/hooks/useTechStackAdapters";
import { getSelectedTechItems } from "@/features/tech-stack/utils/getSelectedTechItems";
import routePaths from "@/shared/utils/routePaths";

export default function FinalizeTechList() {
  const { teamId } = useParams<{ teamId: string }>();
  const { techStack } = useTechStackStateSelector();
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({});
  const [previousSelected, setPreviousSelected] = useState<SelectedItems>({});

  //checks how many categories are being finalized (Frontend, Backend, CSS etc...)
  const categories = techStack
    .filter((item) => item.teamTechStackItems.length > 0)
    .map((item) => item.id);

  //checks if all of the categories has had an item selected and stack can now be finalized/ finalized button enabled.
  const allCategoriesSelected = categories.every(
    (item) => selectedItems[item as keyof SelectedItems],
  );

  // if isSelected property has been set to true on any item, assumption is
  // user has already finalized techStack.
  const { techStackIsFinalized } = useCheckisFinalized();

  const techCardData = techStack.map((item) => ({
    id: item.id,
    title: item.name,
    techItems: item.teamTechStackItems,
  }));
  const finalizedItems = getSelectedTechItems(techCardData);

  const renderTechStackItem = (item: TechStackCategory) => {
    if (item.teamTechStackItems.length === 0) {
      return null;
    }

    return (
      <div
        key={item.id}
        className="flex flex-1 flex-col items-center justify-center rounded-2xl bg-base-100 p-10 [&>*]:my-3 [&>*]:w-3/4"
      >
        <div className="flex items-center">
          {GetIcon(item.name)}
          <h1 className="text-xl font-semibold text-base-300">{item.name}</h1>
        </div>
        {item.teamTechStackItems.map((techItem: TechStackItem) => {
          const { id, name, teamTechStackItemVotes, isSelected } = techItem;

          return (
            <FinalizeTechCard
              categoryId={item.id}
              key={id}
              title={name}
              techId={id}
              isSelected={isSelected}
              techItemVotes={teamTechStackItemVotes}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              setPreviousSelected={setPreviousSelected}
              finalizedItems={finalizedItems}
            />
          );
        })}
        {techStackIsFinalized && (
          <ConfirmationButton
            isFinalized={techStackIsFinalized}
            selectedItems={selectedItems}
            previousSelected={previousSelected}
            allCategoriesSelected={true}
          />
        )}
      </div>
    );
  };

  return (
    <>
      {techStack.map(renderTechStackItem)}
      {!techStackIsFinalized && (
        <ConfirmationButton
          isFinalized={false}
          allCategoriesSelected={allCategoriesSelected}
          selectedItems={selectedItems}
        />
      )}
      <Link href={routePaths.techStackPage(teamId)}>
        <Button className="mb-20 w-full" variant="neutral">
          Cancel
        </Button>
      </Link>
    </>
  );
}
