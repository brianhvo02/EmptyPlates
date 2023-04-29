import { createSlice } from '@reduxjs/toolkit';
import fetchAPI, { GET, POST } from './fetch';
import { errorActions } from './errorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useMatch, useMatches, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { addCuisine, addCuisines, getCuisineFromState } from './cuisineSlice';
import { addNeighborhood, addNeighborhoods, getNeighborhoodFromState } from './neighborhoodSlice';
import { checkUpdate } from './utils';

// URL Helpers
export const restaurantUrl = urlId => urlId ? `/restaurants/${urlId}` : '/restaurants';
export const restaurantAPIUrl = urlId => '/api' + restaurantUrl(urlId);

// Slice of state
export const restaurantSlice = createSlice({
    name: 'restaurants',
    initialState: {},
    reducers: {
        addRestaurant: (state, action) => ({ ...state, [action.payload.urlId]: action.payload }),
        addRestaurants: checkUpdate('restaurants'),
        removeRestaurant: (state, action) => {
            delete state[action.payload.id];
        }
    },
});

// Actions
export const { addRestaurant, addRestaurants, removeRestaurant } = restaurantSlice.actions;
const { setRestaurantErrors } = errorActions;

// Selectors
export const getRestaurantObjectFromState = state => {
    const restaurantObject = Object.assign({}, state.entities.restaurants);

    if (Object.keys(restaurantObject) > 0){
        for (let urlId in restaurantObject) {
            restaurantObject[urlId].cuisine = getCuisineFromState(restaurantObject[urlId].cuisine)(state);
            restaurantObject[urlId].neighborhood = getNeighborhoodFromState(restaurantObject[urlId].neighborhood)(state);
        }
    }
    
    return restaurantObject;
}

export const getRestaurantsFromState = state => Object.values(getRestaurantObjectFromState(state));

export const getRestaurantFromState = urlId => state => {
    const restaurant = Object.assign({}, state.entities.restaurants[urlId]);
    if (Object.keys(restaurant) > 0) {
        restaurant.cuisine = getCuisineFromState(restaurant.cuisine)(state);
        restaurant.neighborhood = getNeighborhoodFromState(restaurant.neighborhood)(state);
    }

    return restaurant;
};

export const getRestaurantIds = state => Object.keys(state.entities.restaurants);

// Hooks
export const useRestaurants = () => useSelector(getRestaurantsFromState);
export const useRestaurantSlice = () => useSelector(getRestaurantObjectFromState);
export const useRestaurantIds = () => useSelector(getRestaurantIds);

export const useRestaurantShallow = () => {
    const create = useMatch('/restaurants/new');
    const show = useMatch('/restaurants/:restaurantId')?.params;
    const edit = useMatch('/restaurants/:restaurantId/edit')?.params;
    const { restaurantId } = show || edit || {};
    const isNew = !!create;
    const restaurant = useSelector(getRestaurantFromState(restaurantId));

    return { restaurant, isNew };
};

export const  useRestaurant = () => {
    const { restaurant, isNew } = useRestaurantShallow();
    const cuisine = useSelector(getCuisineFromState(restaurant.cuisineId));
    const neighborhood = useSelector(getNeighborhoodFromState(restaurant.neighborhoodId));
    if (cuisine && neighborhood) {
        restaurant.cuisine = cuisine;
        restaurant.neighborhood = neighborhood;
        delete restaurant.cuisineId;
        delete restaurant.neighborhoodId;
    }

    return { restaurant, isNew };
}

export const useFetchRestaurants = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getRestaurants());
    }, [dispatch]);
}

export const useFetchRestaurant = urlId => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getRestaurant(urlId));
    }, [dispatch, urlId]);
}

// Split payloads
export const splitRestaurantsPayload = payload => [
    addRestaurants(payload),
    addCuisines(payload),
    addNeighborhoods(payload)
];

const restaurantErrorsWrapped = errors => [setRestaurantErrors(errors)];

// Thunks
export const getRestaurants = () => dispatch => fetchAPI(
    restaurantAPIUrl(), { method: GET }, splitRestaurantsPayload, restaurantErrorsWrapped
).then(actions => actions.forEach(dispatch));

export const getRestaurant = urlId => dispatch => !urlId || fetchAPI(
    restaurantAPIUrl(urlId), { method: GET }, splitRestaurantsPayload, restaurantErrorsWrapped
).then(actions => actions.forEach(dispatch));

export const createRestaurant = restaurant => dispatch => fetchAPI(
    restaurantAPIUrl(), {
        method: POST,
        body: restaurant
    }, splitRestaurantsPayload, restaurantErrorsWrapped
).then(actions => actions.forEach(dispatch));

export const updateRestaurant = restaurant => dispatch => fetchAPI(
    restaurantAPIUrl(restaurant.get('restaurant[urlId]')), {
        method: 'PATCH',
        body: restaurant
    }, splitRestaurantsPayload, restaurantErrorsWrapped
).then(actions => actions.forEach(dispatch));

export const deleteRestaurant = restaurantId => dispatch => fetchAPI(
    restaurantAPIUrl(restaurantId), {
        method: 'DELETE'
    }, removeRestaurant, setRestaurantErrors
).then(dispatch);

// Reducer
export default restaurantSlice.reducer;