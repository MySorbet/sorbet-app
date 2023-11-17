import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import UserType from '@/types/user';

type userState = {
  user: UserType;
};

const initialState = {
  user: {},
} as userState;

export const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: () => initialState,

    updateUserData: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
  },
});

export const { updateUserData, reset } = user.actions;
export default user.reducer;
