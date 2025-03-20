"use client";

import "reflect-metadata";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  RectangleGroupIcon,
  ChartBarIcon,
  BookmarkSquareIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/solid";
import { cn } from "@chingu-x/components/tw-merge";
import ExpandButton from "./ExpandButton";
import PageButton from "./PageButton";
import VoyagePageButton from "./VoyagePageButton";
import { useAuth, useCurrentVoyageTeam, useUser } from "@/store/hooks";
import routePaths from "@/utils/routePaths";
import { voyageTeamAdapter } from "@/utils/adapters";

export enum MainPages {
  dashboard = "Dashboard",
  assessment = "Assessment",
  resources = "Resources",
}

export enum VoyagePages {
  myTeam = "My Team",
  techStack = "Tech Stack",
  ideation = "Ideation",
  features = "Features",
  sprints = "Sprints",
  resources = "Resources",
}

export type VoyagePageProperty = {
  name: string;
  link: string;
};

export type PageProperty = {
  name: string;
  marginBottom: string;
  icon: React.JSX.Element;
  link: string;
  "aria-label": string;
};

export default function Sidebar() {
  const currentPath = usePathname();

  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(true);
  const [selectedButton, setSelectedButton] = useState<string>(currentPath);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const { isAuthenticated } = useAuth();
  const user = useUser();
  const currentTeam = useCurrentVoyageTeam();

  const isVoyageStarted = voyageTeamAdapter.hasVoyageStarted({
    user,
    isAuthenticated,
  });

  const teamId = currentTeam[0]?.voyageTeamId;

  const myVoyageDisplayName = `${currentTeam[0]?.voyageTeam.name.replace(/-tier\d+/, "").replace(/-/g, " ") ?? ""}`;

  const pagesProperties: PageProperty[] = [
    {
      name: MainPages.dashboard,
      marginBottom: "mb-4",
      icon: <RectangleGroupIcon className="h-[1.125rem]" />,
      link: routePaths.dashboardPage(),
      "aria-label": "Dashboard Page",
    },
    {
      name: MainPages.assessment,
      marginBottom: "mb-4",
      icon: <ChartBarIcon className="h-[1.125rem]" />,
      link: "/assessment",
      "aria-label": "Assessment Page",
    },
    {
      name: MainPages.resources,
      marginBottom: "mb-4",
      icon: <BookmarkSquareIcon className="h-[1.125rem]" />,
      link: "/resources",
      "aria-label": "Resources Page",
    },
    {
      name: myVoyageDisplayName,
      marginBottom: "mb-4",
      icon: <RocketLaunchIcon className="h-[1.125rem]" />,
      link: routePaths.VoyageDashboardPage(teamId?.toString()),
      "aria-label": "Voyage Main Page",
    },
  ];

  const voyagePages: VoyagePageProperty[] = [
    {
      name: VoyagePages.myTeam,
      link: routePaths.MyTeamPage(teamId?.toString()),
    },
    {
      name: VoyagePages.techStack,
      link: routePaths.techStackPage(teamId?.toString()),
    },
    {
      name: VoyagePages.ideation,
      link: routePaths.ideationPage(teamId?.toString()),
    },
    {
      name: VoyagePages.features,
      link: routePaths.featuresPage(teamId?.toString()),
    },
    {
      name: VoyagePages.sprints,
      link: routePaths.sprintsPage(teamId?.toString()),
    },
    {
      name: VoyagePages.resources,
      link: routePaths.voyageResourcesPage(teamId?.toString()),
    },
  ];

  useEffect(() => {
    setSelectedButton(currentPath);
  }, [currentPath]);

  const handlePageClick = useCallback(
    (element: PageProperty | string) => {
      if (typeof element !== "string" && element.name === myVoyageDisplayName) {
        setIsOpenSidebar(true);
      } else if (typeof element !== "string") {
        setSelectedButton(element.link);
      }
    },
    [setSelectedButton, setIsOpenSidebar, myVoyageDisplayName],
  );

  return (
    <aside
      className={cn(
        `${
          isOpenSidebar ? "w-[250px]" : "w-auto"
        } flex h-full flex-col justify-between border-r border-base-100 bg-base-200 text-center shadow-md`,
      )}
    >
      <div
        className={cn(
          `flex flex-col ${
            isOpenSidebar ? "items-start px-6 pt-6" : "items-center"
          } h-full px-5 pt-6`,
        )}
      >
        <ul className="w-full">
          {pagesProperties.map((element) => (
            <PageButton
              key={element.name}
              element={element}
              onClick={handlePageClick}
              selectedButton={selectedButton}
              isOpen={isOpenSidebar}
              link={element.link}
              setHoveredButton={setHoveredButton}
              ariaLabel={element["aria-label"]}
              myVoyageDisplayName={myVoyageDisplayName}
            />
          ))}
        </ul>

        {isOpenSidebar && (
          <ul className="flex flex-col items-center">
            {voyagePages.map((element) => (
              <VoyagePageButton
                key={element.name}
                element={element}
                onClick={handlePageClick}
                hoveredButton={hoveredButton}
                selectedButton={selectedButton}
                isVoyageStarted={isVoyageStarted}
                setHoveredButton={setHoveredButton}
              />
            ))}
          </ul>
        )}
      </div>
      <hr className="bg-base-100" />
      <div className="flex justify-end p-4">
        <ExpandButton isOpen={isOpenSidebar} onClick={setIsOpenSidebar} />
      </div>
    </aside>
  );
}
