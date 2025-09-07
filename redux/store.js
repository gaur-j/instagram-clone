import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import postReducer from "./postsSlice";
import profileReducer from "./profileSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
    }),
});
