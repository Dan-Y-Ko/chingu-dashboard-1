import * as z from "zod";
import Link from "next/link";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@chingu-x/components/button";
import { Spinner } from "@chingu-x/components/spinner";
import { TextInput } from "@chingu-x/components/inputs";
import { validateTextInput } from "@/shared/utils/form/validateInput";
import routePaths from "@/shared/utils/routePaths";
import { useLoginMutation } from "@/features/auth/hooks/useLoginMutation";

const validationSchema = z.object({
  email: validateTextInput({
    inputName: "Email",
    required: true,
    isEmail: true,
  }),
  password: validateTextInput({
    inputName: "Password",
    required: true,
    minLen: 8,
    maxLen: 20,
  }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

interface SignInFormContainerProps {
  handleResetPassword: () => void;
}

function SignInFormContainer({
  handleResetPassword,
}: SignInFormContainerProps) {
  const { isLoginMutationPending, loginMutation } = useLoginMutation();

  const {
    register,
    formState: { errors, isDirty, isValid },
    handleSubmit,
  } = useForm<ValidationSchema>({
    mode: "onTouched",
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    const { email, password } = data;
    loginMutation({ email, password });
  };

  function renderButtonContent() {
    return isLoginMutationPending ? <Spinner /> : "Sign In";
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <div className="flex min-h-[90px] flex-col">
        <div className="flex flex-col gap-y-2">
          <TextInput
            id="email"
            label="email"
            placeholder="Enter Your Email"
            {...register("email")}
            errorMessage={errors.email?.message}
          />
          <TextInput
            type="password"
            id="password"
            label="password"
            placeholder="Enter Your Password"
            {...register("password")}
            errorMessage={errors.password?.message}
            maxLength={30}
          />
          <div
            onClick={handleResetPassword}
            className="ml-1 mt-2 cursor-pointer text-xs font-medium text-base-300"
          >
            Forgot your password?
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 pt-4">
        <Button
          type="submit"
          title="submit"
          disabled={!isDirty || !isValid || isLoginMutationPending}
        >
          {renderButtonContent()}
        </Button>
        <Link
          href={routePaths.signUp()}
          className="mb-[10px] ml-1 self-center text-xs font-semibold text-neutral-focus"
        >
          Don’t have an account? Sign up for an account now
        </Link>
      </div>
    </form>
  );
}

export default SignInFormContainer;
