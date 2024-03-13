import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import UserType from '@/types/user';

type userState = {
  user: UserType;
  users: UserType[];
  role: string;
  toggleOpenSidebar: boolean;
  toggleProfileEdit: boolean;
};

const initialState: userState = {
  user: {} as UserType,
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

    updateUserData: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
    setUsers: (state, action: PayloadAction<UserType[]>) => {
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
