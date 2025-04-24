import { configureStore } from "@reduxjs/toolkit";
import cryptoReducer, { CryptoState } from "./slices/cryptoSlice";
import { loadState, saveState, clearState } from "../utils/localStorage";

export interface RootState {
  crypto: CryptoState;
}

clearState();

const persistedState = loadState();

export const store = configureStore<RootState>({
  reducer: {
    crypto: cryptoReducer,
  },
  preloadedState: persistedState,
});

let timeoutId: ReturnType<typeof setTimeout>;
store.subscribe(() => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(() => {
    saveState({
      crypto: store.getState().crypto,
    });
  }, 1000);
});

export type AppDispatch = typeof store.dispatch;
