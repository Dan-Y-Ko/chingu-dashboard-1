import { Avatar } from "@chingu-x/components/avatar";

import { AvatarGroup } from "@chingu-x/components/avatar-group";
import GetIcon from "./GetIcons";
import type { SelectedCategory } from "@/features/tech-stack/utils/getSelectedTechItems";
import FinalizedTechListItem from "./FinalizedTechListItem";

interface FinalizedTechStackCardProps {
  title: string;
  data: SelectedCategory;
}

export default function FinalizedTechStackCard({
  title,
  data,
}: FinalizedTechStackCardProps) {
  return (
    <>
      <div className="h-80 min-w-[420px] rounded-lg bg-base-200 p-6 text-base-300 sm:w-96 [&>*]:my-4">
        <div className="flex flex-row justify-start">
          {GetIcon(title)}
          <span className="self-center text-xl font-semibold text-base-300">
            {title}
          </span>
        </div>
        {data.techItems.map((item) => (
          <FinalizedTechListItem
            key={item.id}
            name={item.name}
            votes={item.teamTechStackItemVotes}
          />
        ))}
      </div>
    </>
  );
}
