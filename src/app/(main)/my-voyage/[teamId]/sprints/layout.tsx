"use client";

import "reflect-metadata";
import { useFetchMyTeamQuery } from "@/features/voyage-team/hooks/useFetchMyTeamQuery";

interface LayoutProps {
  children: React.ReactNode;
  params: {
    teamId: string;
  };
}

export default function Layout({ children, params }: LayoutProps) {
  const { teamId } = params;
  useFetchMyTeamQuery({ teamId });

  return <>{children}</>;
}
