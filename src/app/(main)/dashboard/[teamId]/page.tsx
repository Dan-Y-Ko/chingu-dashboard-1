import { redirect } from "next/navigation";
import VoyageDashboardPage from "@/app/(main)/dashboard/components/voyage-dashboard/VoyageDashboardPage";
import PreVoyageDashboard from "@/app/(main)/my-voyage/[teamId]/voyage-dashboard/pre-voyage/page";
import { getCurrentVoyageTeam } from "@/shared/utils/getCurrentVoyageTeam";
import routePaths from "@/shared/utils/routePaths";

interface VoyageMemberDashboardPageProps {
  params: {
    teamId: string;
  };
}
async function VoyageMemberDashboardPage({
  params,
}: VoyageMemberDashboardPageProps) {
  const [user, error] = await getUser();
  const teamId = Number(params.teamId);
  const { currentTeam, isStarted } = getCurrentVoyageTeam({
    user,
    error,
    teamId,
  });

  if (!currentTeam) {
    redirect(routePaths.dashboardPage());
  }

  return isStarted ? (
    <VoyageDashboardPage teamId={params.teamId} />
  ) : (
    <PreVoyageDashboard />
  );
}

export default VoyageMemberDashboardPage;
