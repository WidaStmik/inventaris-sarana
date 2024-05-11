import { configureStore } from "@reduxjs/toolkit";
import { ruanganApi } from "./ruangan";
import { userApi } from "./user";

export const store = configureStore({
  reducer: {
    [ruanganApi.reducerPath]: ruanganApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ruanganApi.middleware, userApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
