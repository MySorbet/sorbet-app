// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// import { WidgetType } from '@/types/profile';

// type profileState = {
//   widgets: WidgetType[];
// };

// const initialState = {
//   widgets: [],
// } as profileState;

// export const profile = createSlice({
//   name: 'profile',
//   initialState,
//   reducers: {
//     reset: () => initialState,

//     initwidgets: (state, action: PayloadAction<WidgetType[]>) => {
//       state.widgets = action.payload;
//     },
//     addWidget: (state, action: PayloadAction<WidgetType>) => {
//       if (state.widgets == null) {
//         state.widgets = [action.payload];
//       } else {
//         state.widgets = [...state.widgets, action.payload];
//       }
//     },
//   },
// });

// export const { initwidgets, addWidget, reset } = profile.actions;
// export default profile.reducer;
