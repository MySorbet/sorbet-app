import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { User } from '@/types';

type userState = {
  user: User;
  users: User[];
  role: string;
  toggleOpenSidebar: boolean;
  toggleProfileEdit: boolean;
};

const initialState: userState = {
  user: {} as User,
  users: [],
  role: 'freelancer',
  toggleOpenSidebar: false,
  toggleProfileEdit: false,
};

export const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: () => initialState,

    updateUserData: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
    },
    setOpenSidebar: (state, action: PayloadAction<boolean>) => {
      state.toggleOpenSidebar = action.payload;
    },
    setProfileEdit: (state, action: PayloadAction<boolean>) => {
      state.toggleProfileEdit = action.payload;
    },
  },
});

export const { updateUserData, setUsers, setRole, reset, setOpenSidebar, setProfileEdit } = user.actions;
export default user.reducer;
