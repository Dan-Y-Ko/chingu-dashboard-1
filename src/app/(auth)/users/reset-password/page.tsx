"use client";

import "reflect-metadata";
import { useState } from "react";
import NewPasswordContainer from "@/features/auth/components/reset-password/NewPasswordContainer";
import ResetCompletedContainer from "@/features/auth/components/reset-password/ResetCompletedContainer";

enum ContainerState {
  NewPassword,
  ResetCompleted,
}

function ResetPasswordContainer() {
  const [containerState, setContainerState] = useState<ContainerState>(
    ContainerState.NewPassword,
  );

  const handleNewPassword = () => {
    setContainerState(ContainerState.ResetCompleted);
  };

  return (
    <>
      {containerState === ContainerState.NewPassword && (
        <NewPasswordContainer onClick={handleNewPassword} />
      )}
      {containerState === ContainerState.ResetCompleted && (
        <ResetCompletedContainer />
      )}
    </>
  );
}

export default ResetPasswordContainer;
