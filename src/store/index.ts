// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";

// Load persisted state from localStorage

export const store = configureStore({
  reducer: {},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
