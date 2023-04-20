import { createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

export const useModal = () => useSelector(state => state.ui.modal.value);

export const modalSlice = createSlice({
    name: 'modal',
    initialState: { value: null },
    reducers: {
        toggleModal: (state, action) => {
            state.value = action.payload
        }
    },
});
  
export const { toggleModal } = modalSlice.actions;
  
export default modalSlice.reducer;