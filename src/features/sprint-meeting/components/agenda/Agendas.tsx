import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import type { Agenda } from "@chingu-x/modules/sprint-meeting";
import NoAgendasState from "./NoAgendasState";
import AgendaTopic from "./AgendaTopic";
import AgendaHeader from "./AgendaHeader";
import routePaths from "@/shared/utils/routePaths";
import Divider from "@/features/sprint-meeting/components/Divider";
import {
  useGetAgendaById,
  useGetCompletedTopics,
  useGetIncompletedTopics,
  useGetSprintAgendas,
} from "@/features/sprint-meeting/hooks/useSprintMeetingAdapters";
import { useSprintMeetingStateSelector } from "@/features/sprint-meeting/hooks/useSprintMeetingStateSelector";
import { useChangeAgendaTopicStatusMutation } from "@/features/sprint-meeting/hooks/useChangeAgendaTopicStatusMutation";

interface AgendasProps {
  params: {
    teamId: string;
    meetingId: string;
    sprintNumber: string;
  };
  topics: Agenda[];
}

export default function Agendas({ params, topics }: AgendasProps) {
  const [teamId, meetingId, sprintNumber] = [
    params.teamId,
    params.meetingId,
    params.sprintNumber,
  ];
  const router = useRouter();
  const meeting = useSprintMeetingStateSelector();
  const { agendas } = useGetSprintAgendas({ meetingId });
  const { incompletedTopics } = useGetIncompletedTopics({ agendas });
  const { completedTopics } = useGetCompletedTopics({ agendas });
  const { getAgendaById } = useGetAgendaById();
  const { isChangeAgendaTopicStatusPending, changeAgendaTopicStatusMutation } =
    useChangeAgendaTopicStatusMutation({ meetingId });

  const changeStatus = (agendaId: string) => {
    const agendaTopic = getAgendaById({
      meeting,
      meetingId,
      agendaId,
    });

    const newStatus = !agendaTopic.status;

    changeAgendaTopicStatusMutation({ agendaId, status: newStatus });
  };

  const editTopic = (agendaTopicId: number) => {
    router.push(
      routePaths.editTopicPage(
        teamId,
        sprintNumber,
        meetingId,
        agendaTopicId.toString(),
      ),
    );
  };

  const dividerIsVisible = completedTopics.length !== 0;

  return (
    <div className="flex w-full flex-col items-center justify-between rounded-2xl border border-base-100 bg-base-200 p-10">
      <AgendaHeader
        teamId={teamId}
        sprintNumber={sprintNumber}
        meetingId={meetingId}
      />
      {/* INCOMPLETED TOPICS */}
      {topics.length === 0 && <NoAgendasState />}
      <ul className="flex w-full flex-col gap-y-5">
        {incompletedTopics.map((topic) => (
          <AgendaTopic
            key={topic.id}
            topic={topic}
            editTopic={() => editTopic(topic.id)}
            changeStatus={changeStatus}
            statusButtonDisabled={isChangeAgendaTopicStatusPending}
          />
        ))}
      </ul>
      {/* DIVIDER */}
      <AnimatePresence>
        {dividerIsVisible && (
          <motion.div layout className="w-full">
            <Divider title="Completed Topics" className="bg-base-200 py-5" />
          </motion.div>
        )}
      </AnimatePresence>
      {/* COMPLETED TOPICS */}
      <ul className="flex w-full flex-col gap-y-5">
        {completedTopics.map((topic) => (
          <AgendaTopic
            key={topic.id}
            topic={topic}
            editTopic={() => editTopic(topic.id)}
            changeStatus={changeStatus}
            statusButtonDisabled={isChangeAgendaTopicStatusPending}
          />
        ))}
      </ul>
    </div>
  );
}
