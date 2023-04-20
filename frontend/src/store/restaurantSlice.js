import { createSlice } from '@reduxjs/toolkit';
import fetchAPI, { GET } from './fetch';
import { errorActions } from './errorSlice';
import { useSelector } from 'react-redux';

const { setRestaurantErrors } = errorActions;

export const restaurantUrl = urlId => urlId ? `/restaurants/${urlId}` : '/restaurants';
export const restaurantAPIUrl = urlId => '/api' + restaurantUrl(urlId);

export const getRestaurantsFromState = state => Object.values(state.entities.restaurants);
export const useRestaurants = () => useSelector(getRestaurantsFromState);

export const getRestaurant = urlId => dispatch => fetchAPI(
    restaurantAPIUrl(urlId), { method: GET }, addRestaurant, setRestaurantErrors
).then(dispatch);

export const getRestaurants = () => dispatch => fetchAPI(
    restaurantAPIUrl(), { method: GET }, addRestaurants, setRestaurantErrors
).then(dispatch);

export const restaurantSlice = createSlice({
    name: 'restaurants',
    initialState: {},
    reducers: {
        addRestaurant: (state, action) => ({ ...state, [action.payload.urlId]: action.payload }),
        addRestaurants: (state, action) => ({ ...state, ...action.payload.restaurants})
    },
});

export const { addRestaurant, addRestaurants } = restaurantSlice.actions;
  
export default restaurantSlice.reducer;