import { useUser } from "@/store/hooks";

interface UseFetchSprintsProps {
  teamId: string;
}

export async function useFetchSprintsProps({ teamId }: UseFetchSprintsProps) {
  const user = useUser();
}
