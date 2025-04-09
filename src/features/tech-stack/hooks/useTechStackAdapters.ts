import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type {
  AddTechStackItemClientRequestDto,
  AddTechStackItemVoteClientRequestDto,
  DeleteTechStackItemClientRequestDto,
  EditTechStackItemClientRequestDto,
  FetchTechStackClientRequestDto,
  FinalizeTechStackClientRequestDto,
  RemoveTechStackItemVoteClientRequestDto,
  TechStackClientAdapter,
} from "@chingu-x/modules/tech-stack";
import { useTechStackStateSelector } from "./useTechStackStateSelector";

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

export function useRemoveTechStackVote() {
  const removeTechStackVote = async ({
    teamTechItemId,
  }: RemoveTechStackItemVoteClientRequestDto) =>
    await techStackAdapter.removeTechStackItemVote({ teamTechItemId });

  return { removeTechStackVote };
}

export function useDeleteTechStack() {
  const deleteTechStack = async ({
    teamTechItemId,
  }: DeleteTechStackItemClientRequestDto) =>
    await techStackAdapter.deleteTechStackItem({ teamTechItemId });

  return { deleteTechStack };
}

export function useCheckisFinalized() {
  const { techStack } = useTechStackStateSelector();

  const techStackIsFinalized = techStackAdapter.checkIfFinalized({ techStack });

  return { techStackIsFinalized };
}

export function useFinalizeTechStack() {
  const finalizeTechStack = async ({
    techId,
    isSelected,
  }: FinalizeTechStackClientRequestDto) =>
    await techStackAdapter.finalizeTechStack({ techId, isSelected });

  return { finalizeTechStack };
}
