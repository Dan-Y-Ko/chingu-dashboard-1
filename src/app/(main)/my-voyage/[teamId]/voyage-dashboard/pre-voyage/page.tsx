import React from "react";
import { Banner } from "@chingu-x/components/banner";
import Image from "next/image";
import VoyageSupport from "@/features/support/components/VoyageSupport";
import KnowldgeBaseWidget from "@/features/knowledge-base/components/KnowldgeBaseWidget";

function PreVoyageDashboard() {
  return (
    <div className="flex flex-row gap-x-6">
      <div className="flex w-full grow flex-col gap-y-6">
        <KnowldgeBaseWidget />
        <VoyageSupport />
      </div>
      <div className="flex w-full grow border-2 border-base-100">
        <PreVoyageBanner />
      </div>
    </div>
  );
}

export default PreVoyageDashboard;

function PreVoyageBanner() {
  return (
    <div className="flex w-full grow flex-col rounded-2xl bg-base-200 px-[80px] pb-6 pt-[70px]">
      <Banner
        imageLight={
          <Image
            src="/img/pre_voyage_light.png"
            alt="Pre Voyage light banner image"
            fill={true}
            sizes="w-full"
            priority
            style={{ objectFit: "contain" }}
          />
        }
        imageDark={
          <Image
            src="/img/pre_voyage_dark.png"
            alt="Pre Voyage dark banner image"
            fill={true}
            sizes="w-full"
            priority
            style={{ objectFit: "contain" }}
          />
        }
        height="h-[437px]"
        width="w-full"
      />
      <p className="text-center text-[25px] font-semibold">Are you ready?</p>
      <p className="text-center text-base font-medium">
        Your Voyage starts on May 2, 2024.
      </p>
    </div>
  );
}
