import { useEffect, useState } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { type FeaturesList } from "@chingu-x/modules/features";
import List from "./List";
import { saveOrder } from "@/myVoyage/features/featuresService";
import { useAppDispatch, useFeatures } from "@/store/hooks";
import { onOpenModal } from "@/store/features/modal/modalSlice";

export default function FeaturesContainer() {
  const features = useFeatures();
  const [orderedData, setOrderedData] = useState(features);
  const dispatch = useAppDispatch();

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    // dropped nowhere
    if (!destination) {
      return;
    }

    // if dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const newOrderedData = orderedData.map((list) => ({
      ...list,
      features: [...list.features],
    }));

    // source and destination lists
    const sourceList = newOrderedData.find(
      (list) => list.categoryId.toString() === source.droppableId,
    );
    const destList = newOrderedData.find(
      (list) => list.categoryId.toString() === destination.droppableId,
    );

    if (!sourceList || !destList) {
      return;
    }

    // moving cards in the same column
    if (source.droppableId === destination.droppableId) {
      // Update order
      const reorderedCards = [...sourceList.features];
      const [removed] = reorderedCards.splice(source.index, 1);
      reorderedCards.splice(destination.index, 0, removed);

      reorderedCards.forEach((card, idx) => {
        card.order = idx + 1;
      });

      sourceList.features = reorderedCards;
      setOrderedData(newOrderedData);
    }

    // moving cards from one column to another
    if (source.droppableId !== destination.droppableId) {
      // Remove card from the source list
      const [movedCard] = sourceList.features.splice(source.index, 1);

      // Assign the new categoryId to the moved card
      movedCard.category.id = +destination.droppableId;

      // Add card to the destination list
      destList.features.splice(destination.index, 0, movedCard);

      sourceList.features.forEach((card, idx) => {
        card.order = idx + 1;
      });

      // Update the order for each card in the destination list
      destList.features.forEach((card, idx) => {
        card.order = idx + 1;
      });

      setOrderedData(newOrderedData);
    }
  };

  useEffect(() => {
    setOrderedData(features);
  }, [features]);

  return (
    <div className="grid grid-cols-3 items-start gap-x-10">
      <DragDropContext onDragEnd={onDragEnd}>
        {orderedData.map((list) => (
          <List
            id={list.categoryId}
            key={list.categoryId}
            title={list.categoryName}
            features={list.features}
          />
        ))}
      </DragDropContext>
    </div>
  );
}
