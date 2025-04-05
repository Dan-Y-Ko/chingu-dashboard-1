import React, { useEffect, useState } from "react";
import {
  SortOption,
  type VoyageResource,
} from "@chingu-x/modules/voyage-resources";
import ResourceInput from "./ResourceInput";
import SortingButton from "./SortingButton";
import ResourceCard from "./ResourceCard";
import EmptyBanner from "./EmptyBanner";
import { useUserStateSelector } from "@/features/user/hooks/useUserStateSelector";
import { useGetVoyageResourceDate } from "@/features/timezone/hooks/useTimezoneAdapters";
import { useSortVoyageResources } from "@/features/voyage-resources/hooks/useVoyageResourcesAdapters";

interface ResourceContainerProps {
  data: VoyageResource[];
}

export default function ResourcesContainer({ data }: ResourceContainerProps) {
  const [byNewest, setByNewest] = useState(true);
  const [voyageResources, setVoyageResources] =
    useState<VoyageResource[]>(data);
  const { timezone } = useUserStateSelector();
  const { voyageResourceDate } = useGetVoyageResourceDate({
    voyageResources: voyageResources,
    timezone,
  });
  const { sortVoyageResources } = useSortVoyageResources();

  const sortResources = () => {
    const voyageResourceCopy = [...voyageResources];

    const sortedVoyageResource = sortVoyageResources({
      order: byNewest ? SortOption.ASC : SortOption.DESC,
      voyageResources: voyageResourceCopy,
    });

    setVoyageResources(sortedVoyageResource);
    setByNewest(!byNewest);
  };

  useEffect(() => {
    setVoyageResources(data);
  }, [data]);

  return (
    <>
      <div className="grid grid-cols-[1fr_150px] items-center">
        <ResourceInput />
        <SortingButton
          onClick={sortResources}
          type={byNewest}
          isDisabled={data.length === 0}
        />
      </div>
      <div className="flex flex-col gap-y-6">
        {voyageResourceDate?.length ? (
          voyageResourceDate.map((item) => (
            <ResourceCard
              key={item.id}
              resourceId={item.id}
              title={item.title}
              user={item.addedBy.member}
              date={item.createdAt}
              userId={item.addedBy.member.id}
              url={item.url}
            />
          ))
        ) : (
          <EmptyBanner />
        )}
      </div>
    </>
  );
}
