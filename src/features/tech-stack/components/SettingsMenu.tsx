import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import EditMenu from "@/shared/components/EditMenu";
import { useAppDispatch } from "@/shared/store";
import { useDeleteTechStackMutation } from "@/features/tech-stack/hooks/useDeleteTechStackMutation";

interface SettingsMenuProps {
  onClose: () => void;
  setEditItemId: (value: number) => void;
  id: number;
}

export default function SettingsMenu({
  onClose,
  setEditItemId,
  id,
}: SettingsMenuProps) {
  const dispatch = useAppDispatch();
  const menuRef = useRef<HTMLDivElement>(null);
  const { teamId } = useParams<{ teamId: string }>();
  const { deleteTechStackMutation } = useDeleteTechStackMutation({ teamId });

  const openEdit = () => {
    setEditItemId(id);
  };

  const handleDelete = () => {
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
            teamTechItemId: id,
          },
          deleteFunction: deleteTechStackMutation,
        },
      }),
    );
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.body.addEventListener("click", handleClickOutside);
    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="absolute -mt-6 ml-[12px]" ref={menuRef}>
      <EditMenu handleClick={openEdit} handleDelete={handleDelete} />
    </div>
  );
}
