import PreVoyageLinks from "./PreVoyageLinks";

export default function KnowldgeBaseWidget() {
  return (
    <div className="h-full w-full rounded-2xl border-2 border-base-100 bg-base-200 p-6">
      <div>
        <p className="text-[25px] font-semibold">
          Before your Voyage starts...
        </p>
        <p className="text-base font-medium">
          Explore Chingu&apos;s Knowledge Hub to prepare for your Voyage with
          information on tools, Agile, Scrum, Git, Teamwork, and more.
        </p>
      </div>
      <PreVoyageLinks />
    </div>
  );
}
