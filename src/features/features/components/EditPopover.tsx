import { type Dispatch, type SetStateAction } from "react";
import { useMutation } from "@tanstack/react-query";
import type {
  DeleteFeatureClientRequestDto,
  DeleteFeatureClientResponseDto,
} from "@chingu-x/modules/features";
import { onCloseModal, onOpenModal } from "@/store/features/modal/modalSlice";
import EditMenu from "@/shared/components/EditMenu";
import { deleteFeatureState } from "@/features/features/store/featuresSlice";
import { useAppDispatch } from "@/shared/store";
import { featuresAdapter } from "@/features/features/hooks/useFeaturesAdapters";

interface EditPopoverProps {
  setEditMode: Dispatch<SetStateAction<boolean>>;
  setShowPopover: Dispatch<SetStateAction<boolean>>;
  featureId: number;
}

export default function EditPopover({
  setEditMode,
  setShowPopover,
  featureId,
}: EditPopoverProps) {
  const dispatch = useAppDispatch();

  const { mutate: deleteFeature } = useMutation<
    DeleteFeatureClientResponseDto,
    Error,
    DeleteFeatureClientRequestDto
  >({
    mutationFn: deleteFeatureMutation,
    onSuccess: () => {
      dispatch(deleteFeatureState({ featureId }));
      dispatch(onCloseModal());
    },
    onError: (error: Error) => {
      dispatch(
        onOpenModal({ type: "error", content: { message: error.message } }),
      );
    },
  });

  async function deleteFeatureMutation({
    featureId,
  }: DeleteFeatureClientRequestDto): Promise<DeleteFeatureClientResponseDto> {
    return await featuresAdapter.deleteFeature({ featureId });
  }

  function handleClick() {
    setEditMode(true);
    setShowPopover(false);
  }

  function handleDelete() {
    dispatch(
      onOpenModal({
        type: "confirmation",
        content: {
          title: "Confirm Deletion",
          message:
            "Are you sure you want to delete? You will permanently lose all the information and will not be able to recover it.",
          confirmationText: "Delete",
          cancelText: "Keep It",
        },
        payload: {
          params: {
            featureId,
          },
          deleteFunction: deleteFeature,
        },
      }),
    );
  }

  return <EditMenu handleClick={handleClick} handleDelete={handleDelete} />;
}
