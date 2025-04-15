import VoyageSupport from "@/features/support/components/VoyageSupport";
import MyVoyageOverviewContainer from "@/features/voyage-overview-widgets/components/MyVoyageOverviewContainer";

interface VoyageDashboardProps {
  teamId: string;
}
export default async function VoyageDashboardPage({
  teamId,
}: VoyageDashboardProps) {
  // let currentSprintNumber: number | null = null;
  // let sprintsData: Sprint[] = [];
  // let meetingsData: Event[] = [];
  // let voyageNumber: number | null = null;
  // let voyageData: Voyage = {} as Voyage;
  // let features: FeaturesList[] = [];
  // let projectIdeas: IdeationData[] = [];
  // let techStackDatas: TechStackData[] = [];
  // let projectResources: ResourceData[] = [];
  // let errorMessage: string | undefined;
  // let errorType: ErrorType | undefined;

  // if (teamId !== undefined) {
  //   const data = await getDashboardData(user, error, Number(teamId));
  //   currentSprintNumber = data.currentSprintNumber;
  //   sprintsData = data.sprintsData;
  //   meetingsData = data.meetingsData;
  //   voyageNumber = data.voyageNumber;
  //   voyageData = data.voyageData;
  //   features = data.features;
  //   projectIdeas = data.projectIdeas.filter((idea) => idea.isSelected);
  //   techStackDatas = data.techStackData.filter((tech) => tech.isSelected);
  //   projectResources = data.projectResources;
  //   errorMessage = data.errorMessage;
  //   errorType = data.errorType;
  // }

  // if (errorMessage && errorType) {
  //   return <ErrorComponent errorType={errorType} message={errorMessage} />;
  // }

  // const featureList = features
  //   .filter((item) => item.categoryName === "must have")
  //   .flatMap((category) =>
  //     category.features.map((feature) => feature.description),
  //   );

  // const resourceList = projectResources.map((resource) => ({
  //   id: resource.id,
  //   title: resource.title,
  //   resourceUrl: resource.url,
  //   userName: `${resource.addedBy.member.firstName} ${resource.addedBy.member.lastName}`,
  //   userAvatarUrl: resource.addedBy.member.avatar,
  // }));

  // const iconMapping = {
  //   Frontend: ComputerDesktopIcon,
  //   "CSS Library": SwatchIcon,
  //   Backend: CodeBracketSquareIcon,
  //   "Project Management": ChartPieIcon,
  //   "Cloud Provider": CloudIcon,
  //   Hosting: ServerStackIcon,
  // };

  // type TechStackName =
  //   | "Frontend"
  //   | "CSS Library"
  //   | "Backend"
  //   | "Project Management"
  //   | "Cloud Provider"
  //   | "Hosting";

  // const techStackList = techStackDatas.map((techStackData) => ({
  //   title: techStackData.name,
  //   icon: iconMapping[techStackData.name as TechStackName],
  //   value: techStackData.teamTechStackItems.map((item) => item.name).join(", "),
  // }));

  return (
    <div className="flex w-full flex-col gap-x-6 max-[1470px]:gap-y-6 min-[1470px]:grid min-[1470px]:grid-cols-2">
      <div className="col-span-1 flex grow-[2] flex-col gap-y-6">
        {/* <CalendarWidget
          sprintsData={sprintsData ?? undefined}
          currentSprintNumber={currentSprintNumber}
          meetingsData={meetingsData}
          voyageNumber={voyageNumber}
          teamId={teamId}
        /> */}
        {/* <CheckInWidget
          user={user}
          currentSprintNumber={currentSprintNumber}
          teamId={teamId ?? ""}
        /> */}
        <VoyageSupport />
      </div>
      <MyVoyageOverviewContainer />
    </div>
  );
}
