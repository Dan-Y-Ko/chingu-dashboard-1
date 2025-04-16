import type { Ideation } from "@chingu-x/modules/ideation";
import React from "react";

interface IdeationStateContentProps {
  contentObject?: Ideation;
}
function IdeationStateContent({ contentObject }: IdeationStateContentProps) {
  return (
    <div className="flex max-h-[255px] grow flex-row">
      <div className="flex h-full flex-col justify-between gap-y-4">
        <p className="text-xl font-semibold">{contentObject?.title}</p>
        <p className="text-base font-semibold text-neutral-focus">
          Project Idea
        </p>
        <p className="overflow-auto text-base font-medium">
          {contentObject?.description}
        </p>
      </div>
    </div>
  );
}

export default IdeationStateContent;
