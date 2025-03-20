import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "@chingu-x/components/spinner";
import { TextInput } from "@chingu-x/components/inputs";
import type {
  EditFeatureClientRequestDto,
  EditFeatureClientResponseDto,
  Feature,
} from "@chingu-x/modules/features";
import { useMutation } from "@tanstack/react-query";
import Card from "./Card";
import { validateTextInput } from "@/utils/form/validateInput";
import { useAppDispatch } from "@/store/hooks";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { featuresAdapter } from "@/utils/adapters";
import { editFeatureState } from "@/store/features/features/featuresSlice";

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
  const dispatch = useAppDispatch();
  const { id, description, teamMemberId } = feature;

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

  const { mutate: editFeature, isPending: editFeaturePending } = useMutation<
    EditFeatureClientResponseDto,
    Error,
    EditFeatureClientRequestDto
  >({
    mutationFn: editFeatureMutation,
    onSuccess: (data) => {
      dispatch(editFeatureState(data));
      setEditMode(false);
    },
    onError: (error: Error) => {
      dispatch(
        onOpenModal({ type: "error", content: { message: error.message } }),
      );
    },
  });

  async function editFeatureMutation({
    featureId,
    teamMemberId,
    description,
  }: EditFeatureClientRequestDto): Promise<EditFeatureClientResponseDto> {
    return await featuresAdapter.editFeature({
      featureId,
      teamMemberId,
      description,
    });
  }

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    const { description } = data;

    editFeature({
      featureId: id,
      description,
      teamMemberId,
    });
  };

  function handleClearInputAction() {
    reset({ description: "" });
  }

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
              submitButtonText={editFeaturePending ? <Spinner /> : "Save"}
              buttonDisabled={!isDirty || !isValid}
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
