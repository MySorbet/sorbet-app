import { configureStore } from '@reduxjs/toolkit';

import profileReducer from './profileSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    userReducer,
    profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
