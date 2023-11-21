import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import UserType from '@/types/user';

type userState = {
  user: UserType;
  users: UserType[];
};

const initialState = {
  user: {},
  users: []
} as userState;

export const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: () => initialState,

    updateUserData: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
    getUers: (state, action: PayloadAction<UserType[]>) => {
      state.users = action.payload
    }
  },
});

export const { updateUserData, getUers, reset } = user.actions;
export default user.reducer;
