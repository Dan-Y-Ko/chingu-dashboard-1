"use client";

import "reflect-metadata";
import { useState } from "react";
import ResetPasswordContainer from "@/features/auth/components/sign-in/ResetPasswordContainer";
import SignInBlock from "@/features/auth/components/sign-in/SignInBlock";
import EmailCheckContainer from "@/features/auth/components/sign-in/EmailCheckContainer";

export enum ContainerState {
  SignIn,
  ResetPassword,
  EmailCheck,
}

function SignInContainer() {
  const [email, setEmail] = useState<string>("");

  const [containerState, setContainerState] = useState<ContainerState>(
    ContainerState.SignIn,
  );

  const handleResetPassword = () => {
    setContainerState(ContainerState.ResetPassword);
  };

  const handleEmailCheck = () => {
    setContainerState(ContainerState.EmailCheck);
  };

  return (
    <>
      {containerState === ContainerState.ResetPassword && (
        <ResetPasswordContainer
          handleEmailCheck={handleEmailCheck}
          setEmail={setEmail}
        />
      )}
      {containerState === ContainerState.EmailCheck && (
        <EmailCheckContainer
          email={email}
          setContainerState={setContainerState}
        />
      )}
      {containerState === ContainerState.SignIn && (
        <SignInBlock handleResetPassword={handleResetPassword} />
      )}
    </>
  );
}

export default SignInContainer;
