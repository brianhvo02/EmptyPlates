import { createSlice } from '@reduxjs/toolkit';
import fetchAPI, { DELETE, GET, PATCH, POST } from './fetch';
import { errorActions } from './errorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useMatch } from 'react-router-dom';
import { useEffect } from 'react';
import { addCuisines, getCuisineFromState } from './cuisineSlice';
import { addNeighborhoods, getNeighborhoodFromState } from './neighborhoodSlice';
import { checkUpdate } from './utils';
import { addRestaurants, restaurantAPIUrl, useRestaurant } from './restaurantSlice';
import { addReservations } from './reservationSlice';

// URL Helpers
export const availableTableAPIUrl = (restaurantId, id) => 
    restaurantAPIUrl(restaurantId) + (id ? `/available_tables/${id}` : '/available_tables');

const date = new Date();
const hour = date.getHours();
const minutes = date.getMinutes();
const nearestHalfHour = new Date(`${date.toLocaleDateString()} ${hour + (minutes < 30 ? 0 : 1)}:${minutes < 30 ? 30 : 0}`);

// Slice of state
export const reservationSearchSlice = createSlice({
    name: 'reservationSearch',
    initialState: {
        partySize: 2,
        date: nearestHalfHour.toLocaleDateString('en-US', { 
            month: 'short', 
            day: '2-digit', 
            year: 'numeric' 
        }),
        time: nearestHalfHour.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        }),
        query: '',
        type: ''
    },
    reducers: {
        setParams: (state, action) => ({ ...state, ...action.payload })
    },
});

// Actions
export const { setParams } = reservationSearchSlice.actions;
export const { setSearchErrors } = errorActions.setSearchErrors;

// Selectors
export const getReservationSearchSlice = state => state.reservationSearch;

// Hooks
export const useReservationSearchSlice = () => useSelector(getReservationSearchSlice);

// Split payloads
export const splitSearchPayload = payload => [
    addRestaurants(payload),
    addCuisines(payload),
    addNeighborhoods(payload)
];
const searchErrorsWrapped = errors => [setSearchErrors(errors)];

// Thunks
export const fetchSearch = query => dispatch => fetchAPI(
    '/api/search?' + query.toString(), { method: GET, passData: true }, splitSearchPayload, searchErrorsWrapped
).then(({ data, actions }) => {
    actions.forEach(dispatch);
    return data;
});

// Reducer
export default reservationSearchSlice.reducer;