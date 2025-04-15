"use client";

import "reflect-metadata";
import { Banner } from "@chingu-x/components/banner";
import Image from "next/image";
import { BannerContainer } from "@chingu-x/components/banner-container";
import { useVoyageResourceStateSelector } from "@/features/voyage-resources/hooks/useVoyageResourceStateSelector";
import ResourcesContainer from "@/features/voyage-resources/components/ResourcesContainer";
import { useFetchVoyageResourcesQuery } from "@/features/voyage-resources/hooks/useFetchVoyageResourcesQuery";

interface VoyageResourcesPageProps {
  params: {
    teamId: string;
  };
}

export default function VoyageResourcesPage({
  params,
}: VoyageResourcesPageProps) {
  const { teamId } = params;
  const { voyageResources } = useVoyageResourceStateSelector();
  useFetchVoyageResourcesQuery({ teamId });

  return (
    <>
      <BannerContainer
        title="Resources"
        description="This resources page is your secret weapon for this voyage! Take a look at what your team is sharing or share your own resources for this voyage. Go ahead and be the first to post a new resource for you and your peers!"
      >
        <Banner
          imageLight={
            <Image
              src="/img/resources_banner_light.png"
              alt="Light resources banner"
              fill={true}
              sizes="276px"
              priority
              style={{ objectFit: "contain" }}
            />
          }
          imageDark={
            <Image
              src="/img/resources_banner_dark.png"
              alt="Dark resources banner"
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
      <ResourcesContainer data={voyageResources} />
    </>
  );
}
