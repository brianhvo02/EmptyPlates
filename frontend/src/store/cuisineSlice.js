import { createSlice } from '@reduxjs/toolkit';
import fetchAPI, { GET } from './fetch';
import { errorActions } from './errorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { checkUpdate } from './utils';

// URL Helpers
export const cuisineUrl = urlId => urlId ? `/cuisines/${urlId}` : '/cuisines';
export const cuisineAPIUrl = urlId => '/api' + cuisineUrl(urlId);

// Slice of state
export const cuisineSlice = createSlice({
    name: 'cuisines',
    initialState: {},
    reducers: {
        addCuisine: (state, action) => ({ ...state, [action.payload.id]: action.payload }),
        addCuisines: checkUpdate('cuisines')
    },
});

// Actions
export const { addCuisine, addCuisines } = cuisineSlice.actions;
const { setCuisineErrors } = errorActions;

// Selectors
export const getCuisineObjectFromState = state => state.entities.cuisines;
export const getCuisinesFromState = state => Object.values(state.entities.cuisines);
export const getCuisineFromState = cuisineId => state => state.entities.cuisines[cuisineId];

// Hooks
export const useCuisines = () => useSelector(getCuisinesFromState);
export const useCuisineSlice = () => useSelector(getCuisineObjectFromState);

export const useFetchCuisines = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getCuisines);
    }, [dispatch]);
}

// Split payloads


// Thunks
export const getCuisine = urlId => dispatch => fetchAPI(
    cuisineAPIUrl(urlId), { method: GET }, addCuisine, setCuisineErrors
).then(dispatch);

export const getCuisines = dispatch => fetchAPI(
    cuisineAPIUrl(), { method: GET }, addCuisines, setCuisineErrors
).then(dispatch);

// Reducer
export default cuisineSlice.reducer;