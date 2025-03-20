import * as z from "zod";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Dispatch, type SetStateAction, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@chingu-x/components/button";
import { Spinner } from "@chingu-x/components/spinner";
import { TextInput } from "@chingu-x/components/inputs";
import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  AddFeatureClientRequestDto,
  AddFeatureClientResponseDto,
} from "@chingu-x/modules/features";
import { validateTextInput } from "@/utils/form/validateInput";
import { useAppDispatch } from "@/store/hooks";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { CacheTag } from "@/utils/cacheTag";
import { featuresAdapter } from "@/utils/adapters";
import { addFeatureState } from "@/store/features/features/featuresSlice";

interface AddFeaturesInputProps {
  handleClick: () => void;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  id: number;
}

const validationSchema = z.object({
  description: validateTextInput({
    inputName: "This field",
    required: true,
  }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

export default function AddFeaturesInput({
  handleClick,
  isEditing,
  setIsEditing,
  id,
}: AddFeaturesInputProps) {
  const params = useParams<{ teamId: string }>();
  const { teamId } = params;
  const dispatch = useAppDispatch();

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

  const { mutate: addFeature, isPending: addFeaturePending } = useMutation<
    AddFeatureClientResponseDto,
    Error,
    AddFeatureClientRequestDto
  >({
    mutationFn: addFeatureMutation,
    onSuccess: async (data) => {
      try {
        const feature = await getFeatureQuery(data.id);
        dispatch(addFeatureState(feature));
      } catch (error) {
        dispatch(
          onOpenModal({
            type: "error",
            content: { message: (error as Error).message },
          }),
        );
      } finally {
        setIsEditing(false);
      }
    },
    onError: (error: Error) => {
      dispatch(
        onOpenModal({ type: "error", content: { message: error.message } }),
      );
    },
  });

  async function addFeatureMutation({
    teamId,
    description,
    featureCategoryId,
  }: AddFeatureClientRequestDto): Promise<AddFeatureClientResponseDto> {
    return await featuresAdapter.addFeature({
      teamId,
      description,
      featureCategoryId,
    });
  }

  useQuery({
    queryKey: [CacheTag.feature, id],
    queryFn: () => getFeatureQuery(id),
    enabled: false,
  });

  async function getFeatureQuery(featureId: number) {
    return await featuresAdapter.fetchFeature({ featureId });
  }

  function handleClearInputAction() {
    reset({ description: "" });
  }

  useEffect(() => {
    if (isEditing) {
      setFocus("description", { shouldSelect: true });
    }
  }, [isEditing, setFocus]);

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    const { description } = data;

    addFeature({ teamId, description, featureCategoryId: id });
  };

  return isEditing ? (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-6">
      <TextInput
        clearInputAction={handleClearInputAction}
        id="description"
        {...register("description")}
        errorMessage={errors.description?.message}
        placeholder="Add Feature"
        submitButtonText={addFeaturePending ? <Spinner /> : "Save"}
        buttonDisabled={!isDirty || !isValid}
      />
    </form>
  ) : (
    <div className="mx-6">
      <Button
        variant="link"
        size="lg"
        className="mt-3 h-10 w-full justify-between rounded-lg border border-base-100 p-0 font-medium text-neutral-focus shadow-sm outline-none"
        onClick={handleClick}
      >
        <div className="pl-3">Add Feature</div>
        <div className="flex h-full w-12 items-center justify-center rounded-r-lg bg-neutral">
          <PlusCircleIcon className="h-6 w-6 text-base-200" />
        </div>
      </Button>
    </div>
  );
}
