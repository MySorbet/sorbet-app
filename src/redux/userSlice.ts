import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { User } from '@/types';

type userState = {
  user: User;
  toggleOpenSidebar: boolean;
  toggleProfileEdit: boolean;
};

const initialState: userState = {
  user: {} as User,
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
    setOpenSidebar: (state, action: PayloadAction<boolean>) => {
      state.toggleOpenSidebar = action.payload;
    },
    setProfileEdit: (state, action: PayloadAction<boolean>) => {
      state.toggleProfileEdit = action.payload;
    },
  },
});

export const { updateUserData, reset, setOpenSidebar, setProfileEdit } =
  user.actions;
export default user.reducer;
