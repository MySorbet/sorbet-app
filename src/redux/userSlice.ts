import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { User, UserWithId } from '@/types';

type userState = {
  user: UserWithId;
};

const initialState: userState = {
  user: {} as User,
};

export const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: () => initialState,
    updateUserData: (state, action: PayloadAction<UserWithId>) => {
      state.user = action.payload;
    },
  },
});

export const { updateUserData, reset } = user.actions;
export default user.reducer;
