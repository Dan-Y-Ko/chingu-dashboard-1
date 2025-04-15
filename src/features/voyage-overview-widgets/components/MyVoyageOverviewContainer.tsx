"use client";

import "reflect-metadata";
import { useParams } from "next/navigation";
import DashboardWidget from "./DashboardWidget";
import routePaths from "@/shared/utils/routePaths";
import IdeationStateContent from "./IdeationStateContent";
import FeaturesStateContent from "./FeaturesStateContent";
import { useFetchWidgetDataQuery } from "../hooks/useFetchWidgetDataQuery";
import { useIdeationStateSelector } from "@/features/ideation/hooks/useIdeationStateSelector";
import { useFinalizedIdeationStateSelector } from "@/features/ideation/hooks/useFinalizedIdeationStateSelector";

export default function MyVoyageOverviewContainer() {
  const { teamId } = useParams<{ teamId: string }>();
  useFetchWidgetDataQuery({ teamId });
  const projectIdeas = useFinalizedIdeationStateSelector();

  return (
    <div className="col-span-1 flex w-full grow flex-col rounded-2xl border-2 border-base-100 bg-base-200 p-4">
      <p className="mb-[23px] text-[25px] font-semibold">My Voyage Overview</p>
      <div className="flex flex-col gap-y-4">
        <DashboardWidget
          imageLight="/img/discover_light.png"
          imageDark="/img/discover_dark.png"
          title="What is your Voyage project idea & vision?"
          link={routePaths.ideationPage(teamId ?? "")}
          headerTitle="Ideation"
          buttonTitle="Go to Ideation"
          description="Share your ideas on what the team Voyage should be. Describe your vision and finalize your choice to capture what the benefit it will bring to users."
        >
          {projectIdeas && (
            <IdeationStateContent contentObject={projectIdeas} />
          )}
        </DashboardWidget>
        {/* <div className="flex flex-row justify-between gap-x-4 max-[1200px]:flex-col max-[1200px]:gap-y-4">
          <div className="flex w-full grow">
            <DashboardWidget
              title="What features will you develop?"
              link={routePaths.featuresPage(teamId ?? "")}
              headerTitle="Features"
              buttonTitle="Go to Features"
              description="Brainstorm and prioritize the features that will be included in the scope of your project."
            >
              {featureList.length > 0 ? (
                <FeaturesStateContent contentObject={featureList} />
              ) : null}
            </DashboardWidget>
          </div>
          <div className="flex w-full grow">
            <DashboardWidget
              title="Choose your tech stack"
              link={routePaths.techStackPage(teamId ?? "")}
              headerTitle="Tech Stack"
              buttonTitle="Go to Tech Stack"
              description="The final choices for the programming languages, frameworks, and tools that will serve as the foundation of your project will appear here."
            >
              {techStackList.some((item) => item.value) ? (
                <TechStackStateContent contentObject={techStackList} />
              ) : null}
            </DashboardWidget>
          </div>
        </div>
        <DashboardWidget
          imageLight="/img/share_link_light.png"
          imageDark="/img/share_link_dark.png"
          title="Share resources with your team"
          link={routePaths.voyageResourcesPage(teamId ?? "")}
          headerTitle="Resources"
          buttonTitle="Go to Resources"
          description="Share links of helpful resources to your team for the Voyage. Contribute to the collective knowledgebase to empower your team."
        >
          {resourceList.length > 0 ? (
            <ResourcesStateContent contentObject={resourceList} />
          ) : null}
        </DashboardWidget> */}
      </div>
    </div>
  );
}
