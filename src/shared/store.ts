import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import ideationReducer from "@/store/features/ideation/ideationSlice";
import authReducer from "@/features/auth/store/authSlice";
import resourceReducer from "@/store/features/resources/resourcesSlice";
import userReducer from "@/features/user/store/userSlice";
import myTeamReducer from "@/features/voyage-team/store/myTeamSlice";
import sprintReducer from "@/features/sprints/store/sprintSlice";
import featuresReducer from "@/features/features/store/featuresSlice";
import techStackReducer from "@/store/features/techStack/techStackSlice";
import sprintMeetingReducer from "@/store/features/sprint-meeting/sprintMeetingSlice";
import currentVoyageTeamReducer from "@/features/voyage-team/store/currentVoyageTeamSlice";
import modalReducer from "@/store/features/modal/modalSlice";

const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null);
  },
  setItem(_key: string, value: string) {
    return Promise.resolve(value);
  },
  removeItem() {
    return Promise.resolve();
  },
});

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["ideation", "sprint", "user"],
};

// Root reducer should be used as import directly only for tests
export const rootReducer = combineReducers({
  modal: modalReducer,
  auth: authReducer,
  user: userReducer,
  ideation: ideationReducer,
  myTeam: myTeamReducer,
  features: featuresReducer,
  resources: resourceReducer,
  sprint: sprintReducer,
  sprintMeeting: sprintMeetingReducer,
  techStack: techStackReducer,
  currentVoyageTeam: currentVoyageTeamReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (MiddlewareArray) =>
    MiddlewareArray({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV === "development" ? true : false,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
