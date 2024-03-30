import { configureStore } from "@reduxjs/toolkit";
import { ruanganApi } from "./ruangan";

export const store = configureStore({
  reducer: {
    [ruanganApi.reducerPath]: ruanganApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ruanganApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
