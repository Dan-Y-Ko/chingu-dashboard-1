import FinalizeIdeationBanner from "@/features/ideation/components/FinalizeIdeationBanner";
import FinalizeIdeationList from "@/features/ideation/components/FinalizeIdeationList";

export default function FinalizeIdeationPage() {
  return (
    <div className="flex w-full flex-col items-center gap-y-10">
      <FinalizeIdeationBanner />
      <FinalizeIdeationList />
    </div>
  );
}
