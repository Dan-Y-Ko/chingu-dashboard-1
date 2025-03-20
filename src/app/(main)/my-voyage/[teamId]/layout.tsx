"use client";

import "reflect-metadata";
import useCheckCurrentVoyageTeam from "@/shared/hooks/useCheckCurrentVoyageTeam";

interface LayoutProps {
  params: {
    teamId: string;
  };
  children: React.ReactNode;
}

export default function Layout({ params, children }: LayoutProps) {
  const { teamId } = params;

  useCheckCurrentVoyageTeam({ teamId });

  return children;
}
