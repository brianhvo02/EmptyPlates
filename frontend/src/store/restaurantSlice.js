import { createSlice } from '@reduxjs/toolkit';
import fetchAPI, { DELETE, GET, PATCH, POST } from './fetch';
import { errorActions } from './errorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useMatch } from 'react-router-dom';
import { useEffect } from 'react';
import { addCuisines, getCuisineFromState, useCuisine, useCuisines } from './cuisineSlice';
import { addNeighborhoods, getNeighborhoodFromState, useNeighborhood, useNeighborhoodShallow } from './neighborhoodSlice';
import { checkUpdate } from './utils';
import { addAvailableTables, useAvailableTableSlice } from './availableTableSlice';
import { addReservation, addReservations, useReservationSlice } from './reservationSlice';
import _ from 'lodash';
import { addUsers } from './userSlice';

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
            delete state[Object.keys(action.payload.restaurants)[0]];
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

export const useRestaurantShallow = id => {
    const create = useMatch('/restaurants/new');
    const show = useMatch('/restaurants/:restaurantId')?.params;
    const edit = useMatch('/restaurants/:restaurantId/edit')?.params;
    const { restaurantId } = show || edit || { restaurantId: id } || {};
    const isNew = !!create;
    const restaurant = useSelector(getRestaurantFromState(restaurantId));

    return { restaurant, isNew };
};

export const useRestaurant = id => {
    const { restaurant, isNew } = useRestaurantShallow(id);
    const cuisine = useCuisine(restaurant.cuisineId);
    const neighborhood = useNeighborhoodShallow(restaurant.neighborhoodId);
    const availableTableSlice = useAvailableTableSlice();
    const reservationSlice = useReservationSlice();
    if (restaurant && !_.isEmpty(cuisine) && !_.isEmpty(neighborhood) && !_.isEmpty(availableTableSlice) && !_.isEmpty(reservationSlice)) {
        const availableTables = restaurant.availableTables.map(availableTableId => availableTableSlice[availableTableId]);
        const reservations = availableTables.map(availableTime => availableTime.reservations.map(reservationId => reservationSlice[reservationId])).flat();
        
        return {
            restaurant: { ...restaurant, cuisine, neighborhood, availableTables, reservations },
            isNew
        };
    }

    return {}
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
    addUsers(payload),
    addCuisines(payload),
    addNeighborhoods(payload),
    addAvailableTables(payload),
    addReservations(payload)
];

export const removeRestaurantsPayload = payload => [
    removeRestaurant(payload),
    addUsers(payload),
    addCuisines(payload),
    addNeighborhoods(payload),
    addAvailableTables(payload),
    addReservations(payload)
];

const restaurantErrorsWrapped = errors => [setRestaurantErrors(errors)];

// Thunks
export const getRestaurants = (limit = 20) => dispatch => fetchAPI(
    restaurantAPIQuery({limit}), { method: GET }, splitRestaurantsPayload, restaurantErrorsWrapped
).then(actions => {
    actions.forEach(dispatch);
    return actions.length > 1;
});

export const getRestaurant = urlId => dispatch => !urlId || fetchAPI(
    restaurantAPIUrl(urlId), { method: GET }, splitRestaurantsPayload, restaurantErrorsWrapped
).then(actions => {
    actions.forEach(dispatch);
    return actions.length > 1;
});

export const createRestaurant = restaurant => dispatch => fetchAPI(
    restaurantAPIUrl(), {
        method: POST,
        body: restaurant,
        passData: true
    }, splitRestaurantsPayload, restaurantErrorsWrapped
).then(({data, actions}) => {
    actions.forEach(dispatch);
    return actions.length > 1 ? data.id : false;
});

export const updateRestaurant = restaurant => dispatch => fetchAPI(
    restaurantAPIUrl(restaurant.get('restaurant[urlId]')), {
        method: PATCH,
        body: restaurant,
    }, splitRestaurantsPayload, restaurantErrorsWrapped
).then(actions => {
    actions.forEach(dispatch);
    return actions.length > 1;
});

export const deleteRestaurant = restaurantId => dispatch => fetchAPI(
    restaurantAPIUrl(restaurantId), {
        method: DELETE
    }, removeRestaurantsPayload, restaurantErrorsWrapped
).then(actions => {
    actions.forEach(dispatch);
    return actions.length > 1;
});

export const createAvailableTable = (restaurantId, availableTable) => dispatch => fetchAPI(
    availableTableAPIUrl(restaurantId), {
        method: POST,
        body: { availableTable }
    }, splitRestaurantsPayload, restaurantErrorsWrapped
).then(actions => {
    actions.forEach(dispatch);
    return actions.length > 1;
});

// Reducer
export default restaurantSlice.reducer;