import { resolve } from "@chingu-x/modules/resolver";
import { TYPES } from "@chingu-x/modules/di-types";
import type {
  FetchCurrentUserClientRequestDto,
  UserClientAdapter,
} from "@chingu-x/modules/user";

const userAdapter = resolve<UserClientAdapter>(TYPES.UserClientAdapter);

export function useFetchUser() {
  const fetchUser = ({ currentDate }: FetchCurrentUserClientRequestDto) =>
    userAdapter.fetchUser({ currentDate });

  return { fetchUser };
}
