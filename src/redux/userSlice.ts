import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import UserType from '@/types/user';

type userState = {
  user: UserType;
  users: UserType[];
  role: string;
};

const initialState: userState = {
  user: {} as UserType,
  users: [],
  role: 'freelancer',
};

export const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: () => initialState,

    updateUserData: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
    setUsers: (state, action: PayloadAction<UserType[]>) => {
      state.users = action.payload;
    },
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
    },
  },
});

export const { updateUserData, setUsers, setRole, reset } = user.actions;
export default user.reducer;
