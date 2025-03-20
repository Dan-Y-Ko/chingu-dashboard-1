"use client";

import { useEffect, useState } from "react";

import GettingHelpModal from "@/shared/components/modals/GettingHelpModal";
import ErrorModal from "@/shared/components/modals/ErrorModal";
import DeleteConfirmationModal from "@/shared/components/modals/DeleteConfirmationModal";
import ViewModal from "@/shared/components/modals/ViewModal";
import CheckInSuccessModal from "@/shared/components/modals/CheckInSuccessModal";
import { useModal } from "@/store/hooks";

export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);
  const modalType = useModal().type;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {modalType === "error" && <ErrorModal />}
      {modalType === "gettingHelp" && <GettingHelpModal />}
      {modalType === "confirmation" && <DeleteConfirmationModal />}
      {modalType === "viewResource" && <ViewModal />}
      {modalType === "checkInSuccess" && <CheckInSuccessModal />}
    </>
  );
}
