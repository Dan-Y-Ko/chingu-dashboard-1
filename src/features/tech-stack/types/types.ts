import type { TechStackItemVotes } from "@chingu-x/modules/tech-stack";
import type { Key } from "react";

export type CardType =
  | "Frontend"
  | "CSS Library"
  | "Backend"
  | "Project Management"
  | "Cloud Provider"
  | "Hosting";

export interface FinalizeTechStackPageProps {
  params: {
    teamId: string;
  };
}

export type SelectedItems = object | { [key: number]: number };

export type FinalizedItem = {
  id: number;
  title: string;
  techItems: TechItem[];
};
export type Vote = {
  votedBy: {
    member: {
      id: Key | null | undefined;
      avatar: string;
    };
  };
};

export type Tech = {
  techId: number;
  isSelected: boolean;
};

export type Category = {
  categoryId: number;
  techs: Tech[];
};

export interface TechItem {
  id: number;
  name: string;
  isSelected: boolean;
  teamTechStackItemVotes: TechStackItemVotes[];
}

export interface TechStackItem {
  id: number;
  name: string;
  teamTechStackItems: TechItem[];
}

export type setFinalizedListArgs = Category;
