import { createSlice } from '@reduxjs/toolkit';
import fetchAPI, { GET } from './fetch';
import { errorActions } from './errorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

const { setCuisineErrors } = errorActions;

export const cuisineUrl = urlId => urlId ? `/cuisines/${urlId}` : '/cuisines';
export const cuisineAPIUrl = urlId => '/api' + cuisineUrl(urlId);

export const getCuisineFromState = cuisineId => state => state.entities.cuisines[cuisineId];
export const getCuisinesFromState = state => Object.values(state.entities.cuisines);
export const getCuisineObjectFromState = state => state.entities.cuisines;

export const useCuisines = () => {
    const dispatch = useDispatch();
    const cuisines = useSelector(getCuisinesFromState);
    const cuisineSlice = useSelector(getCuisineObjectFromState);

    useEffect(() => {
        dispatch(getCuisines())
    }, [dispatch])

    return { dispatch, cuisines, cuisineSlice };
}

export const getCuisine = urlId => dispatch => fetchAPI(
    cuisineAPIUrl(urlId), { method: GET }, addCuisine, setCuisineErrors
).then(dispatch);

export const getCuisines = () => dispatch => fetchAPI(
    cuisineAPIUrl(), { method: GET }, addCuisines, setCuisineErrors
).then(dispatch);

export const cuisineSlice = createSlice({
    name: 'cuisines',
    initialState: {},
    reducers: {
        addCuisine: (state, action) => ({ ...state, [action.payload.id]: action.payload }),
        addCuisines: (state, action) => ({ ...state, ...action.payload.cuisines})
    },
});

export const { addCuisine, addCuisines } = cuisineSlice.actions;
  
export default cuisineSlice.reducer;