export function useFetchVoyageResourcesQuery({
  teamId,
}: UseFetchFeaturesQueryProps) {
  const dispatch = useAppDispatch();
  const { fetchFeatures } = useFetchFeatures();

  const { isPending, isError, error, data } = useQuery({
    queryKey: [CacheTag.features, { teamId }],
    queryFn: () => getFeaturesQuery(),
  });

  async function getFeaturesQuery() {
    return await fetchFeatures({ teamId });
  }

  useEffect(() => {
    if (data) {
      dispatch(fetchFeaturesState(data));
    }
  }, [data, dispatch]);

  if (isError) {
    return (
      <ErrorComponent
        errorType={ErrorType.FETCH_FEATURES}
        message={error.message}
      />
    );
  }

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }
}
