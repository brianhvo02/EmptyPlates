import { createSlice } from '@reduxjs/toolkit';

export const restaurantSlice = createSlice({
    name: 'restaurant',
    initialState: {},
    reducers: {
        create: (state, action) => {}
    },
});
  
  // Action creators are generated for each case reducer function
export const { create } = restaurantSlice.actions
  
export default restaurantSlice.reducer