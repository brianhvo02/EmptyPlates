import { createSlice } from '@reduxjs/toolkit';
import fetchAPI, { GET } from './fetch';
import { errorActions } from './errorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { checkUpdate } from './utils';
import { getRestaurantSliceFromState, splitRestaurantsPayload } from './restaurantSlice';
import _ from 'lodash';

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
export const getNeighborhoodSliceFromState = state => {
    const neighborhoodSlice = Object.assign({}, state.entities.neighborhoods);

    if (!_.isEmpty(neighborhoodSlice)){
        const restaurantSlice = getRestaurantSliceFromState(state);
        for (let id in neighborhoodSlice) {
            neighborhoodSlice[id].restaurants.map(restaurant => restaurantSlice[restaurant]);
        }
    }
    
    return neighborhoodSlice;
}

export const getNeighborhoodsFromState = state => Object.values(getNeighborhoodSliceFromState(state));

export const getNeighborhoodFromState = id => state => {
    const neighborhood = Object.assign({}, state.entities.neighborhoods[id]);
    if (!_.isEmpty(neighborhood)) {
        const restaurantSlice = getRestaurantSliceFromState(state);
        neighborhood.restaurants.map(restaurant => restaurantSlice[restaurant]);
    }

    return neighborhood;
};

// Hooks
export const useNeighborhoods = () => useSelector(getNeighborhoodsFromState);
export const useNeighborhoodSlice = () => useSelector(getNeighborhoodSliceFromState);
export const useNeighborhood = id => {
    const neighborhood = useSelector(getNeighborhoodFromState(id));
    const restaurants = useSelector(getRestaurantSliceFromState);
    neighborhood.restaurants = neighborhood.restaurants.map(restaurantId => restaurants[restaurantId]);

    return neighborhood;
}

export const useFetchNeighborhoods = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getNeighborhoods)
    }, [dispatch]);
}

// Split payloads
export const splitNeighborhoodsPayload = payload => [
    addNeighborhoods(payload), 
    ...splitRestaurantsPayload(payload)
];
const neighborhoodErrorsWrapped = errors => [setNeighborhoodErrors(errors)];

// Thunks
export const getNeighborhood = urlId => dispatch => fetchAPI(
    neighborhoodAPIUrl(urlId), { method: GET }, splitNeighborhoodsPayload, neighborhoodErrorsWrapped
).then(actions => actions.forEach(dispatch));

export const getNeighborhoods = dispatch => fetchAPI(
    neighborhoodAPIUrl(), { method: GET }, splitNeighborhoodsPayload, neighborhoodErrorsWrapped
).then(actions => actions.forEach(dispatch));

// Reducer
export default neighborhoodSlice.reducer;