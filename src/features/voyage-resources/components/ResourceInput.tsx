import { type SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinkIcon } from "@heroicons/react/24/outline";
import { Button } from "@chingu-x/components/button";
import { Spinner } from "@chingu-x/components/spinner";
import { TextInput } from "@chingu-x/components/inputs";
import { useAddVoyageResourceMutation } from "@/features/voyage-resources/hooks/useAddVoyageResourceMutation";
import { validateTextInput } from "@/shared/utils/form/validateInput";

const validationSchema = z.object({
  url: validateTextInput({
    inputName: "Url",
    required: true,
    isUrl: true,
  }),
  title: validateTextInput({
    inputName: "Title",
    required: true,
    minLen: 1,
    maxLen: 100,
  }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

export default function ResourceInput() {
  const { teamId } = useParams<{ teamId: string }>();
  const { isAddVoyageResourcePending, addVoyageResourceMutation } =
    useAddVoyageResourceMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ValidationSchema>({
    mode: "onTouched",
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    const payload = { ...data, teamId };
    addVoyageResourceMutation(payload);
    reset();
  };

  return (
    <form
      className="flex w-full items-center rounded-xl bg-base-200 p-1 shadow-lg"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="mx-4 mb-1 mt-3 flex w-3/4 flex-col">
        <TextInput
          id="url"
          placeholder="Paste your resource link here."
          ariaLabel="link"
          errorMessage={errors.url?.message}
          {...register("url")}
          inputGroupContent={<LinkIcon />}
        />
        <TextInput
          id="title"
          placeholder="Name your resource here."
          ariaLabel="resource name"
          errorMessage={errors.title?.message}
          {...register("title")}
        />
      </div>
      <Button
        className="m-4 w-1/4 whitespace-nowrap"
        type="submit"
        disabled={!isValid}
      >
        Share Resource
        {isAddVoyageResourcePending ? <Spinner /> : null}
      </Button>
    </form>
  );
}
