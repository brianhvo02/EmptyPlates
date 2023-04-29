import { createSlice } from '@reduxjs/toolkit';
import fetchAPI, { GET } from './fetch';
import { errorActions } from './errorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

// URL Helpers
export const cuisineUrl = urlId => urlId ? `/cuisines/${urlId}` : '/cuisines';
export const cuisineAPIUrl = urlId => '/api' + cuisineUrl(urlId);

// Slice of state
export const cuisineSlice = createSlice({
    name: 'cuisines',
    initialState: {},
    reducers: {
        addCuisine: (state, action) => ({ ...state, [action.payload.id]: action.payload }),
        addCuisines: (state, action) => ({ ...state, ...action.payload.cuisines})
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
export const useCuisines = () => {
    const dispatch = useDispatch();
    const cuisines = useSelector(getCuisinesFromState);
    const cuisineSlice = useSelector(getCuisineObjectFromState);

    useEffect(() => {
        dispatch(getCuisines())
    }, [dispatch])

    return { dispatch, cuisines, cuisineSlice };
}

// Split payloads


// Thunks
export const getCuisine = urlId => dispatch => fetchAPI(
    cuisineAPIUrl(urlId), { method: GET }, addCuisine, setCuisineErrors
).then(dispatch);

export const getCuisines = () => dispatch => fetchAPI(
    cuisineAPIUrl(), { method: GET }, addCuisines, setCuisineErrors
).then(dispatch);

// Reducer
export default cuisineSlice.reducer;