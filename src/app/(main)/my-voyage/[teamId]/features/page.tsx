"use client";

import "reflect-metadata";
import { Banner } from "@chingu-x/components/banner";
import Image from "next/image";
import { BannerContainer } from "@chingu-x/components/banner-container";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@chingu-x/components/spinner";
import { type FeaturesList } from "@chingu-x/modules/features";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import FeaturesContainer from "@/features/features/components/FeaturesContainer";
import ErrorComponent from "@/shared/components/Error";
import { CacheTag } from "@/shared/utils/cacheTag";
import { ErrorType } from "@/shared/utils/error";
import { featuresAdapter } from "@/shared/utils/adapters";
import { fetchFeatures } from "@/features/features/store/featuresSlice";

interface FeaturesPageProps {
  params: {
    teamId: string;
  };
}

export default function FeaturesPage({ params }: FeaturesPageProps) {
  const { teamId } = params;
  const dispatch = useDispatch();

  

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
