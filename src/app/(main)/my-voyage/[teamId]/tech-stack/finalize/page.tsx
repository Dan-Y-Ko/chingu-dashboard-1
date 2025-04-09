import FinalizeTechBanner from "@/features/tech-stack/components/FinalizeTechBanner";
import FinalizeTechList from "@/features/tech-stack/components/FinalizeTechList";

export default function FinalizeTechStackPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center [&>*]:my-5 [&>*]:w-[871px]">
      <FinalizeTechBanner />
      <FinalizeTechList />
    </div>
  );
}
