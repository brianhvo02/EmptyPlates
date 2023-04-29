import { createSlice } from '@reduxjs/toolkit';
import { NAMESPACES } from './namespaces';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

const namespaces = Object.values(NAMESPACES);

// URL Helpers


// Slice of state
export const errorSlice = createSlice({
    name: 'errors',
    initialState: Object.fromEntries(namespaces.map(namespace => [namespace, []])),
    reducers: Object.fromEntries(namespaces.map(namespace => [`set${namespace.slice(0, 1).toUpperCase()}${namespace.slice(1)}Errors`, (state, action) => {
        state[namespace] = action.payload
    }]).concat([['clearAll', () => Object.fromEntries(namespaces.map(namespace => [namespace, []])) ]]))
});

// Actions
export const errorActions = errorSlice.actions;

// Selectors
export const getErrorSlice = namespace => state => state.errors[namespace];

// Hooks
export const useError = namespace => useSelector(getErrorSlice(namespace));
export const useClearErrorsOnUnmount = () => {
    const dispatch = useDispatch();
    useEffect(() => () => dispatch(errorSlice.actions.clearAll()), []);
}

// Split payloads


// Thunks


// Reducer
export default errorSlice.reducer;






  
