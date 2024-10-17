"use client";

import {
  useDispatch as useDispatchBase,
  useSelector as useSelectorBase,
} from "react-redux";

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import userFormReducer from "./slices/useForm.slice";
import hotelReducer from "./slices/hotelcard.slice";

export const store = configureStore({
  reducer: {
    authReducer,
    userFormReducer,
    hotel: hotelReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

type AppDispatch = typeof store.dispatch;

export const useDispatch = () => useDispatchBase<AppDispatch>();

export const useSelector = <TSelected = unknown>(
  selector: (state: RootState) => TSelected
): TSelected => useSelectorBase<RootState, TSelected>(selector);
