import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type {
  AddTechStackItemClientRequestDto,
  AddTechStackItemVoteClientRequestDto,
  EditTechStackItemClientRequestDto,
  FetchTechStackClientRequestDto,
  TechStackClientAdapter,
} from "@chingu-x/modules/tech-stack";

export const techStackAdapter = resolve<TechStackClientAdapter>(
  TYPES.TechStackClientAdapter,
);

export function useFetchTechStack() {
  const fetchTechStack = async ({ teamId }: FetchTechStackClientRequestDto) =>
    await techStackAdapter.fetchTechStack({ teamId });

  return { fetchTechStack };
}

export function useAddTechStack() {
  const addTechStack = async ({
    teamId,
    techName,
    techCategoryId,
    voyageTeamMemberId,
  }: AddTechStackItemClientRequestDto) =>
    await techStackAdapter.addTechStackItem({
      teamId,
      techName,
      techCategoryId,
      voyageTeamMemberId,
    });

  return { addTechStack };
}

export function useEditTechStack() {
  const editTechStack = async ({
    teamTechItemId,
    techName,
  }: EditTechStackItemClientRequestDto) =>
    await techStackAdapter.editTechStackItem({ teamTechItemId, techName });

  return { editTechStack };
}

export function useAddTechStackVote() {
  const addTechStackVote = async ({
    teamTechItemId,
  }: AddTechStackItemVoteClientRequestDto) =>
    await techStackAdapter.addTechStackItemVote({ teamTechItemId });

  return { addTechStackVote };
}
