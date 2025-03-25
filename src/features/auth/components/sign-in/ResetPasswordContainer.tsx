import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { type SubmitHandler, useForm } from "react-hook-form";
import { type Dispatch, type SetStateAction } from "react";
import { Button } from "@chingu-x/components/button";
import { Spinner } from "@chingu-x/components/spinner";
import { TextInput } from "@chingu-x/components/inputs";
import { validateTextInput } from "@/shared/utils/form/validateInput";
import routePaths from "@/shared/utils/routePaths";
import { useRequestRestPasswordMutation } from "@/features/auth/hooks/useRequestResetPasswordMutation";

const validationSchema = z.object({
  email: validateTextInput({
    inputName: "Email",
    required: true,
    isEmail: true,
  }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

interface ResetPasswordContainerProps {
  handleEmailCheck: () => void;
  setEmail: Dispatch<SetStateAction<string>>;
}

function ResetPasswordContainer({
  handleEmailCheck,
  setEmail,
}: ResetPasswordContainerProps) {
  const {
    isRequestResetPasswordMutationPending,
    requestResetPasswordMutation,
  } = useRequestRestPasswordMutation({ handleEmailCheck, setEmail });

  function renderButtonContent() {
    return isRequestResetPasswordMutationPending ? (
      <Spinner />
    ) : (
      "Send reset link"
    );
  }

  const {
    register,
    formState: { errors, isDirty, isValid },
    handleSubmit,
  } = useForm<ValidationSchema>({
    mode: "onTouched",
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    const { email } = data;
    requestResetPasswordMutation({ email });
  };

  return (
    <div className="flex min-h-[377px] w-[400px] flex-col items-center rounded-2xl bg-base-200 px-6 py-9 xl:ml-60">
      <p className="mb-8 text-center text-2xl font-medium text-base-300">
        Reset Password
      </p>
      <p className="mb-8 text-base font-medium text-base-300">
        Enter your email below and we’ll send you a link to reset your password
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col">
        <TextInput
          id="email"
          label="email"
          placeholder="Enter Your Email"
          {...register("email")}
          errorMessage={errors.email?.message}
        />
        <Button
          type="submit"
          title="submit"
          className="my-3"
          disabled={
            !isDirty || !isValid || isRequestResetPasswordMutationPending
          }
        >
          {renderButtonContent()}
        </Button>
        <Link
          href={routePaths.signUp()}
          className="ml-1 self-center text-xs font-semibold text-neutral-focus"
        >
          Don’t have an account? Sign up for an account now
        </Link>
      </form>
    </div>
  );
}

export default ResetPasswordContainer;
