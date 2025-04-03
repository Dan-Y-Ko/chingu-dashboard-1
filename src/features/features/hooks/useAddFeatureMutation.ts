interface UseAddFeatureMutationProps {
  id: number;
}

export function useAddFeatureMutation({ id }: UseAddFeatureMutationProps) {
  const dispatch = useAppDispatch();
  const { deleteFeature } = useDeleteFeature();

  const { mutate: deleteFeatureMutation } = useMutation<
    DeleteFeatureClientResponseDto,
    Error,
    DeleteFeatureClientRequestDto
  >({
    mutationFn: deleteFeatureMutationFn,
    onSuccess: () => {
      dispatch(deleteFeatureState({ featureId }));
      dispatch(onCloseModal());
    },
    onError: (error: Error) => {
      dispatch(
        onOpenModal({ type: "error", content: { message: error.message } }),
      );
    },
  });

  async function deleteFeatureMutationFn({
    featureId,
  }: DeleteFeatureClientRequestDto): Promise<DeleteFeatureClientResponseDto> {
    return await deleteFeature({ featureId });
  }

  return {
    deleteFeatureMutation,
  };
}
