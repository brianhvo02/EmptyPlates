import { createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

// URL Helpers


// Slice of state
export const modalSlice = createSlice({
    name: 'modal',
    initialState: { value: null },
    reducers: {
        toggleModal: (state, action) => {
            state.value = action.payload
        }
    },
});

// Actions
export const { toggleModal } = modalSlice.actions;

// Selectors


// Hooks
export const useModal = () => useSelector(state => state.ui.modal.value);

// Split payloads


// Thunks


// Reducer
export default modalSlice.reducer;



  

  
