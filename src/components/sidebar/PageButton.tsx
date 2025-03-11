import { useState } from "react";
import Link from "next/link";
import { Tooltip } from "@chingu-x/components/tooltip";
import { Button } from "@chingu-x/components/button";
import { type PageProperty } from "./Sidebar";
import { cn } from "@/lib/utils";
import { useCurrentVoyageTeam } from "@/store/hooks";
import { current } from "@reduxjs/toolkit";

interface PageButtonProps {
  element: PageProperty;
  onClick: (element: PageProperty) => void;
  selectedButton: string;
  isOpen: boolean;
  link: string;
  setHoveredButton: (element: string | null) => void;
  ariaLabel: string;
  myVoyageDisplayName: string;
}

export default function PageButton({
  element,
  onClick,
  selectedButton,
  isOpen,
  link,
  setHoveredButton,
  ariaLabel,
  myVoyageDisplayName,
}: PageButtonProps) {
  const isActive = selectedButton.includes(link);
  const currentVoyageTeam = useCurrentVoyageTeam();

  const getButtonText = (page: string) => {
    if (!isOpen) return "";

    if (page === myVoyageDisplayName) {
      return (
        <div className="flex flex-col items-start justify-center">
          <span className="text-base font-semibold leading-4 text-base-300">
            {myVoyageDisplayName}
          </span>
          <span className="text-[10px] font-medium leading-[10px] text-base-300">
            {currentVoyageTeam[0]?.voyageRole.name}
          </span>
        </div>
      );
    }

    return page;
  };

  const [tooltipHovered, setTooltipHovered] = useState(false);

  return (
    <li>
      <Link href={link}>
        <Tooltip
          content={element.name}
          position="right"
          tooltipWidth="small"
          isDisplay={!isOpen}
          hovered={tooltipHovered}
        >
          <Button
            type="button"
            size="lg"
            variant="neutral"
            data-tip={element.name}
            aria-label={ariaLabel}
            className={cn(
              "h-[3.125rem] w-[3.125rem] justify-center bg-base-200 p-0 text-neutral-focus",
              isActive && "bg-primary-content text-base-300",
              isOpen && "flex w-full justify-start px-6",
              element.marginBottom,
            )}
            onMouseEnter={() => {
              setHoveredButton(element.name);
              setTooltipHovered(true);
            }}
            onMouseLeave={() => {
              setTooltipHovered(false);
              setHoveredButton(null);
            }}
            onClick={() => onClick(element)}
          >
            {element.icon}
            {getButtonText(element.name)}
          </Button>
        </Tooltip>
      </Link>
    </li>
  );
}
