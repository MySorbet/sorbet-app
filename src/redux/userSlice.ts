import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import UserType from '@/types/user';

type userState = {
  user: UserType;
  users: UserType[];
};

const initialState: userState = {
  user: {} as UserType,
  users: [] as UserType[],
};

export const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: () => initialState,

    updateUserData: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
    getUsers: (state, action: PayloadAction<UserType[]>) => {
      state.users = action.payload;
    },
  },
});

export const { updateUserData, getUsers, reset } = user.actions;
export default user.reducer;
