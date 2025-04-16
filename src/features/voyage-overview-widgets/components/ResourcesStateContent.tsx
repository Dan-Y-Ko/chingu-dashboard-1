import React from "react";
import type { VoyageResource } from "@chingu-x/modules/voyage-resources";
import ResourceItem from "./ResourceItem";

interface ResourcesStateContentProps {
  contentObject?: VoyageResource[];
}
function ResourcesStateContent({ contentObject }: ResourcesStateContentProps) {
  return (
    <div className="flex h-full flex-col justify-center">
      <p className="mb-4 text-xl font-semibold">Recently Shared</p>
      <div className="flex max-h-[200px] w-full flex-col overflow-auto pr-3">
        {contentObject?.map(
          ({
            title,
            id,
            url,
            addedBy: {
              member: { firstName, lastName, avatar },
            },
          }) => (
            <ResourceItem
              key={id}
              id={Number(id)}
              resourceUrl={url}
              title={title}
              userName={`${firstName} ${lastName}`}
              userAvatarUrl={avatar}
            />
          ),
        )}
      </div>
    </div>
  );
}

export default ResourcesStateContent;
