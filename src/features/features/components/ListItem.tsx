import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "@chingu-x/components/spinner";
import { TextInput } from "@chingu-x/components/inputs";
import type { Feature } from "@chingu-x/modules/features";
import Card from "./Card";
import { validateTextInput } from "@/shared/utils/form/validateInput";
import { useEditFeatureMutation } from "@/features/features/hooks/useEditFeatureMutation";

const validationSchema = z.object({
  description: validateTextInput({
    inputName: "This field",
    required: true,
  }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

interface ListItemProps {
  feature: Feature;
  index: number;
}

export default function ListItem({ feature, index }: ListItemProps) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const listItemRef = useRef<HTMLDivElement>(null);
  const { id, description, teamMemberId } = feature;
  const { isEditFeaturePending, editFeatureMutation } = useEditFeatureMutation({
    setEditMode,
  });

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isDirty, isValid },
  } = useForm<ValidationSchema>({
    mode: "onTouched",
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    const { description } = data;

    editFeatureMutation({
      featureId: id,
      description,
      teamMemberId,
    });
  };

  function handleClearInputAction() {
    reset({ description: "" });
  }

  // TODO: create reusable hook for click outside functionality
  function handleOutsideClick(e: MouseEvent | TouchEvent) {
    if (
      listItemRef.current &&
      !listItemRef.current.contains(e.target as Node)
    ) {
      setEditMode(false);
      reset({
        description,
      });
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });

  useEffect(() => {
    reset({
      description,
    });
  }, [description, reset]);

  useEffect(() => {
    if (editMode) {
      setFocus("description", { shouldSelect: true });
    }
  }, [editMode, setFocus]);

  return (
    <li>
      {editMode ? (
        <form onSubmit={handleSubmit(onSubmit)} key={feature.id}>
          <div ref={listItemRef}>
            <TextInput
              clearInputAction={handleClearInputAction}
              id="description"
              {...register("description")}
              errorMessage={errors.description?.message}
              placeholder="Edit your feature"
              defaultValue={description}
              submitButtonText={isEditFeaturePending ? <Spinner /> : "Save"}
              buttonDisabled={!isDirty || !isValid || isEditFeaturePending}
            />
          </div>
        </form>
      ) : (
        <Card
          key={feature.id}
          index={index}
          feature={feature}
          setEditMode={setEditMode}
        />
      )}
    </li>
  );
}
