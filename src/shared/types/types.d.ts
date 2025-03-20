// only put global types here
export interface AppError {
  message: string;
}

declare module "redux-persist/lib/storage" {
  import { type WebStorage } from "redux-persist/es/types";

  const storage: WebStorage;

  export default storage;
}
