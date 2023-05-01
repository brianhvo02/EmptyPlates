import { createSlice } from '@reduxjs/toolkit';
import fetchAPI, { DELETE, GET, PATCH, POST } from './fetch';
import { errorActions } from './errorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useMatch } from 'react-router-dom';
import { useEffect } from 'react';
import { addCuisines, getCuisineFromState } from './cuisineSlice';
import { addNeighborhoods, getNeighborhoodFromState } from './neighborhoodSlice';
import { checkUpdate } from './utils';

// URL Helpers
export const restaurantUrl = urlId => urlId ? `/restaurants/${urlId}` : '/restaurants';
export const restaurantAPIUrl = urlId => '/api' + restaurantUrl(urlId);
export const restaurantAPIQuery = (params, urlId) => 
    `${restaurantAPIUrl(urlId)}?${new URLSearchParams(params).toString()}`;
export const availableTableAPIUrl = (urlId, id) => 
    restaurantAPIUrl(urlId) + (id ? `/available_tables/${id}` : '/available_tables');

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
export const getRestaurantSliceFromState = state => {
    const restaurantSlice = Object.assign({}, state.entities.restaurants);

    if (Object.keys(restaurantSlice) > 0){
        for (let urlId in restaurantSlice) {
            restaurantSlice[urlId].cuisine = getCuisineFromState(restaurantSlice[urlId].cuisineId)(state);
            restaurantSlice[urlId].neighborhood = getNeighborhoodFromState(restaurantSlice[urlId].neighborhoodId)(state);
        }
    }
    
    return restaurantSlice;
}

export const getRestaurantsFromState = state => Object.values(getRestaurantSliceFromState(state));

export const getRestaurantFromState = urlId => state => {
    const restaurant = Object.assign({}, state.entities.restaurants[urlId]);
    if (Object.keys(restaurant) > 0) {
        restaurant.cuisine = getCuisineFromState(restaurant.cuisineId)(state);
        restaurant.neighborhood = getNeighborhoodFromState(restaurant.neighborhoodId)(state);
    }

    return restaurant;
};

export const getRestaurantIds = state => Object.keys(state.entities.restaurants);

// Hooks
export const useRestaurants = () => useSelector(getRestaurantsFromState);
export const useRestaurantSlice = () => useSelector(getRestaurantSliceFromState);
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

export const useRestaurant = () => {
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
export const getRestaurants = (limit = 20) => dispatch => fetchAPI(
    restaurantAPIQuery({limit}), { method: GET }, splitRestaurantsPayload, restaurantErrorsWrapped
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
        method: PATCH,
        body: restaurant
    }, splitRestaurantsPayload, restaurantErrorsWrapped
).then(actions => actions.forEach(dispatch));

export const deleteRestaurant = restaurantId => dispatch => fetchAPI(
    restaurantAPIUrl(restaurantId), {
        method: DELETE
    }, removeRestaurant, setRestaurantErrors
).then(dispatch);

export const createAvailableTable = (restaurantId, availableTable) => dispatch => fetchAPI(
    availableTableAPIUrl(restaurantId), {
        method: POST,
        body: { availableTable }
    }, splitRestaurantsPayload, restaurantErrorsWrapped
).then(actions => actions.forEach(dispatch));

// Reducer
export default restaurantSlice.reducer;