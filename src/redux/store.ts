import { configureStore } from '@reduxjs/toolkit';

import contractReducer from './contractSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    userReducer,
    contractReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
