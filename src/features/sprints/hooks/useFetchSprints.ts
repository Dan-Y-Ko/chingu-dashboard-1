import { useUserStateSelector } from "@/features/user/hooks/useUserStateSelector";

interface UseFetchSprintsProps {
  teamId: string;
}

export async function useFetchSprintsProps({ teamId }: UseFetchSprintsProps) {
  const user = useUserStateSelector();
}
