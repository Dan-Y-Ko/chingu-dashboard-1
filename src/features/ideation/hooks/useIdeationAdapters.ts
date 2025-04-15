import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type {
  AddIdeationVoteClientRequestDto,
  FetchIdeationClientRequestDto,
  Ideation,
  IdeationClientAdapter,
  RemoveIdeationVoteClientRequestDto,
} from "@chingu-x/modules/ideation";
import { useIdeationStateSelector } from "./useIdeationStateSelector";
import { useUserStateSelector } from "@/features/user/hooks/useUserStateSelector";

export const ideationAdapter = resolve<IdeationClientAdapter>(
  TYPES.IdeationClientAdapter,
);

export function useFetchIdeation() {
  const fetchIdeation = async ({ teamId }: FetchIdeationClientRequestDto) =>
    await ideationAdapter.fetchIdeation({ teamId });

  return { fetchIdeation };
}

interface UseGetIdeationByIdProps {
  ideationId: number;
}

export function useGetIdeationById({ ideationId }: UseGetIdeationByIdProps) {
  const { projectIdeas } = useIdeationStateSelector();

  const ideation = ideationAdapter.getIdeationById({
    ideation: projectIdeas,
    ideationId,
  });

  return { ideation };
}

interface UseIsCurrentUserVoteProps {
  ideation: Ideation;
}

export function useIsCurrentUserVote({ ideation }: UseIsCurrentUserVoteProps) {
  const user = useUserStateSelector();

  const isCurrentUserVote = ideationAdapter.isCurrentUserVote({
    ideation,
    user,
  });

  return { isCurrentUserVote };
}

export function useAddIdeationVote() {
  const addIdeationVote = async ({
    ideationId,
  }: AddIdeationVoteClientRequestDto) =>
    await ideationAdapter.addIdeationVote({ ideationId });

  return { addIdeationVote };
}

export function useRemoveIdeationVote() {
  const removeIdeationVote = async ({
    ideationId,
  }: RemoveIdeationVoteClientRequestDto) =>
    await ideationAdapter.removeIdeationVote({ ideationId });

  return { removeIdeationVote };
}

interface UseHasCurrenUserVoteProps {
  ideation: Ideation;
}

export function useHasCurrenUserVote({ ideation }: UseHasCurrenUserVoteProps) {
  const user = useUserStateSelector();

  const hasCurrentUserVote = ideationAdapter.hasCurrentUserVote({
    ideation,
    user,
  });

  return { hasCurrentUserVote };
}
