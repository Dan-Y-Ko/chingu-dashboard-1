"use client";

import { Banner } from "@chingu-x/components/banner";
import Image from "next/image";
import { BannerContainer } from "@chingu-x/components/banner-container";
import { useFetchTechStackQuery } from "@/features/tech-stack/hooks/useFetchTechStackQuery";
import "reflect-metadata";
import TechStackContainer from "@/features/tech-stack/components/TechStackContainer";
import { useTechStackStateSelector } from "@/features/tech-stack/hooks/useTechStackStateSelector";

interface TechStackPageProps {
  params: {
    teamId: string;
  };
}

export default function TeckStackPage({ params }: TechStackPageProps) {
  const { techStack } = useTechStackStateSelector();
  const { teamId } = params;
  useFetchTechStackQuery({ teamId });

  return (
    <>
      <BannerContainer
        title="Tech Stack"
        description="Alright, let's get down to business. We need to figure out which tech stack we're going to use to power this bad boy. Are you a JavaScript junkie, a Python pro, a Java genius, or a Ruby rockstar? Let's vote"
      >
        <Banner
          imageLight={
            <Image
              src="/img/tech_stack_banner_light.png"
              alt="Light tech stack banner"
              fill={true}
              sizes="276px"
              priority
              style={{ objectFit: "contain" }}
            />
          }
          imageDark={
            <Image
              src="/img/tech_stack_banner_dark.png"
              alt="Dark tech stack banner"
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
      <TechStackContainer data={techStack} />
    </>
  );
}
