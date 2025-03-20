import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import type {
  SaveOrderClientRequestDto,
  SaveOrderClientResponseDto,
} from "@chingu-x/modules/features";
import { useMutation } from "@tanstack/react-query";
import List from "./List";
import { useAppDispatch, useFeatures } from "@/store/hooks";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { featuresAdapter } from "@/utils/adapters";
import {
  saveOrderStateDifferentCategory,
  saveOrderStateSameCategory,
} from "@/store/features/features/featuresSlice";

export default function FeaturesContainer() {
  const features = useFeatures();
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

    const newOrderedData = features.map((list) => ({
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

      dispatch(saveOrderStateSameCategory(reorderedCards));
      saveOrder({
        featureId: removed.id,
        order: destination.index + 1,
        featureCategoryId: removed.category.id,
      });
    }

    // moving cards from one column to another
    if (source.droppableId !== destination.droppableId) {
      // Remove card from the source list
      const [movedCard] = sourceList.features.splice(source.index, 1);
      const category = features.find(
        (c) => c.categoryId === Number(destination.droppableId),
      );
      const newCategory = {
        id: Number(destination.droppableId),
        name: category!.categoryName,
      };
      // // Assign the new categoryId to the moved card
      const updatedMovedCard = { ...movedCard, category: newCategory };

      // // Add card to the destination list
      destList.features.splice(destination.index, 0, updatedMovedCard);
      dispatch(saveOrderStateDifferentCategory({ sourceList, destList }));
      saveOrder({
        featureId: updatedMovedCard.id,
        order: destination.index + 1,
        featureCategoryId: updatedMovedCard.category.id,
      });
    }
  };

  const { mutate: saveOrder } = useMutation<
    SaveOrderClientResponseDto,
    Error,
    SaveOrderClientRequestDto
  >({
    mutationFn: saveOrderMutation,
    onError: (error: Error) => {
      dispatch(
        onOpenModal({ type: "error", content: { message: error.message } }),
      );
    },
  });

  async function saveOrderMutation({
    featureId,
    order,
    featureCategoryId,
  }: SaveOrderClientRequestDto): Promise<SaveOrderClientResponseDto> {
    return await featuresAdapter.saveOrder({
      featureId,
      order,
      featureCategoryId,
    });
  }

  return (
    <div className="grid grid-cols-3 items-start gap-x-10">
      <DragDropContext onDragEnd={onDragEnd}>
        {features.map((list) => (
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
