import { createSlice } from '@reduxjs/toolkit';
import { NAMESPACES } from './namespaces';

const namespaces = Object.values(NAMESPACES);

export const errorSlice = createSlice({
    name: 'errors',
    initialState: Object.fromEntries(namespaces.map(namespace => [namespace, new Array()])),
    reducers: Object.fromEntries(namespaces.map(namespace => [`set${namespace.slice(0, 1).toUpperCase()}${namespace.slice(1)}Errors`, (state, action) => {
        state[namespace] = action.payload
    }]))
});

export const getErrorSlice = namespace => state => state.errors[namespace];
  
export const errorActions = errorSlice.actions;
  
export default errorSlice.reducer;