import { createSlice } from '@reduxjs/toolkit';
import fetchAPI, { GET } from './fetch';
import { errorActions } from './errorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { checkUpdate } from './utils';

// URL Helpers
export const neighborhoodUrl = urlId => urlId ? `/neighborhoods/${urlId}` : '/neighborhoods';
export const neighborhoodAPIUrl = urlId => '/api' + neighborhoodUrl(urlId);

// Slice of state
export const neighborhoodSlice = createSlice({
    name: 'neighborhoods',
    initialState: {},
    reducers: {
        addNeighborhood: (state, action) => ({ ...state, [action.payload.id]: action.payload }),
        addNeighborhoods: checkUpdate('neighborhoods')
    },
});

// Actions
export const { addNeighborhood, addNeighborhoods } = neighborhoodSlice.actions;
const { setNeighborhoodErrors } = errorActions;

// Selectors
export const getNeighborhoodObjectFromState = state => state.entities.neighborhoods;
export const getNeighborhoodsFromState = state => Object.values(state.entities.neighborhoods);
export const getNeighborhoodFromState = neighborhoodId => state => state.entities.neighborhoods[neighborhoodId];

// Hooks
export const useNeighborhoods = () => useSelector(getNeighborhoodsFromState);
export const useNeighborhoodSlice = () => useSelector(getNeighborhoodObjectFromState);

export const useFetchNeighborhoods = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getNeighborhoods)
    }, [dispatch]);
}

// Split payloads


// Thunks
export const getNeighborhood = urlId => dispatch => fetchAPI(
    neighborhoodAPIUrl(urlId), { method: GET }, addNeighborhood, setNeighborhoodErrors
).then(dispatch);

export const getNeighborhoods = dispatch => fetchAPI(
    neighborhoodAPIUrl(), { method: GET }, addNeighborhoods, setNeighborhoodErrors
).then(dispatch);

// Reducer
export default neighborhoodSlice.reducer;