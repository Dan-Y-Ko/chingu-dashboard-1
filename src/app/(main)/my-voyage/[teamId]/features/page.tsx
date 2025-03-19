"use client";

import "reflect-metadata";
import { Banner } from "@chingu-x/components/banner";
import Image from "next/image";
import { BannerContainer } from "@chingu-x/components/banner-container";
import { useQuery } from "@tanstack/react-query";
import FeaturesContainer from "./components/FeaturesContainer";
import ErrorComponent from "@/components/Error";
import { CacheTag } from "@/utils/cacheTag";
import { ErrorType } from "@/utils/error";

interface FeaturesPageProps {
  params: {
    teamId: string;
  };
}

export default function FeaturesPage({ params }: FeaturesPageProps) {
  let features = [];

  const { teamId } = params;

  const { isPending, isError, error, data } = useQuery({
    queryKey: [CacheTag.features, { teamId }],
    queryFn: () => getFeaturesQuery(),
  });

  async function getFeaturesQuery() {
    return await myTeamAdapter.getMyTeam({ teamId, user });
  }

  useEffect(() => {
    if (data) {
      dispatch(fetchTeamDirectory(data));
    }
  }, [data, dispatch]);

  if (isError) {
    <ErrorComponent
      errorType={ErrorType.FETCH_MY_TEAM}
      message={error.message}
    />;
  }

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <BannerContainer
        title="Features"
        description="What's on the feature menu for our app? We want only the crème de la crème, so prioritize wisely. Remember, we're building an app, not a buffet."
      >
        <Banner
          imageLight={
            <Image
              src="/img/features_banner_light.png"
              alt="Light features banner"
              fill={true}
              sizes="276px"
              priority
              style={{ objectFit: "contain" }}
            />
          }
          imageDark={
            <Image
              src="/img/features_banner_dark.png"
              alt="Dark features banner"
              fill={true}
              sizes="276px"
              priority
              style={{ objectFit: "contain" }}
            />
          }
          height="h-[200px]"
          width="w-[276px]"
        />
      </BannerContainer>
      <FeaturesContainer data={features} />
    </>
  );
}
