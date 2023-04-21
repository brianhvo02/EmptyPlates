import { createSlice } from '@reduxjs/toolkit';
import fetchAPI, { GET } from './fetch';
import { errorActions } from './errorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useMatch } from 'react-router-dom';
import { useEffect } from 'react';

const { setRestaurantErrors } = errorActions;

export const restaurantUrl = urlId => urlId ? `/restaurants/${urlId}` : '/restaurants';
export const restaurantAPIUrl = urlId => '/api' + restaurantUrl(urlId);

export const useRestaurants = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getRestaurants());
    }, [dispatch]);
    const restaurants = useSelector(state => Object.values(state.entities.restaurants));
    return { dispatch, restaurants };
};
// export const useRestaurant = urlId => useSelector(state => state.entities.restaurants[urlId]);
export const useRestaurant = () => {
    const dispatch = useDispatch();
    const match = useMatch('/restaurants/:restaurantId');
    const restaurantId = !match || match.params.restaurantId;

    useEffect(() => {
        dispatch(getRestaurant(restaurantId));
    }, [dispatch, restaurantId]);
    
    const restaurant = useSelector(state => state.entities.restaurants[restaurantId]);
    return { dispatch, restaurant };
};

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