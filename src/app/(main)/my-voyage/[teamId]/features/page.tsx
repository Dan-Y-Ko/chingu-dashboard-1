"use client";

import "reflect-metadata";
import { Banner } from "@chingu-x/components/banner";
import Image from "next/image";
import { BannerContainer } from "@chingu-x/components/banner-container";
import FeaturesContainer from "@/features/features/components/FeaturesContainer";
import { useFetchFeaturesQuery } from "@/features/features/hooks/useFetchFeaturesQuery";

interface FeaturesPageProps {
  params: {
    teamId: string;
  };
}

export default function FeaturesPage({ params }: FeaturesPageProps) {
  const { teamId } = params;
  useFetchFeaturesQuery({ teamId });

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
      <FeaturesContainer />
    </>
  );
}
