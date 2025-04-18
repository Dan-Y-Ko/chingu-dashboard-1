import { type Dispatch, type SetStateAction } from "react";
import { useParams } from "next/navigation";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import EditMenu from "@/shared/components/EditMenu";
import { useAppDispatch } from "@/shared/store";
import { useDeleteFeatureMutation } from "@/features/features/hooks/useDeleteFeatureMutation";

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
  const { teamId } = useParams<{ teamId: string }>();
  const { deleteFeatureMutation } = useDeleteFeatureMutation({ teamId });

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
          deleteFunction: deleteFeatureMutation,
        },
      }),
    );
  }

  return <EditMenu handleClick={handleClick} handleDelete={handleDelete} />;
}
