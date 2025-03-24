"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, type Variants, motion } from "framer-motion";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import type {
  EditMeetingClientRequestDto,
  EditMeetingResponseDto,
} from "@chingu-x/modules/sprint-meeting";
import { Forms } from "@chingu-x/modules/forms";
import { Spinner } from "@chingu-x/components/spinner";
import { cn } from "@chingu-x/components/tw-merge";
import { useAppDispatch } from "@/shared/store";
import { onOpenModal } from "@/store/features/modal/modalSlice";
import { sprintMeetingAdapter } from "@/features/sprint-meeting/hooks/useSprintMeetingAdapters";
import { useAddSprintMeetingPlanningReviewSectionMutation } from "@/features/sprint-meeting/hooks/useAddSprintMeetingPlanningReviewSectionMutation";

interface SectionBaseProps {
  params: {
    meetingId: string;
    sprintNumber: string;
  };
  id: number;
  title: string;
  icon: React.JSX.Element;
  isAdded: boolean;
  children: React.ReactNode;
  reorderSections?: (title: string) => void;
}

export default function SectionBase({
  params,
  id,
  title,
  icon,
  isAdded,
  children,
  reorderSections,
}: SectionBaseProps) {
  const [meetingId] = [params.meetingId];
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);

  // notes section
  const { mutate: editMeeting, isPending: editMeetingPending } = useMutation<
    EditMeetingResponseDto,
    Error,
    EditMeetingClientRequestDto
  >({
    mutationFn: editMeetingMutation,
    onSuccess: () => {
      reorderSections && reorderSections(title);
      setIsOpen(true);
    },
    onError: (error: Error) => {
      dispatch(
        onOpenModal({ type: "error", content: { message: error.message } }),
      );
    },
  });

  async function editMeetingMutation({
    meetingId,
  }: EditMeetingClientRequestDto): Promise<EditMeetingResponseDto> {
    const notes = "";

    return await sprintMeetingAdapter.editMeeting({
      meetingId,
      notes,
    });
  }

  // Planning & Retrospective&Review Sections
  const {
    isAddSprintMeetingReviewSectionPending,
    addSprintMeetingReviewSectionMutation,
  } = useAddSprintMeetingPlanningReviewSectionMutation({
    id,
    meetingId,
    reorderSections,
    setIsOpen,
  });

  useEffect(() => {
    if (isAdded) setIsOpen(true);
  }, [isAdded]);

  const handleAddSection = () => {
    if (id !== Number(Forms.notes)) {
      addSprintMeetingReviewSectionMutation({ formId: id, meetingId });
    } else {
      editMeeting({ meetingId });
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  function renderButtonContent() {
    if (isAddSprintMeetingReviewSectionPending || editMeetingPending) {
      return <Spinner />;
    }

    return <PlusCircleIcon className="h-10 w-10 text-base-300" />;
  }

  const panelVariants: Variants = {
    initial: {
      height: 0,
    },
    animate: {
      height: "auto",
      transition: {
        duration: 0.4,
      },
    },
    exit: {
      height: 0,
      transition: {
        duration: 0.4,
        delay: 0.3,
      },
    },
  };

  const innerContentVariants: Variants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.3,
        delay: 0.4,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-base-100 bg-base-100 p-10",
        isAdded && "bg-base-200",
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-x-2 text-[25px] font-medium capitalize text-base-300 [&>*:first-child]:h-[30px] [&>*:first-child]:w-[30px]">
          {icon}
          {title}
        </h2>
        {!isAdded && (
          <button
            type="button"
            onClick={handleAddSection}
            aria-label="add section"
            disabled={
              isAddSprintMeetingReviewSectionPending || editMeetingPending
            }
          >
            {renderButtonContent()}
          </button>
        )}
        <AnimatePresence mode="popLayout">
          {isAdded && isOpen && (
            <motion.button
              key={`open-${title}`}
              initial={{ rotateX: "0deg" }}
              animate={{ rotateX: "180deg" }}
              exit={{ rotateX: "0deg" }}
              transition={{ duration: 0.3 }}
              id={`accordion-header-${title}`}
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${title}`}
              type="button"
              onClick={() => handleToggle()}
              aria-label={`close ${title} panel`}
            >
              <ChevronDownIcon className="h-10 w-10 text-base-300" />
            </motion.button>
          )}
          {isAdded && !isOpen && (
            <motion.button
              key={`close-${title}`}
              initial={{ rotateX: "0deg" }}
              animate={{ rotateX: "180deg" }}
              exit={{ rotateX: "0deg" }}
              transition={{ duration: 0.3 }}
              id={`accordion-header-${title}`}
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${title}`}
              type="button"
              onClick={() => handleToggle()}
              aria-label={`open ${title} panel`}
            >
              <ChevronUpIcon className="h-10 w-10 text-base-300" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.section
            key={`accordion-panel-${title}`}
            variants={panelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            id={`accordion-panel-${title}`}
            aria-labelledby={`accordion-header-${title}`}
          >
            <motion.div
              key="innerContent"
              variants={innerContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {children}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
