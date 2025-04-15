"use client";

import "reflect-metadata";
import Image from "next/image";
import { Banner } from "@chingu-x/components/banner";
import { BannerContainer } from "@chingu-x/components/banner-container";
import {
  useFinalizedIdeationStateSelector,
  useIdeationStateSelector,
} from "@/features/ideation/hooks/useIdeationStateSelector";
import IdeationContainer from "@/features/ideation/components/IdeationContainer";
import FinalizedIdeationCard from "@/features/ideation/components/FinalizedIdeationCard";
import ContributionCard from "@/features/ideation/components/ContributionCard";
import CreateIdeationContainer from "@/features/ideation/components/CreateIdeationContainer";
import VoteCard from "@/features/ideation/components/VoteCard";
import { useFetchIdeationQuery } from "@/features/ideation/hooks/useFetchIdeationQuery";

interface IdeationPageProps {
  params: {
    teamId: string;
  };
}

export default function IdeationPage({ params }: IdeationPageProps) {
  const { teamId } = params;
  const finalizedIdeation = useFinalizedIdeationStateSelector();
  useFetchIdeationQuery({ teamId });
  const { projectIdeas } = useIdeationStateSelector();

  function renderProjects() {
    if (finalizedIdeation) {
      return (
        <IdeationContainer
          title={finalizedIdeation.title}
          project_idea={finalizedIdeation.description}
          vision_statement={finalizedIdeation.vision}
          isIdeationFinalized={true}
          firstChild={<FinalizedIdeationCard />}
          secondChild={
            <ContributionCard
              projectIdeaId={finalizedIdeation.id}
              isIdeationFinalized={true}
            />
          }
        />
      );
    }

    return (
      <>
        <CreateIdeationContainer />
        {!projectIdeas.length ? (
          <>
            <div className="my-20 flex h-[290px] w-full gap-x-48">
              <div className="flex flex-col justify-center">
                <h1 className="text-xl font-medium text-base-300">
                  Be the First to Share!
                </h1>
                <p className="my-4 text-base font-medium text-base-300">
                  It looks like no one has posted anything yet, but don’t worry,
                  you can be the first to create a new project idea and vision
                  for your team!
                </p>
                <p className="text-base font-medium text-base-300">
                  Click on the{" "}
                  <b className="text-base font-semibold text-base-300">
                    Add Project Idea
                  </b>{" "}
                  button at the top to get started!
                </p>
              </div>
              <Banner
                imageLight={
                  <Image
                    src="/img/empty_ideation_light.png"
                    alt="Light ideation banner"
                    fill={true}
                    sizes="540px"
                    priority
                    style={{ objectFit: "contain" }}
                  />
                }
                imageDark={
                  <Image
                    src="/img/empty_ideation_dark.png"
                    alt="Dark ideation banner"
                    fill={true}
                    sizes="540px"
                    priority
                    style={{ objectFit: "contain" }}
                  />
                }
                height="h-[290px]"
                width="w-[540px]"
              />
            </div>
          </>
        ) : (
          projectIdeas.map((projectIdea) => (
            <IdeationContainer
              key={projectIdea.id}
              title={projectIdea.title}
              project_idea={projectIdea.description}
              vision_statement={projectIdea.vision}
              isIdeationFinalized={false}
              firstChild={
                <VoteCard
                  projectIdeaId={projectIdea.id}
                  users={projectIdea.projectIdeaVotes}
                />
              }
              secondChild={
                <ContributionCard
                  projectIdeaId={projectIdea.id}
                  isIdeationFinalized={false}
                />
              }
            />
          ))
        )}
      </>
    );
  }

  return (
    <>
      <BannerContainer
        title="Ideation"
        description="Okay, time to put on your thinking caps and channel your inner
          creativity! What kind of amazing, mind-blowing project idea do you
          have that will make SpaceX jealous? Let's hear it!"
      >
        <Banner
          imageLight={
            <Image
              src="/img/ideation_banner_light.png"
              alt="Light ideation banner"
              fill={true}
              sizes="276px"
              priority
              style={{ objectFit: "contain" }}
            />
          }
          imageDark={
            <Image
              src="/img/ideation_banner_dark.png"
              alt="Dark ideation banner"
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
      <div className="flex flex-col items-center gap-y-10">
        {renderProjects()}
      </div>
    </>
  );
}
